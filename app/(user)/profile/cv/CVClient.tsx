'use client';

import { Profile, District } from '@/types';
import Link from 'next/link';

interface Props {
    profile: Profile;
    dist: (District & { divisionId: string; divisionName: string }) | null;
}

export default function CVClient({ profile, dist }: Props) {
    return (
        <div className="min-h-screen bg-gray-100 p-4 font-bengali pb-24 print:p-0 print:bg-white">
            <div className="max-w-3xl mx-auto flex justify-between items-center mb-6 print:hidden">
                <Link href="/profile" className="text-gray-500 hover:text-gray-800 font-bold flex items-center gap-1.5 bg-white px-4 py-2.5 rounded-xl shadow-sm transition-colors">
                    <span>←</span> প্রোফাইলে ফিরুন
                </Link>
                <button
                    onClick={() => window.print()}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2.5 rounded-xl font-bold shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all active:scale-95"
                >
                    <span>🖨️</span> পিডিএফ সেভ / প্রিন্ট
                </button>
            </div>

            <div className="max-w-3xl mx-auto bg-white shadow-xl print:shadow-none p-8 md:p-12 rounded-2xl print:p-8 border border-gray-100">
                {/* CV Header */}
                <div className="border-b-[3px] border-primary-500 pb-6 mb-8 flex items-start justify-between">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">{profile.name}</h1>
                        <div className="flex flex-col gap-1.5 mt-4">
                            <p className="text-[15px] text-gray-600 flex items-center gap-2 font-medium">
                                <span className="bg-primary-50 text-primary-600 p-1.5 rounded-lg text-sm">📞</span>
                                {profile.phone}
                            </p>
                            {profile.email && (
                                <p className="text-[15px] text-gray-600 flex items-center gap-2 font-medium">
                                    <span className="bg-primary-50 text-primary-600 p-1.5 rounded-lg text-sm">📧</span>
                                    {profile.email}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* CV Body */}
                <div className="space-y-10">
                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-primary-100 pb-2 flex items-center gap-2">
                            <span>📍</span> ঠিকানা ও অবস্থান
                        </h2>
                        <div className="grid grid-cols-2 gap-y-5 gap-x-8 text-gray-700 bg-gray-50/50 p-5 rounded-xl border border-gray-100">
                            <div><span className="font-bold block text-primary-600 text-xs tracking-wider uppercase mb-1">বিভাগ</span> <span className="font-semibold text-[15px]">{dist?.divisionName || '—'}</span></div>
                            <div><span className="font-bold block text-primary-600 text-xs tracking-wider uppercase mb-1">জেলা</span> <span className="font-semibold text-[15px]">{dist?.name || '—'}</span></div>
                            <div><span className="font-bold block text-primary-600 text-xs tracking-wider uppercase mb-1">উপজেলা / থানা</span> <span className="font-semibold text-[15px]">{profile.thana || '—'}</span></div>
                            <div><span className="font-bold block text-primary-600 text-xs tracking-wider uppercase mb-1">গ্রাম / মহল্লা</span> <span className="font-semibold text-[15px]">{profile.village || '—'}</span></div>
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center justify-between border-b-2 border-primary-100 pb-2 mb-4">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <span>🎓</span> শিক্ষাগত যোগ্যতা
                            </h2>
                            <span className="text-[10px] text-gray-400 bg-gray-100 px-2.5 py-1 rounded-md print:hidden">নিজে লিখে পূরণ করুন</span>
                        </div>
                        <div className="h-24 border border-dashed border-gray-300 rounded-xl bg-gray-50/30"></div>
                        <div className="h-24 border border-dashed border-gray-300 rounded-xl bg-gray-50/30 mt-4"></div>
                    </section>

                    <section>
                        <div className="flex items-center justify-between border-b-2 border-primary-100 pb-2 mb-4">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <span>💼</span> অভিজ্ঞতা ও দক্ষতা
                            </h2>
                            <span className="text-[10px] text-gray-400 bg-gray-100 px-2.5 py-1 rounded-md print:hidden">নিজে লিখে পূরণ করুন</span>
                        </div>
                        <div className="h-32 border border-dashed border-gray-300 rounded-xl bg-gray-50/30"></div>
                    </section>
                </div>

                {/* Footer */}
                <div className="mt-16 pt-8 border-t border-gray-200 flex justify-between items-center text-sm text-gray-400 print:fixed print:bottom-8 print:w-[calc(100%-4rem)] print:border-none print:mt-0">
                    <p className="font-medium">আমার জেলা অ্যাপ (amarjela.com)</p>
                    <p className="font-medium">প্রিন্ট তারিখ: {new Date().toLocaleDateString('bn-BD')}</p>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page { margin: 0; size: A4 portrait; }
                    body { background: white !important; font-size: 14pt; }
                    ::-webkit-scrollbar { display: none; }
                    nav { display: none !important; } /* Hide bottom nav */
                }
            `}} />
        </div>
    );
}
