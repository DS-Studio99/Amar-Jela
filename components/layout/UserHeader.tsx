'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { getDistrict } from '@/lib/data/bangladesh';
import { Profile } from '@/types';

interface NotifToast {
    id: string;
    title: string;
    message: string;
}

export default function UserHeader({ profile, unreadCount = 0 }: { profile: Profile | null; unreadCount?: number }) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [toast, setToast] = useState<NotifToast | null>(null);
    const [badge, setBadge] = useState(unreadCount);
    const router = useRouter();
    const supabase = createClient();
    const dist = profile ? getDistrict(profile.selected_district_id || profile.district_id) : null;

    // Real-time notification listener
    useEffect(() => {
        if (!profile?.id) return;

        const channel = supabase
            .channel('user-notifications')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'user_notifications',
                filter: `user_id=eq.${profile.id}`,
            }, (payload: { new: { id: string; title: string; message: string } }) => {
                // Show toast
                setToast({ id: payload.new.id, title: payload.new.title, message: payload.new.message });
                setBadge(prev => prev + 1);
                // Auto-dismiss after 5s
                setTimeout(() => setToast(null), 5000);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [profile?.id]);

    async function logout() {
        await supabase.auth.signOut();
        router.push('/login');
    }

    return (
        <>
            {/* Toast Notification */}
            {toast && (
                <div className="fixed top-2 left-1/2 -translate-x-1/2 z-[70] w-[90%] max-w-[420px] animate-toast">
                    <div className="bg-white border border-primary-200 rounded-2xl shadow-2xl p-3 flex items-start gap-3" onClick={() => { setToast(null); router.push('/notifications'); }}>
                        <div className="w-9 h-9 bg-primary-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0">🔔</div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-gray-800 truncate">{toast.title}</h4>
                            <p className="text-[11px] text-gray-500 truncate">{toast.message}</p>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); setToast(null); }} className="text-gray-400 hover:text-gray-600 text-xs mt-0.5">✕</button>
                    </div>
                </div>
            )}

            {/* Viewing bar */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-500 text-white text-center py-1 px-4 text-[10px] font-semibold tracking-wide">
                📍 বর্তমানে দেখছেন: {dist ? `${dist.name} জেলা, ${dist.divisionName} বিভাগ` : 'লোড হচ্ছে...'}
            </div>

            {/* Header */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-40" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div className="flex items-center justify-between h-12 px-3">
                    <button onClick={() => setDrawerOpen(true)} className="w-8 h-8 flex items-center justify-center text-lg text-gray-600 rounded-full hover:bg-gray-100 transition-all">☰</button>
                    <div className="flex flex-col items-center">
                        <span className="text-base font-extrabold text-primary-600 leading-tight">{dist ? dist.name : 'আমার'} <span className="text-gray-800">City</span></span>
                        <span className="text-[9px] text-gray-400 font-semibold tracking-widest">app</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                        <Link href="/notifications" className="relative w-8 h-8 flex items-center justify-center text-base text-gray-600 rounded-full hover:bg-gray-100 transition-all">
                            🔔
                            {badge > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[8px] font-extrabold rounded-full flex items-center justify-center shadow-sm">
                                    {badge > 9 ? '9+' : badge}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </header>

            {/* Side Drawer */}
            {drawerOpen && (
                <div className="fixed inset-0 z-50 flex">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
                    <div className="relative w-72 bg-white h-full z-10 flex flex-col animate-slide-up" style={{ animation: 'slideRight 0.25s ease' }}>
                        {/* Drawer Header */}
                        <div className="bg-gradient-to-br from-primary-600 to-primary-800 p-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">👤</div>
                                <div>
                                    <div className="text-white font-bold text-base">{profile?.name || '—'}</div>
                                    <div className="text-white/70 text-xs">{profile?.phone || '—'}</div>
                                </div>
                            </div>
                            {dist && (
                                <div className="mt-3 bg-white/15 rounded-xl px-3 py-2">
                                    <div className="text-white/60 text-[10px]">বর্তমান জেলা</div>
                                    <div className="text-white font-semibold text-sm">{dist.name}, {dist.divisionName}</div>
                                </div>
                            )}
                        </div>
                        {/* Links */}
                        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                            {[{ href: '/dashboard', icon: '🏠', label: 'হোম' }, { href: '/profile', icon: '👤', label: 'প্রোফাইল' }, { href: '/notifications', icon: '🔔', label: 'নোটিফিকেশন' }, { href: '/contact', icon: '📞', label: 'যোগাযোগ' }].map(l => (
                                <Link key={l.href} href={l.href} onClick={() => setDrawerOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-primary-50 hover:text-primary-600 text-sm font-medium transition-all">
                                    <span className="text-lg">{l.icon}</span>{l.label}
                                </Link>
                            ))}

                            {/* Divider */}
                            <div className="pt-2 pb-1 px-4">
                                <div className="h-px bg-gray-100" />
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-2">আরও</p>
                            </div>

                            {[{ href: '/about-developer', icon: '👨‍💻', label: 'ডেভেলপার সম্পর্কে' }, { href: '/privacy', icon: '🔒', label: 'প্রাইভেসি নোটিশ' }, { href: '/terms', icon: '📜', label: 'শর্তাবলী' }, { href: '/legal', icon: '⚖️', label: 'আইনি নোটিশ' }].map(l => (
                                <Link key={l.href} href={l.href} onClick={() => setDrawerOpen(false)} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-700 text-[13px] font-medium transition-all">
                                    <span className="text-base">{l.icon}</span>{l.label}
                                </Link>
                            ))}

                            <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl text-purple-700 hover:bg-purple-50 text-sm font-medium transition-all border border-purple-100 mt-2">
                                <span className="text-lg">🛡️</span>অ্যাডমিন প্যানেল
                            </Link>
                        </nav>
                        <div className="p-3 border-t border-gray-100">
                            <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 text-sm font-semibold transition-all">
                                <span className="text-lg">🚪</span>লগআউট
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
