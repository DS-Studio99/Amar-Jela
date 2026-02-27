'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Banner } from '@/types';
import { BD_DIVISIONS } from '@/lib/data/bangladesh';

interface Props { banners: Banner[]; }

export default function AdminBannersClient({ banners: initial }: Props) {
    const [selDiv, setSelDiv] = useState('');
    const [selDist, setSelDist] = useState('');
    const [title, setTitle] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [link, setLink] = useState('');
    const [adding, setAdding] = useState(false);

    const supabase = createClient();
    const router = useRouter();

    const currentDistricts = BD_DIVISIONS.find(d => d.id === selDiv)?.districts || [];

    async function add() {
        if (!selDist || !imageUrl.trim()) return;
        setAdding(true);
        await supabase.from('banners').insert({
            title: title.trim() || null,
            image_url: imageUrl.trim(),
            link: link.trim() || null,
            district_id: selDist,
            active: true
        });
        setTitle(''); setImageUrl(''); setLink(''); setAdding(false); router.refresh();
    }

    async function toggle(id: string, active: boolean) {
        await supabase.from('banners').update({ active: !active }).eq('id', id);
        router.refresh();
    }

    async function del(id: string) {
        if (!confirm('মুছবেন?')) return;
        await supabase.from('banners').delete().eq('id', id);
        router.refresh();
    }

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-extrabold text-gray-800">লোকাল ব্যানার ও বিজ্ঞাপন</h1>
            <p className="text-sm text-gray-500">প্রতিটি জেলার ড্যাশবোর্ডে স্লাইডারে দেখানোর জন্য স্পনসর্ড ব্যানার যোগ করুন।</p>

            {/* Add New */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
                <h2 className="font-bold text-gray-800">নতুন ব্যানার যোগ করুন</h2>

                <div className="grid md:grid-cols-2 gap-3">
                    <select className="input-field text-sm" value={selDiv} onChange={e => { setSelDiv(e.target.value); setSelDist(''); }}>
                        <option value="">বিভাগ নির্বাচন করুন *</option>
                        {BD_DIVISIONS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                    <select className="input-field text-sm" value={selDist} onChange={e => setSelDist(e.target.value)} disabled={!selDiv}>
                        <option value="">জেলা নির্বাচন করুন *</option>
                        {currentDistricts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                    <input className="input-field text-sm" placeholder="ছবির ডিরেক্ট লিংক (URL) * [উদা: https://images.unsplash...]" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
                    <input className="input-field text-sm" placeholder="বিজ্ঞাপনের লিংক (অপশনাল) [যেখানে ক্লিক করলে যাবে]" value={link} onChange={e => setLink(e.target.value)} />
                </div>

                <input className="input-field text-sm" placeholder="ব্যানারের নাম/টাইটেল (অপশনাল) [এডমিন চেনার জন্য]" value={title} onChange={e => setTitle(e.target.value)} />

                <button onClick={add} disabled={adding || !selDist || !imageUrl.trim()} className="btn-primary text-sm px-5 py-2.5">
                    {adding ? '⏳ যোগ হচ্ছে...' : '+ ব্যানার যোগ করুন'}
                </button>
            </div>

            {/* List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-6">
                <div className="px-5 py-4 border-b border-gray-100 font-bold text-gray-800 flex justify-between">
                    <span>বর্তমান ব্যানার ({initial.length}টি)</span>
                </div>
                {initial.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">কোনো ব্যানার নেই।</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                        {initial.map((b: Banner) => (
                            <div key={b.id} className={`border border-gray-100 rounded-xl overflow-hidden shadow-sm transition-all ${b.active ? '' : 'opacity-50 grayscale'}`}>
                                <div className="h-32 bg-gray-200 relative">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={b.image_url} alt="Banner" className="w-full h-full object-cover" />
                                    {b.active && <div className="absolute top-2 right-2 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">সক্রিয়</div>}
                                </div>
                                <div className="p-3">
                                    <div className="text-xs font-bold text-gray-800 truncate mb-1">{b.title || 'শিরোনামহীন ব্যানার'}</div>
                                    <div className="text-[10px] text-gray-500 mb-2">জেলা আইডি: {b.district_id}</div>
                                    <div className="flex gap-2">
                                        <button onClick={() => toggle(b.id, b.active)} className="flex-1 text-xs bg-gray-100 text-gray-700 py-1.5 rounded-lg font-semibold hover:bg-gray-200">
                                            {b.active ? '⏸ নিষ্ক্রিয় করুন' : '▶️ সক্রিয় করুন'}
                                        </button>
                                        <button onClick={() => del(b.id)} className="text-xs bg-red-100 text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-200 font-semibold">
                                            🗑️
                                        </button>
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
