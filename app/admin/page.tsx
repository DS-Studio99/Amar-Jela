'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AdminLoginPage() {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const supabase = createClient();

    async function login() {
        setLoading(true); setError('');
        const trimmedIdentifier = identifier.trim();
        const email = trimmedIdentifier.includes('@') ? trimmedIdentifier : `${trimmedIdentifier}@amarjela.app`;
        const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err || !data.user) { setError('ইমেইল বা পাসওয়ার্ড সঠিক নয়।'); setLoading(false); return; }
        // Check admin role
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single();
        if (profile?.role !== 'admin') { await supabase.auth.signOut(); setError('আপনার অ্যাডমিন পারমিশন নেই।'); setLoading(false); return; }
        router.push('/admin/dashboard');
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-br from-primary-600 to-primary-800 px-8 py-10 text-center">
                    <div className="text-5xl mb-3">🗺️</div>
                    <h1 className="text-2xl font-extrabold text-white">আমার জেলা</h1>
                    <div className="mt-2 inline-flex items-center bg-white/15 rounded-full px-3 py-1 text-xs text-white font-bold gap-1">🔐 ADMIN ACCESS</div>
                </div>
                <div className="p-6 space-y-4">
                    {error && <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm border border-red-200">{error}</div>}
                    <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-1.5">ইমেইল বা ফোন</label>
                        <input className="input-field" placeholder="admin@example.com" value={identifier} onChange={e => setIdentifier(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} />
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-1.5">পাসওয়ার্ড</label>
                        <input className="input-field" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} />
                    </div>
                    <button onClick={login} disabled={loading} className="btn-primary w-full">
                        {loading ? '⏳ লগইন হচ্ছে...' : '🔐 অ্যাডমিন লগইন'}
                    </button>
                    <p className="text-center text-xs text-gray-400">
                        অ্যাডমিন একাউন্টে <code className="bg-gray-100 px-1 rounded text-[11px]">role=admin</code> সেট করতে হবে Supabase-এ।
                    </p>
                </div>
            </div>
        </div>
    );
}
