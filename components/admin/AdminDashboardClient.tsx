'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { DashboardStats, ContentItem, Notice } from '@/types';
import { useRouter } from 'next/navigation';

type PendingItem = ContentItem & { categories: { name: string; icon: string } | null };

interface Props {
    stats: DashboardStats;
    recentPending: PendingItem[];
    notices: Notice[];
}

const STAT_CARDS = [
    { key: 'totalUsers', icon: '👥', label: 'ব্যবহারকারী', color: '#1a9e5c' },
    { key: 'totalCategories', icon: '🗂️', label: 'ক্যাটাগরি', color: '#3498db' },
    { key: 'pending', icon: '⏳', label: 'পেন্ডিং', color: '#f39c12' },
    { key: 'approved', icon: '✅', label: 'অনুমোদিত', color: '#27ae60' },
    { key: 'rejected', icon: '❌', label: 'প্রত্যাখ্যাত', color: '#e74c3c' },
    { key: 'totalContent', icon: '📋', label: 'মোট কন্টেন্ট', color: '#9b59b6' },
];

export default function AdminDashboardClient({ stats, recentPending, notices }: Props) {
    const [noticeText, setNoticeText] = useState(notices.map(n => n.content).join('\n'));
    const [noticeSaving, setNoticeSaving] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    async function saveNotices() {
        setNoticeSaving(true);
        // Delete all, re-insert
        await supabase.from('notices').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        const lines = noticeText.split('\n').filter(l => l.trim());
        if (lines.length) await supabase.from('notices').insert(lines.map(content => ({ content, active: true })));
        setNoticeSaving(false);
        router.refresh();
    }

    async function quickApprove(id: string) {
        await supabase.from('content').update({ status: 'approved', updated_at: new Date().toISOString() }).eq('id', id);
        router.refresh();
    }

    async function quickReject(id: string) {
        await supabase.from('content').update({ status: 'rejected', updated_at: new Date().toISOString() }).eq('id', id);
        router.refresh();
    }

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-extrabold text-gray-800">ওভারভিউ ড্যাশবোর্ড</h1>
                <p className="text-gray-500 text-sm mt-0.5">আমার জেলা অ্যাপের সার্বিক পরিসংখ্যান</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {STAT_CARDS.map(card => (
                    <div key={card.key} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:-translate-y-0.5 hover:shadow-md transition-all" style={{ borderLeft: `4px solid ${card.color}` }}>
                        <div className="text-2xl mb-1">{card.icon}</div>
                        <div className="text-3xl font-extrabold text-gray-800">{(stats as unknown as Record<string, number>)[card.key]}</div>
                        <div className="text-xs text-gray-500 font-medium mt-0.5">{card.label}</div>
                    </div>
                ))}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {/* Quick Actions */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <h2 className="font-bold text-gray-800 mb-4">⚡ দ্রুত অ্যাকশন</h2>
                    <div className="space-y-2">
                        <Link href="/admin/content" className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 font-semibold text-sm hover:bg-amber-100 transition-all">
                            <span className="text-lg">⏳</span>পেন্ডিং তথ্য দেখুন ({stats.pending}টি)
                        </Link>
                        <Link href="/admin/categories" className="flex items-center gap-3 p-3 bg-primary-50 border border-primary-200 rounded-xl text-primary-700 font-semibold text-sm hover:bg-primary-100 transition-all">
                            <span className="text-lg">🗂️</span>ক্যাটাগরি ম্যানেজ করুন
                        </Link>
                        <Link href="/admin/districts" className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 font-semibold text-sm hover:bg-green-100 transition-all">
                            <span className="text-lg">🗺️</span>জেলার তথ্য যোগ করুন
                        </Link>
                    </div>
                </div>

                {/* Recent Pending */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <h2 className="font-bold text-gray-800 mb-4">🔔 সাম্প্রতিক পেন্ডিং</h2>
                    {recentPending.length === 0 ? (
                        <div className="text-center py-4 text-gray-400 text-sm">কোনো পেন্ডিং তথ্য নেই 🎉</div>
                    ) : recentPending.map(item => (
                        <div key={item.id} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                            <div>
                                <div className="text-sm font-semibold text-gray-800">{item.categories?.icon} {item.title}</div>
                                <div className="text-xs text-gray-400">{item.submitted_by_name}</div>
                            </div>
                            <div className="flex gap-1.5">
                                <button onClick={() => quickApprove(item.id)} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-lg hover:bg-green-200 font-semibold">✅</button>
                                <button onClick={() => quickReject(item.id)} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-lg hover:bg-red-200 font-semibold">❌</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Notices */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h2 className="font-bold text-gray-800 mb-4">📢 নোটিশ ম্যানেজ করুন</h2>
                <p className="text-xs text-gray-500 mb-2">প্রতিটি লাইনে একটি নোটিশ লিখুন (ড্যাশবোর্ডে মারকুয়ি বারে দেখাবে)</p>
                <textarea className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-primary-500 resize-none" rows={4} value={noticeText} onChange={e => setNoticeText(e.target.value)} placeholder="নোটিশ লিখুন..." />
                <button onClick={saveNotices} disabled={noticeSaving} className="btn-primary mt-3 text-sm px-6 py-2.5">
                    {noticeSaving ? '⏳ সংরক্ষণ হচ্ছে...' : '💾 নোটিশ সংরক্ষণ করুন'}
                </button>
            </div>
        </div>
    );
}
