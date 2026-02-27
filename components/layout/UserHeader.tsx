'use client';

import Link from 'next/link';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { getDistrict } from '@/lib/data/bangladesh';
import { Profile } from '@/types';

export default function UserHeader({ profile }: { profile: Profile | null }) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const router = useRouter();
    const supabase = createClient();
    const dist = profile ? getDistrict(profile.selected_district_id || profile.district_id) : null;

    async function logout() {
        await supabase.auth.signOut();
        router.push('/login');
    }

    return (
        <>
            {/* Viewing bar */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-500 text-white text-center py-1.5 px-4 text-xs font-semibold tracking-wide">
                📍 বর্তমানে দেখছেন: {dist ? `${dist.name} জেলা, ${dist.divisionName} বিভাগ` : 'লোড হচ্ছে...'}
            </div>

            {/* Header */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-40" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div className="flex items-center justify-between h-14 px-4">
                    <button onClick={() => setDrawerOpen(true)} className="w-9 h-9 flex items-center justify-center text-xl text-gray-600 rounded-full hover:bg-gray-100 transition-all">☰</button>
                    <div className="flex flex-col items-center">
                        <span className="text-lg font-extrabold text-primary-600 leading-tight">{dist ? dist.name : 'আমার'} <span className="text-gray-800">City</span></span>
                        <span className="text-[10px] text-gray-400 font-semibold tracking-widest">app</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Link href="/notifications" className="w-9 h-9 flex items-center justify-center text-lg text-gray-600 rounded-full hover:bg-gray-100 transition-all">🔔</Link>
                        <Link href="/settings" className="w-9 h-9 flex items-center justify-center text-lg text-gray-600 rounded-full hover:bg-gray-100 transition-all">⚙️</Link>
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
                        <nav className="flex-1 p-3 space-y-1">
                            {[{ href: '/dashboard', icon: '🏠', label: 'হোম' }, { href: '/settings', icon: '⚙️', label: 'সেটিং' }, { href: '/profile', icon: '👤', label: 'প্রোফাইল' }, { href: '/notifications', icon: '🔔', label: 'নোটিফিকেশন' }, { href: '/contact', icon: '📞', label: 'যোগাযোগ' }].map(l => (
                                <Link key={l.href} href={l.href} onClick={() => setDrawerOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-primary-50 hover:text-primary-600 text-sm font-medium transition-all">
                                    <span className="text-lg">{l.icon}</span>{l.label}
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
