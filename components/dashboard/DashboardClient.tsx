'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Category, Notice, Banner } from '@/types';
import { District } from '@/types';

import { createClient } from '@/lib/supabase/client';

interface Props {
    categories: Category[];
    notices: Notice[];
    banners?: Banner[];
    district: (District & { divisionId: string; divisionName: string }) | null;
    districtId: string;
}

const FALLBACK_IMAGES = [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542640244-7e672d6cef4e?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop',
];

export default function DashboardClient({ categories, notices, banners = [], district, districtId }: Props) {
    const [slideIndex, setSlideIndex] = useState(0);
    const [bloodModalOpen, setBloodModalOpen] = useState(false);
    const [bloodGroup, setBloodGroup] = useState('A+');
    const [hospital, setHospital] = useState('');
    const [phone, setPhone] = useState('');
    const [requesting, setRequesting] = useState(false);

    const supabase = createClient();

    const activeSlides: Array<{ src: string, link?: string }> = banners.length > 0
        ? banners.map(b => ({ src: b.image_url, link: b.link }))
        : (district?.image ? [district.image, ...FALLBACK_IMAGES] : FALLBACK_IMAGES).map(src => ({ src }));

    async function sendBloodAlert(e: React.FormEvent) {
        e.preventDefault();
        if (!hospital.trim() || !phone.trim()) { alert('স্থান এবং মোবাইল নম্বর দিন'); return; }

        setRequesting(true);
        // Get users in district
        const { data: users } = await supabase.from('profiles').select('id').eq('district_id', districtId);

        if (users && users.length > 0) {
            const notifications = users.map(u => ({
                user_id: u.id,
                title: '🆘 জরুরি রক্তের প্রয়োজন!',
                message: `রক্তের গ্রুপ: ${bloodGroup}\nরোগী আছে: ${hospital}\nযোগাযোগ: ${phone}`,
                type: 'emergency',
            }));
            await supabase.from('user_notifications').insert(notifications);

            // Auto close and alert
            alert('আপনার অনুরোধ বর্তমান জেলার সকল অ্যাপ ব্যবহারকারীর কাছে নোটিফিকেশন হিসেবে পাঠানো হয়েছে।');
            setBloodModalOpen(false);
            setHospital(''); setPhone('');
        } else {
            alert('আপনার জেলায় কোনো ব্যবহারকারী পাওয়া যায়নি।');
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
            {/* Hero Image Slider */}
            <div className="relative mx-3 mt-3 rounded-3xl overflow-hidden bg-gray-200 shadow-lg" style={{ height: '200px' }}>
                {activeSlides.map((slide, i) => {
                    const content = <Image src={slide.src} alt={`slide-${i}`} fill className="object-cover" unoptimized />;
                    return (
                        <div key={i} className={`absolute inset-0 transition-all duration-1000 ${i === slideIndex ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'}`}>
                            {slide.link ? <a href={slide.link} target="_blank" rel="noreferrer" className="block w-full h-full">{content}</a> : content}
                        </div>
                    );
                })}
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Caption */}
                <div className="absolute inset-x-0 bottom-0 px-5 pb-4">
                    <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-base">🏙️</div>
                        <div>
                            <p className="text-white text-base font-extrabold drop-shadow-lg">
                                {district ? district.name : 'আমার'} জেলায় স্বাগতম
                            </p>
                            <p className="text-white/70 text-[11px] font-medium">
                                {district?.divisionName} বিভাগ, বাংলাদেশ
                            </p>
                        </div>
                    </div>
                </div>

                {/* Dots */}
                <div className="absolute bottom-3 right-4 flex gap-1.5 z-20">
                    {activeSlides.map((_, i) => (
                        <button key={i} onClick={() => setSlideIndex(i)} className={`rounded-full transition-all duration-300 ${i === slideIndex ? 'w-6 h-2 bg-white shadow-lg' : 'w-2 h-2 bg-white/40'}`} />
                    ))}
                </div>
            </div>

            {/* Notice Bar */}
            {noticeText && (
                <div className="mx-3 mt-3 flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl px-3.5 py-2.5 overflow-hidden shadow-sm">
                    <span className="text-[10px] font-extrabold text-amber-800 bg-amber-200/60 rounded-lg px-2 py-1 whitespace-nowrap tracking-wider uppercase">নোটিশ</span>
                    <div className="marquee-wrapper flex-1 overflow-hidden">
                        <span className="marquee-text text-xs text-amber-800 font-medium">{noticeText}</span>
                    </div>
                </div>
            )}

            {/* Quick Stats */}
            <div className="mx-3 mt-3 flex gap-2">
                <div className="flex-1 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-3 text-center text-white shadow-lg" style={{ boxShadow: '0 8px 24px rgba(26,158,92,0.25)' }}>
                    <span className="text-2xl">📂</span>
                    <p className="text-xl font-extrabold mt-0.5">{categories.length}</p>
                    <p className="text-[10px] text-white/80 font-medium">ক্যাটাগরি</p>
                </div>
                <div className="flex-1 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-3 text-center text-white shadow-lg" style={{ boxShadow: '0 8px 24px rgba(59,130,246,0.25)' }}>
                    <span className="text-2xl">🗺️</span>
                    <p className="text-xl font-extrabold mt-0.5">{district?.name || '—'}</p>
                    <p className="text-[10px] text-white/80 font-medium">বর্তমান জেলা</p>
                </div>
                <Link href="/settings" className="flex-1 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-3 text-center text-white shadow-lg hover:scale-[1.02] transition-transform" style={{ boxShadow: '0 8px 24px rgba(139,92,246,0.25)' }}>
                    <span className="text-2xl">⚙️</span>
                    <p className="text-lg font-extrabold mt-0.5">→</p>
                    <p className="text-[10px] text-white/80 font-medium">পরিবর্তন</p>
                </Link>
            </div>

            {/* Global Search Bar */}
            <div className="mx-3 mt-4">
                <form action="/search" method="GET" className="relative group block">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <span className="text-gray-400 group-focus-within:text-primary-500 transition-colors">🔍</span>
                    </div>
                    <input
                        type="text"
                        name="q"
                        placeholder="যেকোনো সেবা খুঁজুন (যেমন: ডাক্তার, পুলিশ)..."
                        className="w-full bg-white border-2 border-primary-100 rounded-2xl py-3.5 pl-10 pr-4 text-sm text-gray-800 shadow-sm focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-50 transition-all font-medium placeholder:text-gray-400"
                        required
                    />
                    <div className="absolute inset-y-0 right-2 flex items-center">
                        <button type="submit" className="bg-primary-50 text-primary-600 px-3 py-1.5 rounded-xl hover:bg-primary-100 transition-colors font-bold text-xs">
                            খুঁজুন
                        </button>
                    </div>
                </form>
            </div>

            {/* Emergency Blood Request Button */}
            <div className="mx-3 mt-4">
                <button
                    onClick={() => setBloodModalOpen(true)}
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-3.5 rounded-2xl shadow-lg shadow-red-500/30 flex items-center justify-center gap-2 transition-all active:scale-95 group"
                >
                    <span className="text-2xl group-hover:scale-110 transition-transform">🩸</span>
                    <span className="font-extrabold text-base tracking-wide">জরুরি রক্তের প্রয়োজন?</span>
                </button>
            </div>

            {/* Section Divider */}
            <div className="px-4 pt-5 pb-2">
                <div className="flex items-center gap-3">
                    <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent to-primary-200" />
                    <h2 className="text-sm font-extrabold text-gray-700 tracking-wide flex items-center gap-1.5">
                        <span className="text-base">✨</span>সকল সেবা সমূহ
                    </h2>
                    <div className="h-0.5 flex-1 bg-gradient-to-l from-transparent to-primary-200" />
                </div>
            </div>

            {/* Category Groups */}
            {Object.entries(groups).map(([groupName, cats]) => (
                <div key={groupName} className="px-3 mt-2.5 mb-3">
                    {/* Group Header */}
                    <div className="flex items-center gap-2 mb-3 px-1">
                        <div className="w-1 h-5 bg-gradient-to-b from-primary-400 to-primary-600 rounded-full" />
                        <h3 className="text-[13px] font-bold text-gray-600">{groupName}</h3>
                        <div className="h-px flex-1 bg-gray-100" />
                    </div>

                    {/* Category Grid */}
                    <div className="grid grid-cols-3 gap-2.5">
                        {cats.map((cat, idx) => (
                            <Link
                                key={cat.id}
                                href={`/service/${cat.id}?district=${districtId}`}
                                className="group relative flex flex-col items-center gap-2 p-3.5 bg-white rounded-2xl border border-gray-100/80 hover:border-transparent hover:shadow-xl active:scale-95 transition-all duration-300"
                                style={{ animationDelay: `${idx * 40}ms` }}
                            >
                                {/* Icon Container */}
                                <div
                                    className="w-[52px] h-[52px] rounded-2xl flex items-center justify-center text-[22px] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg"
                                    style={{
                                        background: `linear-gradient(135deg, ${cat.color}15, ${cat.color}25)`,
                                        boxShadow: `0 4px 12px ${cat.color}15`,
                                    }}
                                >
                                    {cat.icon}
                                </div>

                                {/* Name */}
                                <span className="text-[11px] font-semibold text-gray-600 text-center leading-tight group-hover:text-gray-800 transition-colors">{cat.name}</span>

                                {/* Hover glow */}
                                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ boxShadow: `0 0 0 1px ${cat.color}30, 0 8px 25px ${cat.color}15` }} />
                            </Link>
                        ))}
                    </div>
                </div>
            ))}

            {/* Gov Emergency Section */}
            <div className="px-3 mt-6 mb-3">
                <div className="flex items-center gap-2 mb-3 px-1">
                    <div className="w-1 h-5 bg-gradient-to-b from-red-500 to-red-600 rounded-full" />
                    <h3 className="text-[13px] font-bold text-gray-800">সরকার জরুরি কার্যক্রম</h3>
                    <div className="h-px flex-1 bg-red-100" />
                </div>
                <div className="flex flex-col gap-2.5">
                    <a href="https://services.nidw.gov.bd/nid-pub/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3.5 bg-gradient-to-r from-red-50 to-white border border-red-100 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95 group">
                        <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">🪪</div>
                        <div className="flex-1">
                            <h4 className="text-sm font-bold text-gray-800">ভোটার কার্ড আবেদন ও সংশোধন</h4>
                            <p className="text-[10px] text-gray-500 font-medium mt-0.5">বাংলাদেশ নির্বাচন কমিশন</p>
                        </div>
                        <div className="text-red-400">→</div>
                    </a>
                    <a href="https://bdris.gov.bd/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3.5 bg-gradient-to-r from-green-50 to-white border border-green-100 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95 group">
                        <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">👶</div>
                        <div className="flex-1">
                            <h4 className="text-sm font-bold text-gray-800">জন্মনিবন্ধন আবেদন ও সংশোধন</h4>
                            <p className="text-[10px] text-gray-500 font-medium mt-0.5">স্থানীয় সরকার বিভাগ</p>
                        </div>
                        <div className="text-green-400">→</div>
                    </a>
                    <a href="http://www.educationboardresults.gov.bd/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3.5 bg-gradient-to-r from-blue-50 to-white border border-blue-100 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95 group">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">🎓</div>
                        <div className="flex-1">
                            <h4 className="text-sm font-bold text-gray-800">মাধ্যমিক ও উচ্চ মাধ্যমিক রেজাল্ট</h4>
                            <p className="text-[10px] text-gray-500 font-medium mt-0.5">শিক্ষা মন্ত্রণালয়</p>
                        </div>
                        <div className="text-blue-400">→</div>
                    </a>
                </div>
            </div>

            {/* Footer spacing */}
            <div className="h-6" />

            {/* Blood Request Modal */}
            {bloodModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center items-center bg-black/40 backdrop-blur-sm p-4"
                    onClick={(e) => e.target === e.currentTarget && setBloodModalOpen(false)}
                >
                    <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-slide-up flex flex-col max-h-[90vh]">
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
                                        placeholder="রোগী বর্তমানে কোথায় আছেন?"
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
