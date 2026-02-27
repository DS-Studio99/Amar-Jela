'use client';

import { useState, useRef } from 'react';
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

const STATUS_LABELS: Record<string, { label: string; cls: string; color: string }> = {
    pending: { label: '⏳ অপেক্ষমান', cls: 'badge-pending', color: 'amber' },
    approved: { label: '✅ অনুমোদিত', cls: 'badge-approved', color: 'green' },
    rejected: { label: '❌ প্রত্যাখ্যাত', cls: 'badge-rejected', color: 'red' },
};

export default function ProfileClient({ profile, dist, submissions, savedItems, userId }: Props) {
    const [editOpen, setEditOpen] = useState(false);
    const [name, setName] = useState(profile?.name || '');
    const [village, setVillage] = useState(profile?.village || '');
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'saved' | 'submissions'>('saved');
    const [uploading, setUploading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
    const fileRef = useRef<HTMLInputElement>(null);
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

    async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const ext = file.name.split('.').pop();
        const path = `avatars/${userId}.${ext}`;

        const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });

        if (!error) {
            const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path);
            await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', userId);
            setAvatarUrl(publicUrl);
            router.refresh();
        } else {
            alert('ছবি আপলোড ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
        }
        setUploading(false);
    }

    return (
        <div className="pb-20">
            {/* Hero */}
            <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-8 px-4 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 20%, white 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
                <div className="relative z-10">
                    {/* Avatar with upload */}
                    <div className="relative inline-block">
                        {avatarUrl ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={avatarUrl} alt={profile?.name || ''} className="w-20 h-20 rounded-full mx-auto border-4 border-white/30 shadow-xl object-cover" />
                        ) : (
                            <div className="w-20 h-20 bg-white/20 rounded-full mx-auto flex items-center justify-center text-4xl border-4 border-white/30 shadow-xl">👤</div>
                        )}
                        <button
                            onClick={() => fileRef.current?.click()}
                            disabled={uploading}
                            className="absolute -bottom-1 -right-1 w-8 h-8 bg-white text-primary-600 rounded-full flex items-center justify-center shadow-lg border-2 border-primary-600 hover:bg-primary-50 transition-colors"
                            title="ছবি পরিবর্তন করুন"
                        >
                            {uploading ? '⏳' : '📷'}
                        </button>
                        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                    </div>
                    <h2 className="text-xl font-extrabold mt-3">{profile?.name}</h2>
                    <p className="text-white/70 text-sm">{profile?.phone}</p>
                    <div className="mt-2 inline-flex bg-white/15 rounded-xl px-3 py-1.5 text-sm gap-2 items-center">
                        📍 {dist ? `${dist.name}, ${dist.divisionName}` : '—'}
                    </div>
                </div>
            </div>

            <div className="p-4 space-y-4">
                {/* Info Card */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
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
                        ❤️ সেভ করা ({savedItems.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('submissions')}
                        className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${activeTab === 'submissions' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        📝 আমার জমা ({submissions.length})
                    </button>
                </div>

                {/* Tab Content — Card Layout */}
                <div className="space-y-3 min-h-[200px]">
                    {activeTab === 'submissions' ? (
                        <>
                            {submissions.length === 0 ? (
                                <div className="text-center py-10 text-gray-400 text-sm">
                                    <span className="text-4xl block mb-3 opacity-30">📝</span>
                                    কোনো তথ্য জমা দেননি।
                                </div>
                            ) : submissions.map(s => {
                                const status = STATUS_LABELS[s.status] || STATUS_LABELS.pending;
                                return (
                                    <div key={s.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-all">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-lg flex-shrink-0">
                                                    {s.categories?.icon || '📋'}
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="text-sm font-bold text-gray-800 leading-tight">{s.title}</h4>
                                                    <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1.5">
                                                        <span>{s.categories?.name}</span> • <span>{new Date(s.created_at).toLocaleDateString('bn-BD')}</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded-lg whitespace-nowrap ${s.status === 'approved' ? 'bg-green-50 text-green-700 border border-green-200' :
                                                    s.status === 'rejected' ? 'bg-red-50 text-red-600 border border-red-200' :
                                                        'bg-amber-50 text-amber-700 border border-amber-200'
                                                }`}>
                                                {status.label}
                                            </span>
                                        </div>
                                        {s.phone && <p className="text-xs text-primary-600 font-medium mt-2 ml-13">📞 {s.phone}</p>}
                                    </div>
                                );
                            })}
                        </>
                    ) : (
                        <>
                            {savedItems.length === 0 ? (
                                <div className="text-center py-10 text-gray-400 text-sm">
                                    <span className="text-4xl block mb-3 opacity-30">❤️</span>
                                    কোনো সেভ করা তথ্য নেই।
                                </div>
                            ) : savedItems.map(s => (
                                <Link href={`/service/${s.category_id}?district=${s.district_id}`} key={s.id} className="block bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-lg flex-shrink-0">
                                            {s.categories?.icon || '❤️'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-bold text-gray-800 leading-tight">{s.title}</h4>
                                            {s.phone && <p className="text-xs text-primary-600 font-medium mt-1">📞 {s.phone}</p>}
                                            {s.address && <p className="text-[11px] text-gray-400 mt-1 line-clamp-1">📍 {s.address}</p>}
                                        </div>
                                        <span className="text-gray-300 text-sm mt-1">→</span>
                                    </div>
                                </Link>
                            ))}
                        </>
                    )}
                </div>

                {/* Actions */}
                <Link href="/profile/cv" className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white w-full py-3 rounded-xl text-sm font-bold shadow-md shadow-blue-500/20 transition-all">
                    <span className="text-lg">📄</span> সিভি জেনারেট করুন
                </Link>
                <Link href="/settings" className="btn-outline w-full text-sm">📍 জেলা পরিবর্তন করুন</Link>
                <button onClick={logout} className="btn-danger w-full text-sm mt-1">🚪 লগআউট</button>
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
