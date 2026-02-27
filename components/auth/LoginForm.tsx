'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginForm() {
    const router = useRouter();
    const supabase = createClient();
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleLogin() {
        setLoading(true); setError('');
        const trimmedIdentifier = identifier.trim();
        const email = trimmedIdentifier.includes('@') ? trimmedIdentifier : `${trimmedIdentifier}@amarjela.app`;
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) { setError('ফোন নম্বর বা পাসওয়ার্ড সঠিক নয়।'); }
        else { router.push('/dashboard'); }
        setLoading(false);
    }

    return (
        <div className="p-6 space-y-4">
            {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{error}</div>}
            <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1.5">ফোন নম্বর বা ইমেইল</label>
                <input
                    className="input-field"
                    placeholder="01XXXXXXXXX বা email@example.com"
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                />
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1.5">পাসওয়ার্ড</label>
                <div className="relative">
                    <input
                        className="input-field pr-12"
                        placeholder="পাসওয়ার্ড লিখুন"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleLogin()}
                        type={showPw ? 'text' : 'password'}
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-3 text-gray-400 text-lg">
                        {showPw ? '🙈' : '👁️'}
                    </button>
                </div>
            </div>
            <button onClick={handleLogin} disabled={loading} className="btn-primary w-full">
                {loading ? '⏳ লগইন হচ্ছে...' : '🔐 লগইন করুন'}
            </button>
        </div>
    );
}
