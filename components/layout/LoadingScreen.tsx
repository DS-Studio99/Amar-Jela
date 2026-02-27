'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function LoadingScreen() {
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => setLoading(false), 100);
        return () => clearTimeout(timer);
    }, [pathname]);

    if (!loading) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center transition-opacity duration-300" style={{ opacity: loading ? 1 : 0 }}>
            {/* Logo */}
            <div className="text-5xl mb-4" style={{ animation: 'loadingPulse 1.5s ease-in-out infinite' }}>
                🗺️
            </div>
            <h1 className="text-lg font-extrabold text-primary-600 mb-1">আমার জেলা</h1>
            <p className="text-[10px] text-gray-400 font-semibold tracking-widest uppercase mb-6">লোড হচ্ছে...</p>

            {/* Animated dots */}
            <div className="flex items-center gap-2">
                <div className="loading-dot w-2.5 h-2.5 rounded-full bg-primary-500"></div>
                <div className="loading-dot w-2.5 h-2.5 rounded-full bg-primary-500"></div>
                <div className="loading-dot w-2.5 h-2.5 rounded-full bg-primary-500"></div>
            </div>
        </div>
    );
}
