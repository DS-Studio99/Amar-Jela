'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Category, Notice, Banner, Ad } from '@/types';
import { District } from '@/types';

import { createClient } from '@/lib/supabase/client';
import { SupabaseClient } from '@supabase/supabase-js';

interface Props {
    categories: Category[];
    notices: Notice[];
    banners?: Banner[];
    ads?: Ad[];
    district: (District & { divisionId: string; divisionName: string }) | null;
    districtId: string;
}

// Auto-rotating ad carousel component
function AdCarousel({ ads, sizeMap, supabase }: { ads: Ad[]; sizeMap: Record<string, { w: string; h: string }>; supabase: SupabaseClient }) {
    const [index, setIndex] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        if (ads.length <= 1) return;
        const timer = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setIndex(prev => (prev + 1) % ads.length);
                setFade(true);
            }, 300);
        }, 5000);
        return () => clearInterval(timer);
    }, [ads.length]);

    const ad = ads[index % ads.length];
    if (!ad) return null;
    const size = sizeMap[ad.display_size || '320x100'] || sizeMap['320x100'];

    const img = (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={ad.image_url} alt={ad.title || 'বিজ্ঞাপন'} className="w-full h-full object-cover" />
    );

    return (
        <div className="flex items-center justify-center">
            <div
                className={`relative rounded-xl overflow-hidden shadow-sm border border-gray-100 transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}
                style={{ width: size.w, height: size.h }}
            >
                {ad.click_url ? (
                    <a
                        href={ad.click_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => supabase.rpc('increment_ad_clicks', { ad_id: ad.id }).then()}
                        className="block w-full h-full"
                    >
                        {img}
                    </a>
                ) : img}
                <div className="absolute bottom-0.5 right-1.5 bg-black/40 text-white text-[7px] px-1 py-0.5 rounded font-medium backdrop-blur-sm">বিজ্ঞাপন</div>
                {ads.length > 1 && (
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
                        {ads.map((_, i) => (
                            <div key={i} className={`w-1 h-1 rounded-full transition-all ${i === index % ads.length ? 'bg-white w-2.5' : 'bg-white/40'}`} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

const FALLBACK_IMAGES = [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542640244-7e672d6cef4e?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop',
];

export default function DashboardClient({ categories, notices, banners = [], ads = [], district, districtId }: Props) {
    const [slideIndex, setSlideIndex] = useState(0);
    const [bloodModalOpen, setBloodModalOpen] = useState(false);
    const [bloodGroup, setBloodGroup] = useState('A+');
    const [hospital, setHospital] = useState('');
    const [phone, setPhone] = useState('');
    const [requesting, setRequesting] = useState(false);
    const [sosOpen, setSosOpen] = useState(false);

    const supabase = createClient();

    const activeSlides: Array<{ src: string, link?: string }> = banners.length > 0
        ? banners.map(b => ({ src: b.image_url, link: b.link }))
        : (district?.image ? [district.image, ...FALLBACK_IMAGES] : FALLBACK_IMAGES).map(src => ({ src }));

    async function sendBloodAlert(e: React.FormEvent) {
        e.preventDefault();
        if (!hospital.trim() || !phone.trim()) { alert('স্থান এবং মোবাইল নম্বর দিন'); return; }

        setRequesting(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            alert('অনুগ্রহ করে লগইন করুন');
            setRequesting(false);
            return;
        }

        const { error } = await supabase.from('blood_requests').insert({
            user_id: user.id,
            district_id: districtId,
            blood_group: bloodGroup,
            hospital: hospital.trim(),
            phone: phone.trim(),
            status: 'pending'
        });

        if (error) {
            console.error(error);
            alert('অনুরোধ পাঠানো সম্ভব হয়নি। আবার চেষ্টা করুন।');
        } else {
            alert('আপনার রক্তের অনুরোধ সফলভাবে জমা হয়েছে! অ্যাডমিন অনুমোদন করলে সকলকে নোটিফিকেশন পাঠানো হবে।');
            setBloodModalOpen(false);
            setHospital(''); setPhone('');
        }
        setRequesting(false);
    }

    useEffect(() => {
        const t = setInterval(() => setSlideIndex(i => (i + 1) % activeSlides.length), 3500);
        return () => clearInterval(t);
    }, [activeSlides.length]);

    // Group categories by group_name
    const groups: Record<string, Category[]> = {};
    categories.forEach(cat => {
        if (!groups[cat.group_name]) groups[cat.group_name] = [];
        groups[cat.group_name].push(cat);
    });

    const noticeText = notices.map(n => n.content).join(' ✦ ');

    return (
        <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
            {/* Hero Image Slider — reduced height */}
            <div className="relative mx-2 mt-2 rounded-2xl overflow-hidden bg-gray-200 shadow-lg" style={{ height: '155px' }}>
                {activeSlides.map((slide, i) => {
                    const content = <Image src={slide.src} alt={`slide-${i}`} fill className="object-cover" unoptimized />;
                    return (
                        <div key={i} className={`absolute inset-0 transition-all duration-1000 ${i === slideIndex ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'}`}>
                            {slide.link ? <a href={slide.link} target="_blank" rel="noreferrer" className="block w-full h-full">{content}</a> : content}
                        </div>
                    );
                })}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 px-4 pb-3">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-7 h-7 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-sm">🏙️</div>
                        <div>
                            <p className="text-white text-sm font-extrabold drop-shadow-lg">
                                {district ? district.name : 'আমার'} জেলায় স্বাগতম
                            </p>
                            <p className="text-white/70 text-[10px] font-medium">
                                {district?.divisionName} বিভাগ, বাংলাদেশ
                            </p>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-2 right-3 flex gap-1 z-20">
                    {activeSlides.map((_, i) => (
                        <button key={i} onClick={() => setSlideIndex(i)} className={`rounded-full transition-all duration-300 ${i === slideIndex ? 'w-5 h-1.5 bg-white shadow-lg' : 'w-1.5 h-1.5 bg-white/40'}`} />
                    ))}
                </div>
            </div>

            {/* Notice Bar — scrolling text, red animated label */}
            {noticeText && (
                <div className="mx-2 mt-2 flex items-center gap-2 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200/80 rounded-xl px-2.5 py-1.5 overflow-hidden shadow-sm">
                    <span className="notice-label-pulse text-[9px] font-extrabold text-white bg-red-500 rounded-lg px-2 py-0.5 whitespace-nowrap tracking-wider uppercase shadow-sm">নোটিশ</span>
                    <div className="marquee-wrapper flex-1 overflow-hidden">
                        <span className="marquee-text text-[11px] text-red-800 font-semibold">{noticeText}</span>
                    </div>
                </div>
            )}

            {/* Universal Services — Live TV, Emergency Blood, On-Demand Service */}
            <div className="mx-2 mt-2 flex gap-1.5">
                <a href="https://bdstream.live" target="_blank" rel="noopener noreferrer" className="flex-1 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl p-2.5 text-center text-white shadow-lg hover:scale-[1.02] transition-transform" style={{ boxShadow: '0 6px 20px rgba(99,102,241,0.3)' }}>
                    <span className="text-xl">📺</span>
                    <p className="text-sm font-extrabold mt-0.5">লাইভ টিভি</p>
                    <p className="text-[9px] text-white/70 font-medium">সরাসরি সম্প্রচার</p>
                </a>
                <button onClick={() => setBloodModalOpen(true)} className="flex-1 bg-gradient-to-br from-red-500 to-red-700 rounded-xl p-2.5 text-center text-white shadow-lg hover:scale-[1.02] transition-transform" style={{ boxShadow: '0 6px 20px rgba(239,68,68,0.3)' }}>
                    <span className="text-xl">🩸</span>
                    <p className="text-sm font-extrabold mt-0.5">রক্ত দিন</p>
                    <p className="text-[9px] text-white/70 font-medium">জরুরি রক্তের প্রয়োজন</p>
                </button>
                <Link href="/service/on-demand" className="flex-1 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl p-2.5 text-center text-white shadow-lg hover:scale-[1.02] transition-transform" style={{ boxShadow: '0 6px 20px rgba(16,185,129,0.3)' }}>
                    <span className="text-xl">🛎️</span>
                    <p className="text-sm font-extrabold mt-0.5">অন ডিমান্ড</p>
                    <p className="text-[9px] text-white/70 font-medium">তাৎক্ষণিক সেবা</p>
                </Link>
            </div>

            {/* Compact Search Bar */}
            <div className="mx-2 mt-2">
                <form action="/search" method="GET" className="relative group block">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-400 group-focus-within:text-primary-500 transition-colors text-sm">🔍</span>
                    </div>
                    <input
                        type="text"
                        name="q"
                        placeholder="সেবা খুঁজুন (ডাক্তার, পুলিশ)..."
                        className="w-full bg-white border border-gray-200 rounded-xl py-2 pl-9 pr-16 text-xs text-gray-800 shadow-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-50 transition-all font-medium placeholder:text-gray-400"
                        required
                    />
                    <div className="absolute inset-y-0 right-1.5 flex items-center">
                        <button type="submit" className="bg-primary-50 text-primary-600 px-2.5 py-1 rounded-lg hover:bg-primary-100 transition-colors font-bold text-[10px]">
                            খুঁজুন
                        </button>
                    </div>
                </form>
            </div>

            {/* Section Divider */}
            <div className="px-3 pt-3 pb-1">
                <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-primary-200" />
                    <h2 className="text-xs font-extrabold text-gray-600 tracking-wide flex items-center gap-1">
                        <span className="text-sm">✨</span>সকল সেবা সমূহ
                    </h2>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-primary-200" />
                </div>
            </div>

            {/* Render ad carousel helper */}
            {(() => {
                const activeAds = ads.filter(a => a.is_active);

                // Group ads by display_group
                const topAds = activeAds.filter(a => !a.display_group);
                const groupedAds: Record<string, typeof activeAds> = {};
                activeAds.filter(a => a.display_group).forEach(ad => {
                    const g = ad.display_group!;
                    if (!groupedAds[g]) groupedAds[g] = [];
                    groupedAds[g].push(ad);
                });

                const renderAdCarousel = (adList: typeof activeAds) => {
                    if (adList.length === 0) return null;
                    const sizeMap: Record<string, { w: string; h: string }> = {
                        '300x250': { w: '300px', h: '250px' },
                        '320x100': { w: '320px', h: '100px' },
                        '468x60': { w: '100%', h: '60px' },
                        'full': { w: '100%', h: '120px' },
                    };

                    return (
                        <AdCarousel ads={adList} sizeMap={sizeMap} supabase={supabase} />
                    );
                };

                return (
                    <>
                        {/* Top ads (no group) */}
                        {topAds.length > 0 && (
                            <div className="px-2 mt-2">
                                {renderAdCarousel(topAds)}
                            </div>
                        )}

                        {/* Category Groups with group-specific ads */}
                        {Object.entries(groups).map(([groupName, cats]) => (
                            <div key={groupName}>
                                <div className="px-2 mt-1.5 mb-2">
                                    {/* Group Header */}
                                    <div className="flex items-center gap-1.5 mb-2 px-1">
                                        <div className="w-0.5 h-4 bg-gradient-to-b from-primary-400 to-primary-600 rounded-full" />
                                        <h3 className="text-[11px] font-bold text-gray-600">{groupName}</h3>
                                        <div className="h-px flex-1 bg-gray-100" />
                                    </div>

                                    {/* Category Grid — 4 columns */}
                                    <div className="grid grid-cols-4 gap-1.5">
                                        {cats.map((cat, idx) => (
                                            <Link
                                                key={cat.id}
                                                href={`/service/${cat.id}?district=${districtId}`}
                                                className="group relative flex flex-col items-center gap-1 p-2 bg-white rounded-xl border border-gray-100/80 hover:border-transparent active:scale-95 transition-all duration-300"
                                                style={{ animationDelay: `${idx * 30}ms` }}
                                            >
                                                <div
                                                    className="w-9 h-9 rounded-xl flex items-center justify-center text-[17px] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-lg"
                                                    style={{
                                                        background: `linear-gradient(135deg, ${cat.color}15, ${cat.color}30)`,
                                                        boxShadow: `0 2px 8px ${cat.color}10`,
                                                    }}
                                                >
                                                    {cat.icon}
                                                </div>
                                                <span className="text-[9px] font-semibold text-gray-600 text-center leading-tight group-hover:text-gray-800 transition-colors line-clamp-2">{cat.name}</span>
                                                <div
                                                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                                                    style={{ boxShadow: `0 0 0 1px ${cat.color}40, 0 0 15px ${cat.color}20, inset 0 0 10px ${cat.color}08` }}
                                                />
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                {/* Ads for this group */}
                                {groupedAds[groupName] && groupedAds[groupName].length > 0 && (
                                    <div className="px-2 mb-2">
                                        {renderAdCarousel(groupedAds[groupName])}
                                    </div>
                                )}
                            </div>
                        ))}
                    </>
                );
            })()}

            {/* Gov Emergency Section */}
            <div className="px-2 mt-4 mb-2">
                <div className="flex items-center gap-1.5 mb-2 px-1">
                    <div className="w-0.5 h-4 bg-gradient-to-b from-red-500 to-red-600 rounded-full" />
                    <h3 className="text-[11px] font-bold text-gray-800">সরকার জরুরি কার্যক্রম</h3>
                    <div className="h-px flex-1 bg-red-100" />
                </div>
                <div className="flex flex-col gap-2">
                    <a href="https://services.nidw.gov.bd/nid-pub/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 p-3 bg-gradient-to-r from-red-50 to-white border border-red-100 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95 group">
                        <div className="w-9 h-9 rounded-lg bg-red-100 text-red-600 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">🪪</div>
                        <div className="flex-1">
                            <h4 className="text-xs font-bold text-gray-800">ভোটার কার্ড আবেদন ও সংশোধন</h4>
                            <p className="text-[9px] text-gray-500 font-medium">বাংলাদেশ নির্বাচন কমিশন</p>
                        </div>
                        <div className="text-red-400 text-sm">→</div>
                    </a>
                    <a href="https://bdris.gov.bd/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 p-3 bg-gradient-to-r from-green-50 to-white border border-green-100 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95 group">
                        <div className="w-9 h-9 rounded-lg bg-green-100 text-green-600 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">👶</div>
                        <div className="flex-1">
                            <h4 className="text-xs font-bold text-gray-800">জন্মনিবন্ধন আবেদন ও সংশোধন</h4>
                            <p className="text-[9px] text-gray-500 font-medium">স্থানীয় সরকার বিভাগ</p>
                        </div>
                        <div className="text-green-400 text-sm">→</div>
                    </a>
                    <a href="http://www.educationboardresults.gov.bd/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 p-3 bg-gradient-to-r from-blue-50 to-white border border-blue-100 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95 group">
                        <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">🎓</div>
                        <div className="flex-1">
                            <h4 className="text-xs font-bold text-gray-800">মাধ্যমিক ও উচ্চ মাধ্যমিক রেজাল্ট</h4>
                            <p className="text-[9px] text-gray-500 font-medium">শিক্ষা মন্ত্রণালয়</p>
                        </div>
                        <div className="text-blue-400 text-sm">→</div>
                    </a>
                </div>
            </div>

            {/* Footer spacing */}
            <div className="h-6" />

            {/* Emergency SOS FAB */}
            <button
                onClick={() => setSosOpen(true)}
                className="fixed bottom-24 right-4 z-40 w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-xl shadow-red-500/40 flex items-center justify-center text-white text-xl hover:scale-110 active:scale-95 transition-transform"
                title="জরুরি সেবা"
            >
                🆘
            </button>

            {/* SOS Modal */}
            {sosOpen && (
                <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm p-4" onClick={e => e.target === e.currentTarget && setSosOpen(false)}>
                    <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-slide-up">
                        <div className="bg-gradient-to-br from-red-500 to-red-600 p-4 text-white text-center">
                            <div className="text-3xl mb-1">🆘</div>
                            <h3 className="text-lg font-extrabold">জরুরি হেল্পলাইন</h3>
                            <p className="text-red-100 text-[10px] font-medium mt-0.5">যেকোনো জরুরি পরিস্থিতিতে কল করুন</p>
                        </div>
                        <div className="p-4 space-y-2">
                            {[
                                { icon: '🚨', label: 'জাতীয় জরুরি সেবা', number: '999', color: 'red' },
                                { icon: '🚒', label: 'ফায়ার সার্ভিস', number: '199', color: 'orange' },
                                { icon: '🚑', label: 'অ্যাম্বুলেন্স', number: '199', color: 'green' },
                                { icon: '👮', label: 'পুলিশ হেল্পলাইন', number: '999', color: 'blue' },
                                { icon: '👩‍⚕️', label: 'স্বাস্থ্য হেল্পলাইন', number: '16263', color: 'teal' },
                                { icon: '⚡', label: 'বিদ্যুৎ সমস্যা', number: '16979', color: 'yellow' },
                            ].map(item => (
                                <a key={item.number + item.label} href={`tel:${item.number}`} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all active:scale-95 border border-gray-100">
                                    <span className="text-xl">{item.icon}</span>
                                    <div className="flex-1">
                                        <div className="text-sm font-bold text-gray-800">{item.label}</div>
                                    </div>
                                    <div className="bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs font-extrabold shadow-sm">📞 {item.number}</div>
                                </a>
                            ))}
                        </div>
                        <div className="p-3 border-t border-gray-100">
                            <button onClick={() => setSosOpen(false)} className="w-full py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors">বন্ধ করুন</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Blood Request Modal */}
            {bloodModalOpen && (
                <div
                    className="fixed inset-0 z-[55] flex flex-col justify-end sm:justify-center items-center bg-black/40 backdrop-blur-sm p-4"
                    onClick={(e) => e.target === e.currentTarget && setBloodModalOpen(false)}
                >
                    <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-slide-up flex flex-col max-h-[85vh] mb-14">
                        {/* Header */}
                        <div className="bg-gradient-to-br from-red-500 to-red-600 p-5 pb-6 text-white text-center relative rounded-b-3xl shadow-sm z-10">
                            <button
                                onClick={() => setBloodModalOpen(false)}
                                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-black/10 hover:bg-black/20 rounded-full transition-colors text-sm"
                            >
                                ✕
                            </button>
                            <div className="text-4xl mb-2 drop-shadow-md">🩸</div>
                            <h3 className="text-xl font-extrabold">রক্তের প্রয়োজন</h3>
                            <p className="text-red-100 text-[11px] font-medium mt-1">এই জেলার সকল ব্যবহারকারীকে নোটিফিকেশন পাঠানো হবে</p>
                        </div>

                        {/* Body */}
                        <div className="p-5 overflow-y-auto">
                            <form onSubmit={sendBloodAlert} className="space-y-4">
                                <div>
                                    <label className="text-sm font-bold text-gray-700 mb-1.5 block">রক্তের গ্রুপ <span className="text-red-500">*</span></label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(grp => (
                                            <button
                                                key={grp}
                                                type="button"
                                                onClick={() => setBloodGroup(grp)}
                                                className={`py-2 rounded-xl text-sm font-extrabold border-2 transition-all ${bloodGroup === grp ? 'bg-red-50 border-red-500 text-red-600 shadow-sm' : 'bg-white border-gray-100 text-gray-400 hover:border-red-200 hover:text-red-400'}`}
                                            >
                                                {grp}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-bold text-gray-700 mb-1.5 block">হাসপাতাল / স্থান <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="রোগী বর্তমানে কোথায় আছেন?"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 focus:bg-white transition-colors"
                                        value={hospital}
                                        onChange={e => setHospital(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-bold text-gray-700 mb-1.5 block">যোগাযোগ নম্বর <span className="text-red-500">*</span></label>
                                    <input
                                        type="tel"
                                        required
                                        placeholder="01XXXXXXXXX"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 focus:bg-white transition-colors"
                                        value={phone}
                                        onChange={e => setPhone(e.target.value)}
                                    />
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={requesting}
                                        className="w-full bg-red-500 hover:bg-red-600 text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-red-500/30 transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                                    >
                                        {requesting ? (
                                            <span>নোটিফিকেশন পাঠানো হচ্ছে...</span>
                                        ) : (
                                            <>
                                                <span>🚀</span>
                                                <span>সবার কাছে নোটিফিকেশন পাঠান</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
