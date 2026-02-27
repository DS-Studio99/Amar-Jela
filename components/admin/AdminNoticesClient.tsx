'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Notice } from '@/types';

interface Props { notices: Notice[]; }

export default function AdminNoticesClient({ notices: initial }: Props) {
    const [newNotice, setNewNotice] = useState('');
    const [adding, setAdding] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    async function add() {
        if (!newNotice.trim()) return;
        setAdding(true);
        await supabase.from('notices').insert({ content: newNotice.trim(), active: true });
        setNewNotice(''); setAdding(false); router.refresh();
    }

    async function toggle(id: string, active: boolean) {
        await supabase.from('notices').update({ active: !active }).eq('id', id);
        router.refresh();
    }

    async function del(id: string) {
        if (!confirm('মুছবেন?')) return;
        await supabase.from('notices').delete().eq('id', id);
        router.refresh();
    }

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-extrabold text-gray-800">নোটিশ ম্যানেজমেন্ট</h1>
            <p className="text-sm text-gray-500">ড্যাশবোর্ডের মারকুয়ি বারে দেখানো নোটিশগুলো এখান থেকে নিয়ন্ত্রণ করুন।</p>

            {/* Add New */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-3">
                <h2 className="font-bold text-gray-800">নতুন নোটিশ যোগ করুন</h2>
                <textarea className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-primary-500 resize-none" rows={3} placeholder="নোটিশের বিষয়বস্তু লিখুন..." value={newNotice} onChange={e => setNewNotice(e.target.value)} />
                <button onClick={add} disabled={adding || !newNotice.trim()} className="btn-primary text-sm px-5 py-2.5">
                    {adding ? '⏳ যোগ হচ্ছে...' : '+ নোটিশ যোগ করুন'}
                </button>
            </div>

            {/* List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 font-bold text-gray-800">বর্তমান নোটিশ ({initial.length}টি)</div>
                {initial.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">কোনো নোটিশ নেই।</div>
                ) : initial.map((n: Notice) => (
                    <div key={n.id} className={`flex items-start gap-3 px-5 py-4 border-b border-gray-50 last:border-0 ${n.active ? '' : 'opacity-50'}`}>
                        <div className="flex-1 text-sm text-gray-700">{n.content}</div>
                        <div className="flex gap-2 flex-shrink-0">
                            <button onClick={() => toggle(n.id, n.active)} className={`text-xs px-2.5 py-1 rounded-lg font-semibold ${n.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                {n.active ? '✅ সক্রিয়' : '⏸ নিষ্ক্রিয়'}
                            </button>
                            <button onClick={() => del(n.id)} className="text-xs bg-red-100 text-red-700 px-2.5 py-1 rounded-lg hover:bg-red-200 font-semibold">🗑️</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
