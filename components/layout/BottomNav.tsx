'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
    { href: '/dashboard', icon: '🏠', label: 'হোম' },
    { href: '/contact', icon: '📞', label: 'যোগাযোগ' },
    { href: '/notifications', icon: '🔔', label: 'নোটিফিকেশন' },
    { href: '/profile', icon: '👤', label: 'প্রোফাইল' },
];

export default function BottomNav() {
    const pathname = usePathname();
    return (
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-gray-100 z-50" style={{ boxShadow: '0 -2px 12px rgba(0,0,0,0.06)' }}>
            <div className="flex items-center h-12">
                {NAV_ITEMS.map((item) => {
                    const active = pathname === item.href;
                    if (item.href === '/dashboard') {
                        return (
                            <Link key={item.href} href={item.href} className={`flex-1 flex flex-col items-center justify-center h-full transition-all ${active ? 'text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}>
                                {active ? (
                                    <div className="flex items-center gap-1 bg-primary-500 text-white px-3.5 py-1 rounded-xl font-semibold text-xs shadow-md" style={{ boxShadow: '0 3px 10px rgba(26,158,92,0.35)' }}>
                                        <span className="text-sm">{item.icon}</span>{item.label}
                                    </div>
                                ) : (
                                    <>
                                        <span className="text-lg">{item.icon}</span>
                                        <span className="text-[9px] mt-0.5">{item.label}</span>
                                    </>
                                )}
                            </Link>
                        );
                    }
                    return (
                        <Link key={item.href} href={item.href} className={`flex-1 flex flex-col items-center justify-center h-full transition-all ${active ? 'text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}>
                            <span className={`text-lg transition-transform ${active ? 'scale-110' : ''}`}>{item.icon}</span>
                            <span className="text-[9px] mt-0.5 font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
