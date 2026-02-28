'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export interface ContentAd {
    id: string;
    title?: string;
    image_url: string;
    target_link?: string;
    display_size: string;
    views: number;
    clicks: number;
    is_active: boolean;
    start_date: string;
    end_date: string;
    created_at: string;
}

const SIZE_OPTIONS = [
    { value: '320x100', label: '320×100 (ছোট ব্যানার)' },
    { value: '300x250', label: '300×250 (মিডিয়াম)' },
    { value: '468x60', label: '468×60 (লিডারবোর্ড)' },
    { value: 'full', label: 'ফুল উইডথ' },
];

export default function ContentAdsClient({ ads: initial }: { ads: ContentAd[] }) {
    const [title, setTitle] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [targetLink, setTargetLink] = useState('');
    const [displaySize, setDisplaySize] = useState('320x100');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [adding, setAdding] = useState(false);

    const supabase = createClient();
    const router = useRouter();

    async function add() {
        if (!imageUrl.trim()) return;
        setAdding(true);
        await supabase.from('content_ads').insert({
            title: title.trim() || null,
            image_url: imageUrl.trim(),
            target_link: targetLink.trim() || null,
            display_size: displaySize,
            is_active: true,
            start_date: startDate ? new Date(startDate).toISOString() : new Date().toISOString(),
            end_date: endDate ? new Date(endDate).toISOString() : (() => { const d = new Date(); d.setDate(d.getDate() + 30); return d.toISOString(); })(),
        });
        setTitle(''); setImageUrl(''); setTargetLink(''); setDisplaySize('320x100'); setStartDate(''); setEndDate(''); setAdding(false);
        router.refresh();
    }

    async function toggle(id: string, isActive: boolean) {
        await supabase.from('content_ads').update({ is_active: !isActive }).eq('id', id);
        router.refresh();
    }

    async function del(id: string) {
        if (!confirm('মুছবেন?')) return;
        await supabase.from('content_ads').delete().eq('id', id);
        router.refresh();
    }

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-extrabold text-gray-800">🖼️ কন্টেন্ট এডস</h1>
                <p className="text-sm text-gray-500 mt-1">ক্যাটাগরি পেজে ৪টি তথ্যের পর পর এই এডসগুলো দেখানো হবে।</p>
            </div>

            {/* Add New Ad */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
                <h2 className="font-bold text-gray-800">নতুন কন্টেন্ট এড যোগ করুন</h2>
                <input className="input-field text-sm" placeholder="বিজ্ঞাপনের নাম (অপশনাল)" value={title} onChange={e => setTitle(e.target.value)} />
                <input className="input-field text-sm" placeholder="ছবির ডিরেক্ট লিংক (URL) *" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
                <input className="input-field text-sm" placeholder="ক্লিক করলে কোথায় যাবে (URL) [অপশনাল]" value={targetLink} onChange={e => setTargetLink(e.target.value)} />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                        <label className="text-xs font-semibold text-gray-600 block mb-1">📐 সাইজ</label>
                        <select className="input-field text-sm" value={displaySize} onChange={e => setDisplaySize(e.target.value)}>
                            {SIZE_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-600 block mb-1">📅 শুরু তারিখ</label>
                        <input type="datetime-local" className="input-field text-sm" value={startDate} onChange={e => setStartDate(e.target.value)} />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-600 block mb-1">⏳ শেষ তারিখ (মেয়াদ)</label>
                        <input type="datetime-local" className="input-field text-sm" value={endDate} onChange={e => setEndDate(e.target.value)} />
                    </div>
                </div>

                <div className="text-[10px] text-gray-400">খালি রাখলে আজকের তারিখ থেকে ৩০ দিন পর্যন্ত মেয়াদ সেট হবে।</div>

                <button onClick={add} disabled={adding || !imageUrl.trim()} className="btn-primary text-sm px-5 py-2.5">
                    {adding ? '⏳ যোগ হচ্ছে...' : '+ এড যোগ করুন'}
                </button>
            </div>

            {/* Ads List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 font-bold text-gray-800">
                    বর্তমান কন্টেন্ট এড ({initial.length}টি)
                </div>
                {initial.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">কোনো এড নেই।</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                        {initial.map((ad) => (
                            <div key={ad.id} className={`border border-gray-100 rounded-xl overflow-hidden shadow-sm transition-all ${ad.is_active ? '' : 'opacity-50 grayscale'}`}>
                                <div className="h-28 bg-gray-200 relative">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={ad.image_url} alt="Ad" className="w-full h-full object-cover" />
                                    {ad.is_active && <div className="absolute top-2 right-2 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">সক্রিয়</div>}
                                </div>
                                <div className="p-3">
                                    <div className="text-xs font-bold text-gray-800 truncate mb-0.5">{ad.title || 'বিজ্ঞাপন'}</div>
                                    <div className="text-[10px] text-gray-500 space-y-0.5">
                                        <div>📐 {SIZE_OPTIONS.find(s => s.value === ad.display_size)?.label || ad.display_size}</div>
                                        <div className="flex gap-4">
                                            <span>👁 ভিউ: {ad.views || 0}</span>
                                            <span>👆 ক্লিক: {ad.clicks || 0}</span>
                                        </div>
                                        <div>📅 শুরু: {new Date(ad.start_date).toLocaleDateString()}</div>
                                        <div>⏳ শেষ: {new Date(ad.end_date).toLocaleDateString()}</div>
                                    </div>
                                    {ad.target_link && <div className="text-[10px] text-blue-500 truncate mt-1">🔗 {ad.target_link}</div>}
                                    <div className="flex gap-2 mt-2">
                                        <button onClick={() => toggle(ad.id, ad.is_active)} className="flex-1 text-xs bg-gray-100 text-gray-700 py-1.5 rounded-lg font-semibold hover:bg-gray-200">
                                            {ad.is_active ? '⏸ নিষ্ক্রিয়' : '▶️ সক্রিয়'}
                                        </button>
                                        <button onClick={() => del(ad.id)} className="text-xs bg-red-100 text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-200 font-semibold">🗑️</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
