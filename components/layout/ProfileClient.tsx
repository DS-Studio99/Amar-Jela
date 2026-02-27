'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Profile, ContentItem } from '@/types';
import { District } from '@/types';

type SubmissionWithCat = ContentItem & { categories: { name: string; icon: string } | null };

interface Props {
    profile: Profile | null;
    dist: (District & { divisionId: string; divisionName: string }) | null;
    submissions: SubmissionWithCat[];
    savedItems: SubmissionWithCat[];
    userId: string;
}

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
    pending: { label: '⏳ অপেক্ষমান', cls: 'badge-pending' },
    approved: { label: '✅ অনুমোদিত', cls: 'badge-approved' },
    rejected: { label: '❌ প্রত্যাখ্যাত', cls: 'badge-rejected' },
};

export default function ProfileClient({ profile, dist, submissions, savedItems, userId }: Props) {
    const [editOpen, setEditOpen] = useState(false);
    const [name, setName] = useState(profile?.name || '');
    const [village, setVillage] = useState(profile?.village || '');
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'saved' | 'submissions'>('saved');
    const router = useRouter();
    const supabase = createClient();

    async function logout() {
        await supabase.auth.signOut();
        router.push('/login');
    }

    async function saveEdit() {
        setSaving(true);
        await supabase.from('profiles').update({ name, village }).eq('id', userId);
        setSaving(false); setEditOpen(false); router.refresh();
    }

    return (
        <div>
            {/* Hero */}
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-8 px-4 text-center">
                <div className="w-18 h-18 bg-white/20 rounded-full mx-auto flex items-center justify-center text-4xl mb-3 w-[72px] h-[72px]">👤</div>
                <h2 className="text-xl font-extrabold">{profile?.name}</h2>
                <p className="text-white/70 text-sm ">{profile?.phone}</p>
                <div className="mt-2 inline-flex bg-white/15 rounded-xl px-3 py-1.5 text-sm gap-2 items-center">
                    📍 {dist ? `${dist.name}, ${dist.divisionName}` : '—'}
                </div>
            </div>

            <div className="p-4 space-y-4">
                {/* Info Card */}
                <div className="card p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-gray-800">ব্যক্তিগত তথ্য</h3>
                        <button onClick={() => setEditOpen(true)} className="text-xs text-primary-600 font-semibold border border-primary-300 px-2.5 py-1 rounded-lg hover:bg-primary-50">✏️ সম্পাদনা</button>
                    </div>
                    {([['📧 ইমেইল', profile?.email || 'দেওয়া হয়নি'], ['🏛️ থানা', profile?.thana || 'দেওয়া হয়নি'], ['🏡 গ্রাম', profile?.village || 'দেওয়া হয়নি']] as [string, string][]).map(([k, v]) => (
                        <div key={k} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
                            <span className="text-sm text-gray-500">{k}</span>
                            <span className="text-sm font-semibold text-gray-800">{v}</span>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex gap-2 p-1.5 bg-gray-100 rounded-2xl">
                    <button
                        onClick={() => setActiveTab('saved')}
                        className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${activeTab === 'saved' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        ❤️ সেভ করা তথ্য ({savedItems.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('submissions')}
                        className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${activeTab === 'submissions' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        📝 আমার জমা ({submissions.length})
                    </button>
                </div>

                {/* Tab Content */}
                <div className="card p-4 min-h-[200px]">
                    {activeTab === 'submissions' ? (
                        <>
                            {submissions.length === 0 ? (
                                <div className="text-center py-6 text-gray-400 text-sm flex flex-col items-center justify-center h-full">
                                    <span className="text-3xl mb-2">📝</span>
                                    কোনো তথ্য জমা দেননি।
                                </div>
                            ) : submissions.map(s => (
                                <div key={s.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                    <div>
                                        <div className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
                                            <span>{s.categories?.icon}</span> {s.title}
                                        </div>
                                        <div className="text-[11px] text-gray-400 mt-1">{new Date(s.created_at).toLocaleDateString('bn-BD')}</div>
                                    </div>
                                    <span className={STATUS_LABELS[s.status]?.cls}>{STATUS_LABELS[s.status]?.label}</span>
                                </div>
                            ))}
                        </>
                    ) : (
                        <>
                            {savedItems.length === 0 ? (
                                <div className="text-center py-6 text-gray-400 text-sm flex flex-col items-center justify-center h-full">
                                    <span className="text-3xl mb-2">❤️</span>
                                    কোনো সেভ করা তথ্য নেই।
                                </div>
                            ) : savedItems.map(s => (
                                <Link href={`/service/${s.category_id}?district=${s.district_id}`} key={s.id} className="block py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
                                                <span>{s.categories?.icon}</span> {s.title}
                                            </div>
                                            {s.phone && <div className="text-xs text-primary-600 font-medium mt-1">📞 {s.phone}</div>}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </>
                    )}
                </div>

                {/* Actions */}
                <Link href="/profile/cv" className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white w-full py-3 rounded-xl text-sm font-bold shadow-md shadow-blue-500/20 transition-all mb-3">
                    <span className="text-lg">📄</span> সিভি ডাউনলোড করুন (PDF)
                </Link>
                <Link href="/settings" className="btn-outline w-full text-sm">⚙️ জেলা পরিবর্তন করুন</Link>
                <button onClick={logout} className="btn-danger w-full text-sm mt-3">🚪 লগআউট</button>
            </div>

            {/* Edit Modal */}
            {editOpen && (
                <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm" onClick={e => e.target === e.currentTarget && setEditOpen(false)}>
                    <div className="w-full max-w-[480px] bg-white rounded-t-3xl p-5 animate-slide-up">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-800">প্রোফাইল সম্পাদনা</h3>
                            <button onClick={() => setEditOpen(false)} className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-sm hover:bg-red-100 hover:text-red-500">✕</button>
                        </div>
                        <div className="space-y-3">
                            <div><label className="text-sm font-semibold text-gray-700 block mb-1">পূর্ণ নাম</label><input className="input-field" value={name} onChange={e => setName(e.target.value)} /></div>
                            <div><label className="text-sm font-semibold text-gray-700 block mb-1">গ্রাম/মহল্লা</label><input className="input-field" value={village} onChange={e => setVillage(e.target.value)} /></div>
                            <div className="flex gap-3 pt-1">
                                <button onClick={() => setEditOpen(false)} className="btn-secondary flex-1 text-sm py-2.5">বাতিল</button>
                                <button onClick={saveEdit} disabled={saving} className="btn-primary flex-[2] text-sm py-2.5">{saving ? 'সংরক্ষণ হচ্ছে...' : '💾 সংরক্ষণ'}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
