'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const NAV_ITEMS = [
    { href: '/admin/dashboard', icon: '📊', label: 'ড্যাশবোর্ড' },
    { href: '/admin/categories', icon: '🗂️', label: 'ক্যাটাগরি' },
    { href: '/admin/content', icon: '📋', label: 'কন্টেন্ট' },
    { href: '/admin/districts', icon: '🗺️', label: 'জেলার তথ্য' },
    { href: '/admin/users', icon: '👥', label: 'ব্যবহারকারী' },
    { href: '/admin/notices', icon: '📢', label: 'নোটিশ' },
    { href: '/admin/notifications', icon: '🔔', label: 'নোটিফিকেশন' },
    { href: '/admin/banners', icon: '🖼️', label: 'ব্যানার/বিজ্ঞাপন' },
    { href: '/admin/reports', icon: '🚩', label: 'রিপোর্ট' },
    { href: '/admin/ads', icon: '📢', label: 'এড সিস্টেম' },
    { href: '/admin/content-ads', icon: '🎨', label: 'কন্টেন্ট এডস' },
    { href: '/admin/developer', icon: '👨‍💻', label: 'ডেভেলপার তথ্য' },
];

export default function AdminSidebarClient() {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();
    const [open, setOpen] = useState(false);

    async function logout() {
        await supabase.auth.signOut();
        router.push('/admin');
    }

    const SidebarContent = () => (
        <div className="w-64 bg-gray-900 text-white h-full flex flex-col">
            <div className="p-5 border-b border-gray-700/50">
                <div className="flex items-center gap-3">
                    <div className="text-3xl">🗺️</div>
                    <div>
                        <div className="font-extrabold text-base">আমার জেলা</div>
                        <div className="text-[11px] text-gray-400 font-semibold">Admin Panel</div>
                    </div>
                </div>
            </div>
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 py-2">Main Menu</div>
                {NAV_ITEMS.map(item => (
                    <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${pathname === item.href ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}>
                        <span className="text-lg">{item.icon}</span>{item.label}
                    </Link>
                ))}
            </nav>
            <div className="p-3 border-t border-gray-700/50 space-y-1">
                <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-yellow-400 hover:bg-yellow-500/10 text-sm font-medium transition-all">
                    <span className="text-lg">🏠</span>ব্যবহারকারী অ্যাপ
                </Link>
                <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 text-sm font-medium transition-all">
                    <span className="text-lg">🚪</span>লগআউট
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop sidebar */}
            <div className="hidden lg:block h-full"><SidebarContent /></div>
            {/* Mobile toggle */}
            <button onClick={() => setOpen(true)} className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center text-lg shadow-lg">☰</button>
            {open && (
                <div className="fixed inset-0 z-50 flex lg:hidden">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
                    <div className="relative h-full"><SidebarContent /></div>
                </div>
            )}
        </>
    );
}
