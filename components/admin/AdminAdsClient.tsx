'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Ad } from '@/types';

interface Props { ads: Ad[]; }

export default function AdminAdsClient({ ads: initial }: Props) {
    const [title, setTitle] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [clickUrl, setClickUrl] = useState('');
    const [adding, setAdding] = useState(false);

    const supabase = createClient();
    const router = useRouter();

    async function add() {
        if (!imageUrl.trim()) return;
        setAdding(true);
        await supabase.from('ads').insert({
            title: title.trim() || null,
            image_url: imageUrl.trim(),
            click_url: clickUrl.trim() || null,
            is_active: true,
        });
        setTitle(''); setImageUrl(''); setClickUrl(''); setAdding(false);
        router.refresh();
    }

    async function toggle(id: string, isActive: boolean) {
        await supabase.from('ads').update({ is_active: !isActive }).eq('id', id);
        router.refresh();
    }

    async function del(id: string) {
        if (!confirm('মুছবেন?')) return;
        await supabase.from('ads').delete().eq('id', id);
        router.refresh();
    }

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-extrabold text-gray-800">📢 এড সিস্টেম</h1>
                <p className="text-sm text-gray-500 mt-1">ড্যাশবোর্ডে ৩০০×২৫০ সাইজের ক্লিকযোগ্য বিজ্ঞাপন ব্যানার যোগ করুন।</p>
            </div>

            {/* Add New Ad */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
                <h2 className="font-bold text-gray-800">নতুন বিজ্ঞাপন যোগ করুন</h2>
                <input className="input-field text-sm" placeholder="বিজ্ঞাপনের নাম (অপশনাল)" value={title} onChange={e => setTitle(e.target.value)} />
                <input className="input-field text-sm" placeholder="ছবির ডিরেক্ট লিংক (URL) * [300x250 সাইজ]" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
                <input className="input-field text-sm" placeholder="ক্লিক করলে কোথায় যাবে (URL) [অপশনাল]" value={clickUrl} onChange={e => setClickUrl(e.target.value)} />
                <button onClick={add} disabled={adding || !imageUrl.trim()} className="btn-primary text-sm px-5 py-2.5">
                    {adding ? '⏳ যোগ হচ্ছে...' : '+ বিজ্ঞাপন যোগ করুন'}
                </button>
            </div>

            {/* Ads List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 font-bold text-gray-800">
                    বর্তমান বিজ্ঞাপন ({initial.length}টি)
                </div>
                {initial.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">কোনো বিজ্ঞাপন নেই।</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                        {initial.map((ad) => (
                            <div key={ad.id} className={`border border-gray-100 rounded-xl overflow-hidden shadow-sm transition-all ${ad.is_active ? '' : 'opacity-50 grayscale'}`}>
                                <div className="h-36 bg-gray-200 relative">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={ad.image_url} alt="Ad" className="w-full h-full object-cover" />
                                    {ad.is_active && <div className="absolute top-2 right-2 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">সক্রিয়</div>}
                                </div>
                                <div className="p-3">
                                    <div className="text-xs font-bold text-gray-800 truncate mb-1">{ad.title || 'বিজ্ঞাপন'}</div>
                                    <div className="text-[10px] text-gray-500 mb-1">👆 ক্লিক: {ad.clicks || 0}বার</div>
                                    {ad.click_url && <div className="text-[10px] text-blue-500 truncate mb-2">🔗 {ad.click_url}</div>}
                                    <div className="flex gap-2">
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
