'use client';

import { useState } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';

export default function AuthPage() {
    const [tab, setTab] = useState<'login' | 'register'>('login');

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-gray-100 to-blue-50 flex flex-col items-center justify-center p-4">
            {/* Logo */}
            <div className="flex flex-col items-center mb-8 animate-float">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl flex items-center justify-center text-4xl shadow-2xl mb-3" style={{ boxShadow: '0 12px 40px rgba(26,158,92,0.4)' }}>
                    🗺️
                </div>
                <h1 className="text-3xl font-extrabold text-primary-800 tracking-tight">আমার জেলা</h1>
                <p className="text-sm text-gray-500 mt-1">আপনার জেলার সকল তথ্য এক জায়গায়</p>
            </div>

            {/* Auth Card */}
            <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-gray-100">
                    {(['login', 'register'] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`flex-1 py-4 font-semibold text-sm transition-all border-b-2 ${tab === t ? 'text-primary-600 border-primary-500 bg-primary-50/50' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
                        >
                            {t === 'login' ? '🔐 লগইন' : '📝 রেজিষ্ট্রেশন'}
                        </button>
                    ))}
                </div>

                {tab === 'login' ? <LoginForm /> : <RegisterForm />}

                <div className="text-center text-sm text-gray-400 pb-5 px-6">
                    {tab === 'login' ? (
                        <span>অ্যাকাউন্ট নেই? <button onClick={() => setTab('register')} className="text-primary-600 font-semibold hover:underline">রেজিষ্ট্রেশন করুন</button></span>
                    ) : (
                        <span>আগেই অ্যাকাউন্ট আছে? <button onClick={() => setTab('login')} className="text-primary-600 font-semibold hover:underline">লগইন করুন</button></span>
                    )}
                </div>
            </div>
        </div>
    );
}
