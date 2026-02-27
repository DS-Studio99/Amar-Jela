'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { ContentItem, Review, District } from '@/types';
import { useRouter } from 'next/navigation';
import { getCategoryConfig } from '@/lib/data/category-fields';

interface Props {
    query: string;
    items: ContentItem[];
    district: (District & { divisionId: string; divisionName: string }) | null;
    districtId: string;
    userId: string;
    userName: string;
}

export default function SearchClient({ query, items, district, districtId, userId, userName }: Props) {
    const [detailItem, setDetailItem] = useState<ContentItem | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [userRating, setUserRating] = useState(5);
    const [userComment, setUserComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    // Fetch reviews when detail modal opens
    useEffect(() => {
        if (detailItem) {
            loadReviews(detailItem.id);
            // Increment views
            supabase.rpc('increment_content_views', { content_id: detailItem.id }).then();
        } else {
            setReviews([]);
            setUserRating(5);
            setUserComment('');
        }
    }, [detailItem]);

    async function loadReviews(contentId: string) {
        setLoadingReviews(true);
        const { data } = await supabase.from('reviews')
            .select('*, profiles(name, avatar_url)')
            .eq('content_id', contentId)
            .order('created_at', { ascending: false });
        setReviews((data || []) as Review[]);
        setLoadingReviews(false);
    }

    async function submitReview() {
        if (!userId) { router.push('/login'); return; }
        if (!detailItem) return;

        setSubmittingReview(true);
        await supabase.from('reviews').upsert({
            content_id: detailItem.id,
            user_id: userId,
            rating: userRating,
            comment: userComment.trim() || null,
        }, { onConflict: 'content_id,user_id' });

        await loadReviews(detailItem.id);
        setSubmittingReview(false);
        setUserComment('');
    }

    async function reportItem(item: ContentItem) {
        if (!userId) { router.push('/login'); return; }
        const reason = window.prompt('কেন রিপোর্ট করতে চান? (যেমন: ভুল নম্বর, ভুয়া তথ্য)');
        if (!reason?.trim()) return;

        await supabase.from('reports').insert({
            content_id: item.id,
            user_id: userId,
            reason: reason.trim()
        });
        window.alert('আপনার রিপোর্টটি জমা দেওয়া হয়েছে। এডমিন এটি যাচাই করে দেখবেন।');
    }

    async function toggleSave(item: ContentItem) {
        if (!userId) {
            router.push('/login');
            return;
        }

        const isCurrentlySaved = item.isSaved;
        if (isCurrentlySaved) {
            await supabase.from('saved_items').delete().eq('user_id', userId).eq('content_id', item.id);
        } else {
            await supabase.from('saved_items').insert({ user_id: userId, content_id: item.id });
        }
        router.refresh();
    }

    return (
        <div className="pb-24 pt-4 min-h-screen bg-gray-50/50">
            {/* Header */}
            <div className="mx-4 mb-4">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard" className="w-10 h-10 bg-white shadow-sm flex items-center justify-center rounded-2xl hover:bg-gray-50 transition-colors">
                        <span className="text-xl">←</span>
                    </Link>
                    <div>
                        <h1 className="text-xl font-extrabold text-gray-800 tracking-tight">সার্চ ফলাফল</h1>
                        <p className="text-sm font-semibold text-gray-500">"{query}" এর জন্য {items.length} টি তথ্য পাওয়া গেছে</p>
                    </div>
                </div>
            </div>

            {/* Global Search Bar (Keep it here for quickly searching again) */}
            <div className="mx-4 mb-6">
                <form action="/search" method="GET" className="relative group block">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <span className="text-gray-400 group-focus-within:text-primary-500 transition-colors">🔍</span>
                    </div>
                    <input
                        type="text"
                        name="q"
                        defaultValue={query}
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

            {/* Results Grid */}
            <div className="px-4 space-y-3">
                {items.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <span className="text-5xl mb-3 block">🤷</span>
                        <h3 className="text-lg font-bold text-gray-600">কোনো তথ্য পাওয়া যায়নি</h3>
                        <p className="text-sm text-gray-400 mt-1">ভিন্ন শব্দ দিয়ে সার্চ করার চেষ্টা করুন</p>
                    </div>
                ) : (
                    items.map(item => {
                        const meta = (item.metadata || {}) as Record<string, string>;
                        const catConfig = getCategoryConfig(item.categories?.name || '');
                        const isDoctor = item.categories?.name === 'ডাক্তার';

                        return (
                            <div key={item.id} className={`bg-white rounded-3xl border overflow-hidden hover:shadow-lg transition-all duration-300 group ${item.is_sponsored ? 'border-amber-400 shadow-md ring-2 ring-amber-400/20' : 'border-gray-100'}`}>
                                <div className="p-4 relative">
                                    <div className="absolute top-4 right-4 z-10">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); toggleSave(item); }}
                                            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${item.isSaved ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-400'}`}
                                            title={item.isSaved ? "সেভ করা হয়েছে" : "সেভ করে রাখুন"}
                                        >
                                            <svg className={`w-5 h-5 ${item.isSaved ? 'fill-current' : 'fill-none stroke-current stroke-2'}`} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.998 21.054c-1.448-1.396-8.998-8.151-8.998-13.054 0-2.761 2.239-5 5-5 2.053 0 3.829 1.258 4.75 3.125A5.253 5.253 0 0 1 17.5 3c2.761 0 5 2.239 5 5 0 4.903-7.55 11.658-8.998 13.054a1.496 1.496 0 0 1-1.504 0Z" />
                                            </svg>
                                        </button>
                                    </div>

                                    {item.is_sponsored && (
                                        <div className="absolute top-0 right-14 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-[10px] font-bold px-3 py-1 rounded-bl-2xl rounded-br-none rounded-tl-none rounded-tr-3xl flex items-center gap-1 shadow-sm">
                                            <span>⭐</span> <span>প্রিমিয়াম</span>
                                        </div>
                                    )}

                                    <div className="flex items-start gap-4 pr-12">
                                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-sm transition-transform group-hover:scale-105" style={{ background: (item.categories?.color || '#1a9e5c') + '18' }}>
                                            {item.categories?.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] font-bold text-primary-600 mb-0.5 tracking-wider uppercase">{item.categories?.name}</p>
                                            <h3 className="font-extrabold text-gray-800 text-[16px] leading-snug">{item.title}</h3>
                                            {isDoctor && meta.specialty && (
                                                <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold tracking-wide">🩺 {meta.specialty}</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action row visible on outside immediately */}
                                    <div className="mt-4 flex gap-2">
                                        <button onClick={() => setDetailItem(item)} className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold py-2.5 rounded-xl text-sm transition-colors border border-gray-100 flex items-center justify-center gap-1.5">
                                            <span>👁️</span> বিস্তারিত
                                        </button>
                                        {item.phone && (
                                            <a
                                                href={`tel:${item.phone}`}
                                                onClick={() => supabase.rpc('increment_content_calls', { content_id: item.id }).then()}
                                                className="flex-1 bg-primary-50 hover:bg-primary-100 text-primary-700 font-bold py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-1.5"
                                            >
                                                <span>📞</span> কল করুন
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Detail Modal */}
            {detailItem && (
                <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/50 backdrop-blur-sm" onClick={e => e.target === e.currentTarget && setDetailItem(null)}>
                    <div className="bg-white w-full rounded-t-3xl shadow-2xl animate-slide-up flex flex-col h-[90vh]">
                        {/* Header */}
                        <div className="p-4 flex items-center justify-between border-b border-gray-100 flex-shrink-0">
                            <div>
                                <h2 className="text-xl font-extrabold text-gray-800 leading-tight">{detailItem.title}</h2>
                                <p className="text-primary-600 text-[11px] font-bold mt-0.5 flex items-center gap-1">
                                    <span>{detailItem.categories?.icon}</span> {detailItem.categories?.name}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => reportItem(detailItem)} className="text-[10px] text-red-500 bg-red-50 hover:bg-red-100 px-2 py-1.5 rounded-lg transition-colors font-bold flex items-center gap-1">
                                    <span>🚩</span> রিপোর্ট
                                </button>
                                <button onClick={() => setDetailItem(null)} className="w-9 h-9 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full flex items-center justify-center transition-colors shadow-sm">
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* Details area */}
                        <div className="p-5 overflow-y-auto flex-1 pb-32">
                            {/* Address */}
                            {detailItem.address && (
                                <div className="mb-4 bg-gray-50 border border-gray-100 rounded-2xl p-4">
                                    <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">ঠিকানা</span>
                                    <p className="text-gray-800 font-semibold mb-2 leading-relaxed">{detailItem.address}</p>
                                    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(detailItem.address + (district?.name ? `, ${district.name}` : ''))}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                                        📍 গুগল ম্যাপে দেখুন
                                    </a>
                                </div>
                            )}

                            {/* Additional Meta Fields */}
                            {Object.keys((detailItem.metadata || {})).length > 0 && (
                                <div className="space-y-2 mb-5">
                                    {getCategoryConfig(detailItem.categories?.name || '').fields.map(f => {
                                        const v = (detailItem.metadata || {})[f.key];
                                        if (!v) return null;
                                        return (
                                            <div key={f.key} className="flex flex-col gap-0.5 bg-white border border-gray-100 rounded-xl px-4 py-2.5 shadow-sm">
                                                <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">{f.label}</span>
                                                <span className="text-[14px] font-semibold text-gray-800">{v}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Description */}
                            {detailItem.description && (
                                <div className="mb-6 border-t border-gray-100 pt-5">
                                    <h4 className="font-extrabold text-gray-800 text-sm mb-2 flex items-center gap-1.5"><span>📄</span> বিস্তারিত তথ্য</h4>
                                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{detailItem.description}</p>
                                </div>
                            )}

                            {/* Reviews & Ratings Section */}
                            <div className="border-t border-gray-100 pt-6">
                                <h4 className="font-extrabold text-gray-800 text-sm mb-4 flex items-center gap-1.5"><span>⭐</span> রিভিউ এবং রেটিং</h4>

                                <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-4 mb-4">
                                    <div className="flex items-center gap-1 text-2xl mb-2 justify-center">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <button key={star} onClick={() => setUserRating(star)} className={`transition-transform hover:scale-110 ${star <= userRating ? 'text-amber-400' : 'text-gray-300'}`}>
                                                ★
                                            </button>
                                        ))}
                                    </div>
                                    <textarea
                                        className="w-full bg-white border border-amber-200 rounded-xl p-3 text-sm focus:outline-none focus:border-amber-400 resize-none mb-2"
                                        rows={2}
                                        placeholder="আপনার মতামত লিখুন... (ক্লিক করতে লগইন প্রয়োজন হতে পারে)"
                                        value={userComment}
                                        onChange={e => setUserComment(e.target.value)}
                                        onClick={() => !userId && router.push('/login')}
                                    />
                                    <button onClick={submitReview} disabled={submittingReview || !userId} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 rounded-xl text-sm transition-colors disabled:opacity-50">
                                        {submittingReview ? 'সাবমিট হচ্ছে...' : 'রেটিং সাবমিট করুন'}
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {loadingReviews ? (
                                        <div className="text-center py-4 text-sm text-gray-400">রিভিউ লোড হচ্ছে...</div>
                                    ) : reviews.length === 0 ? (
                                        <div className="text-center py-4 text-sm text-gray-400 bg-gray-50 rounded-xl">এখনও কোনো রিভিউ নেই।</div>
                                    ) : reviews.map(review => (
                                        <div key={review.id} className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="font-bold text-sm text-gray-800">{review.profiles?.name || 'অজ্ঞাত ব্যবহারকারী'}</div>
                                                <div className="text-amber-400 text-xs">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
                                            </div>
                                            {review.comment && <p className="text-xs text-gray-600 mt-1">{review.comment}</p>}
                                            <div className="text-[10px] text-gray-400 mt-2">{new Date(review.created_at).toLocaleDateString('bn-BD')}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Modal Action Buttons Footer */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white/95 backdrop-blur-md pb-8 flex gap-2 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
                            <button
                                onClick={() => {
                                    if (navigator.share) {
                                        navigator.share({
                                            title: detailItem.title,
                                            text: `আমার জেলা অ্যাপ থেকে ${detailItem.title} এর তথ্য দেখুন!\n📞 ${detailItem.phone || ''}\n📍 ${detailItem.address || ''}`,
                                            url: window.location.href,
                                        }).catch(console.error);
                                    } else {
                                        alert('আপনার ব্রাউজার শেয়ারিং সাপোর্ট করে না।');
                                    }
                                }}
                                className="w-12 h-12 flex items-center justify-center bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-colors shadow-sm flex-shrink-0"
                                title="শেয়ার করুন"
                            >
                                <span className="text-xl">🔗</span>
                            </button>

                            {detailItem.phone && (
                                <a
                                    href={`https://wa.me/88${detailItem.phone.replace(/[^0-9]/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => supabase.rpc('increment_content_calls', { content_id: detailItem.id }).then()}
                                    className="w-12 h-12 flex items-center justify-center bg-[#25D366]/10 text-[#25D366] rounded-2xl hover:bg-[#25D366]/20 transition-colors shadow-sm flex-shrink-0"
                                    title="হোয়াটসঅ্যাপে মেসেজ দিন"
                                >
                                    <span className="text-2xl">💬</span>
                                </a>
                            )}

                            {detailItem.phone ? (
                                <a
                                    href={`tel:${detailItem.phone}`}
                                    onClick={() => supabase.rpc('increment_content_calls', { content_id: detailItem.id }).then()}
                                    className="btn-primary flex-1 text-sm py-3 shadow-md h-12 flex items-center justify-center gap-2"
                                >
                                    <span className="text-lg">📞</span>
                                    <span>কল করুন</span>
                                </a>
                            ) : (
                                <button disabled className="bg-gray-200 text-gray-400 flex-1 rounded-xl text-sm font-semibold h-12 flex items-center justify-center shadow-sm cursor-not-allowed">
                                    ফোন নম্বর নেই
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
