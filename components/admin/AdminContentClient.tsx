'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ContentItem, Category } from '@/types';
import { Division } from '@/types';
import { getDistrict, getDivision } from '@/lib/data/bangladesh';

type ContentWithCat = ContentItem & { categories: { name: string; icon: string; color: string } | null };

interface Props {
    content: ContentWithCat[];
    categories: Category[];
    divisions: Division[];
}

const STATUS = {
    pending: { label: '⏳ অপেক্ষমান', cls: 'badge-pending' },
    approved: { label: '✅ অনুমোদিত', cls: 'badge-approved' },
    rejected: { label: '❌ প্রত্যাখ্যাত', cls: 'badge-rejected' },
};

export default function AdminContentClient({ content, categories, divisions }: Props) {
    const [filter, setFilter] = useState({ status: 'all', catId: '', divId: '', distId: '' });
    const [detail, setDetail] = useState<ContentWithCat | null>(null);
    const supabase = createClient();
    const router = useRouter();

    const districts = divisions.find(d => d.id === filter.divId)?.districts || [];
    const filtered = content.filter(item => {
        if (filter.status !== 'all' && item.status !== filter.status) return false;
        if (filter.catId && item.category_id !== filter.catId) return false;
        if (filter.divId && item.division_id !== filter.divId) return false;
        if (filter.distId && item.district_id !== filter.distId) return false;
        return true;
    });

    async function updateStatus(id: string, status: string) {
        await supabase.from('content').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
        setDetail(null); router.refresh();
    }

    async function deleteItem(id: string) {
        if (!confirm('মুছে ফেলবেন?')) return;
        await supabase.from('content').delete().eq('id', id);
        setDetail(null); router.refresh();
    }

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-extrabold text-gray-800">কন্টেন্ট মডারেশন</h1>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
                <select className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white outline-none focus:border-primary-500" value={filter.status} onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}>
                    <option value="all">সব</option>
                    <option value="pending">⏳ পেন্ডিং</option>
                    <option value="approved">✅ অনুমোদিত</option>
                    <option value="rejected">❌ প্রত্যাখ্যাত</option>
                </select>
                <select className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white outline-none focus:border-primary-500" value={filter.catId} onChange={e => setFilter(f => ({ ...f, catId: e.target.value }))}>
                    <option value="">সব ক্যাটাগরি</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                </select>
                <select className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white outline-none focus:border-primary-500" value={filter.divId} onChange={e => setFilter(f => ({ ...f, divId: e.target.value, distId: '' }))}>
                    <option value="">সব বিভাগ</option>
                    {divisions.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
                {filter.divId && (
                    <select className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white outline-none focus:border-primary-500" value={filter.distId} onChange={e => setFilter(f => ({ ...f, distId: e.target.value }))}>
                        <option value="">সব জেলা</option>
                        {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                )}
                <div className="text-sm text-gray-500 flex items-center px-2 font-semibold">{filtered.length}টি ফলাফল</div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
                <table className="w-full min-w-[600px]">
                    <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wide">
                        <tr>
                            <th className="px-4 py-3 text-left">#</th>
                            <th className="px-4 py-3 text-left">তথ্য</th>
                            <th className="px-4 py-3 text-left">ক্যাটাগরি</th>
                            <th className="px-4 py-3 text-left">বিভাগ/জেলা</th>
                            <th className="px-4 py-3 text-left">জমাদাতা</th>
                            <th className="px-4 py-3 text-left">এনগেজমেন্ট</th>
                            <th className="px-4 py-3 text-left">স্ট্যাটাস</th>
                            <th className="px-4 py-3 text-left">অ্যাকশন</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr><td colSpan={6} className="text-center py-12 text-gray-400">কোনো ফলাফল নেই।</td></tr>
                        ) : filtered.map((item, i) => (
                            <tr key={item.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                                <td className="px-4 py-3 text-sm text-gray-400">{i + 1}</td>
                                <td className="px-4 py-3">
                                    <div className="font-semibold text-sm text-gray-800 max-w-[200px] truncate">{item.title}</div>
                                    {item.phone && <div className="text-xs text-primary-600">{item.phone}</div>}
                                </td>
                                <td className="px-4 py-3 text-sm">{item.categories?.icon} {item.categories?.name}</td>
                                <td className="px-4 py-3">
                                    <div className="text-xs font-semibold text-gray-700">{getDivision(item.division_id)?.name || '—'}</div>
                                    <div className="text-[10px] text-gray-400">{getDistrict(item.district_id)?.name || '—'}</div>
                                </td>
                                <td className="px-4 py-3 text-xs text-gray-500">{item.submitted_by_name}</td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-2 text-xs font-bold">
                                        <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md" title="ভিউ">{item.views || 0}👁️</span>
                                        <span className="bg-green-50 text-green-600 px-2 py-1 rounded-md" title="কল/মেসেজ">{item.calls || 0}📞</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3"><span className={STATUS[item.status]?.cls}>{STATUS[item.status]?.label}</span></td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-1.5">
                                        <button onClick={() => setDetail(item)} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-200 font-semibold">👁️</button>
                                        {item.status !== 'approved' && <button onClick={() => updateStatus(item.id, 'approved')} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-lg hover:bg-green-200 font-semibold">✅</button>}
                                        {item.status !== 'rejected' && <button onClick={() => updateStatus(item.id, 'rejected')} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-lg hover:bg-red-200 font-semibold">❌</button>}
                                        <button onClick={() => deleteItem(item.id)} className="text-xs bg-red-50 text-red-500 px-2 py-1 rounded-lg hover:bg-red-100 font-semibold">🗑️</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Detail Modal */}
            {detail && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={e => e.target === e.currentTarget && setDetail(null)}>
                    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                            <h3 className="font-bold text-gray-800">তথ্যের বিবরণ</h3>
                            <button onClick={() => setDetail(null)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm hover:bg-red-100 hover:text-red-500">✕</button>
                        </div>
                        <div className="p-5 space-y-3">
                            {([['শিরোনাম', detail.title], detail.phone ? ['ফোন', detail.phone] : null, detail.address ? ['ঠিকানা', detail.address] : null, detail.description ? ['বিবরণ', detail.description] : null, ['ক্যাটাগরি', `${detail.categories?.icon} ${detail.categories?.name}`], ['বিভাগ', getDivision(detail.division_id)?.name || '—'], ['জেলা', getDistrict(detail.district_id)?.name || '—'], ['জমাদাতা', detail.submitted_by_name || '—'], ['ভিউ', `${detail.views || 0} বার দেখা হয়েছে`], ['কল', `${detail.calls || 0} বার যোগাযোগ`], ['তারিখ', new Date(detail.created_at).toLocaleDateString('bn-BD')]].filter((x): x is [string, string] => Boolean(x)) as [string, string][]).map(([k, v]) => (
                                <div key={k} className="flex justify-between text-sm border-b border-gray-50 pb-2">
                                    <span className="text-gray-500">{k}</span>
                                    <span className="font-semibold text-gray-800 text-right max-w-[60%]">{v as string}</span>
                                </div>
                            ))}

                            {/* Show attached images if any */}
                            {detail.images && detail.images.length > 0 && (
                                <div className="pt-2 border-t border-gray-100">
                                    <span className="text-sm text-gray-500 block mb-2 font-semibold">সংযুক্ত ছবিসমূহ:</span>
                                    <div className="flex gap-2 overflow-x-auto pb-2">
                                        {detail.images.map((imgUrl, idx) => (
                                            <a key={idx} href={imgUrl} target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
                                                <img src={imgUrl} alt="Attached" className="h-20 w-auto rounded-lg border border-gray-200 object-cover" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                {detail.status !== 'approved' && <button onClick={() => updateStatus(detail.id, 'approved')} className="btn-primary flex-1 text-sm py-2.5">✅ অনুমোদন</button>}
                                {detail.status !== 'rejected' && <button onClick={() => updateStatus(detail.id, 'rejected')} className="btn-danger flex-1 text-sm py-2.5">❌ প্রত্যাখ্যান</button>}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
