'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Division } from '@/types';
import { useTheme } from 'next-themes';

interface Props {
    userId: string;
    currentDivisionId: string;
    currentDistrictId: string;
    currentDistrictName: string;
    divisions: Division[];
}

export default function SettingsClient({ userId, currentDivisionId, currentDistrictId, currentDistrictName, divisions }: Props) {
    const [divId, setDivId] = useState(currentDivisionId);
    const [distId, setDistId] = useState(currentDistrictId);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const router = useRouter();
    const supabase = createClient();
    const districts = divisions.find(d => d.id === divId)?.districts || [];
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    async function save() {
        if (!divId || !distId) return;
        setSaving(true);
        await supabase.from('profiles').update({
            selected_division_id: divId,
            selected_district_id: distId,
        }).eq('id', userId);
        setSaving(false); setSaved(true);
        setTimeout(() => { setSaved(false); router.push('/dashboard'); router.refresh(); }, 1500);
    }

    return (
        <div className="p-4 space-y-4">
            <div className="text-center py-4">
                <div className="text-4xl mb-2">⚙️</div>
                <h1 className="text-xl font-extrabold text-gray-800">জেলা পরিবর্তন</h1>
                <p className="text-sm text-gray-500 mt-1">যে জেলার তথ্য দেখতে চান সেটি বেছে নিন</p>
            </div>

            <div className="card p-4 border border-primary-200 bg-primary-50/30">
                <div className="text-sm text-primary-700 font-semibold">📍 বর্তমান জেলা</div>
                <div className="text-lg font-extrabold text-primary-800 mt-0.5">{currentDistrictName || '—'}</div>
            </div>

            <div className="card p-4 space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">🏙️ বিভাগ সিলেক্ট করুন *</label>
                    <select className="input-field" value={divId} onChange={e => { setDivId(e.target.value); setDistId(''); }}>
                        <option value="">বিভাগ বেছে নিন</option>
                        {divisions.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">🗺️ জেলা সিলেক্ট করুন *</label>
                    <select className="input-field" value={distId} onChange={e => setDistId(e.target.value)} disabled={!divId}>
                        <option value="">জেলা বেছে নিন</option>
                        {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                </div>
                <button onClick={save} disabled={!divId || !distId || saving} className="btn-primary w-full dark:bg-primary-600">
                    {saving ? '⏳ সংরক্ষণ হচ্ছে...' : saved ? '✅ সংরক্ষণ হয়েছে!' : '💾 সংরক্ষণ করুন'}
                </button>
            </div>

            {mounted && (
                <div className="card p-4 space-y-3 dark:bg-gray-800 dark:border-gray-700">
                    <div>
                        <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">🌙 থিম (App Theme)</h2>
                        <div className="flex gap-2">
                            <button onClick={() => setTheme('light')} className={`flex-1 py-2.5 rounded-xl border text-sm transition-all shadow-sm ${theme === 'light' ? 'bg-primary-50 dark:bg-primary-900 border-primary-500 text-primary-700 dark:text-primary-400 font-extrabold ring-2 ring-primary-500/20' : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>☀️ লাইট</button>
                            <button onClick={() => setTheme('dark')} className={`flex-1 py-2.5 rounded-xl border text-sm transition-all shadow-sm ${theme === 'dark' ? 'bg-primary-50 dark:bg-primary-900 border-primary-500 text-primary-700 dark:text-primary-400 font-extrabold ring-2 ring-primary-500/20' : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>🌙 ডার্ক</button>
                            <button onClick={() => setTheme('system')} className={`flex-1 py-2.5 rounded-xl border text-sm transition-all shadow-sm ${theme === 'system' ? 'bg-primary-50 dark:bg-primary-900 border-primary-500 text-primary-700 dark:text-primary-400 font-extrabold ring-2 ring-primary-500/20' : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>💻 সিস্টেম</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
