'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

type ReportItem = {
    id: string;
    content_id: string;
    user_id: string;
    reason: string;
    status: string;
    created_at: string;
    content: {
        id: string;
        title: string;
        status: string;
    };
    profiles: {
        name: string;
        phone: string;
    };
};

interface Props {
    reports: ReportItem[];
}

export default function AdminReportsClient({ reports }: Props) {
    const [filter, setFilter] = useState('pending');
    const supabase = createClient();
    const router = useRouter();

    const filtered = reports.filter(r => filter === 'all' ? true : r.status === filter);

    async function updateStatus(id: string, newStatus: string) {
        if (!confirm('আপনি কি নিশ্চিত?')) return;
        await supabase.from('reports').update({ status: newStatus }).eq('id', id);
        router.refresh();
    }

    async function banContent(contentId: string, reportId: string) {
        if (!confirm('এই তথ্যের স্ট্যাটাস Rejected করতে চান? (এটি আর অ্যাপে দেখাবে না)')) return;
        await supabase.from('content').update({ status: 'rejected' }).eq('id', contentId);
        await supabase.from('reports').update({ status: 'resolved' }).eq('content_id', contentId);
        router.refresh();
    }

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-extrabold text-gray-800">ইউজার রিপোর্টস 🚩</h1>
            <p className="text-sm text-gray-500">ইউজারদের দ্বারা সাবমিট করা ভুল বা ভুয়া তথ্যের কমপ্লেইন সমূহ</p>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 pt-2">
                <select className="input-field max-w-[200px] py-2" value={filter} onChange={e => setFilter(e.target.value)}>
                    <option value="pending">⏳ অপেক্ষমান (Pending)</option>
                    <option value="resolved">✅ সমাধানকৃত (Resolved)</option>
                    <option value="all">সব দেখুন</option>
                </select>
                <div className="text-sm text-gray-500 flex items-center px-2 font-semibold">{filtered.length}টি ফলাফল</div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
                <table className="w-full min-w-[700px]">
                    <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wide">
                        <tr>
                            <th className="px-4 py-3 text-left w-12">#</th>
                            <th className="px-4 py-3 text-left">রিপোর্টকারী</th>
                            <th className="px-4 py-3 text-left">তথ্যের নাম</th>
                            <th className="px-4 py-3 text-left">কারন / অভিযোগ</th>
                            <th className="px-4 py-3 text-left">তারিখ</th>
                            <th className="px-4 py-3 text-left">অ্যাকশন</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr><td colSpan={6} className="text-center py-12 text-gray-400">কোনো রিপোর্ট নেই।</td></tr>
                        ) : filtered.map((item, i) => (
                            <tr key={item.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                                <td className="px-4 py-3 text-sm text-gray-400">{i + 1}</td>
                                <td className="px-4 py-3">
                                    <div className="font-semibold text-sm text-gray-800">{item.profiles?.name}</div>
                                    <div className="text-xs text-gray-500">{item.profiles?.phone}</div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="font-bold text-primary-600 text-sm">{item.content?.title}</div>
                                    <div className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded inline-block mt-1">
                                        Content Status: {item.content?.status}
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700 min-w-[200px]">{item.reason}</td>
                                <td className="px-4 py-3 text-xs text-gray-500">{new Date(item.created_at).toLocaleDateString('bn-BD')}</td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-2">
                                        {item.status !== 'resolved' && (
                                            <>
                                                <button onClick={() => updateStatus(item.id, 'resolved')} className="text-[11px] bg-green-100 text-green-700 px-2.5 py-1.5 rounded-lg hover:bg-green-200 font-bold whitespace-nowrap">
                                                    ✅ ইগনোর/সমাধান
                                                </button>
                                                <button onClick={() => banContent(item.content.id, item.id)} className="text-[11px] bg-red-100 text-red-700 px-2.5 py-1.5 rounded-lg hover:bg-red-200 font-bold whitespace-nowrap">
                                                    🚫 তথ্যটি মুছে ফেলুন
                                                </button>
                                            </>
                                        )}
                                        {item.status === 'resolved' && (
                                            <span className="text-xs font-bold text-green-600 border border-green-200 bg-green-50 px-2 py-1 rounded">Resolved</span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
