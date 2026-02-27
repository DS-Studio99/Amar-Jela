'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Category, ContentItem, Review } from '@/types';
import { District } from '@/types';
import { useRouter } from 'next/navigation';
import { getCategoryConfig, CategoryField } from '@/lib/data/category-fields';

interface Props {
    category: Category | null;
    items: ContentItem[];
    district: (District & { divisionId: string; divisionName: string }) | null;
    districtId: string;
    userId: string;
    userName: string;
}

export default function ServiceClient({ category, items, district, districtId, userId, userName }: Props) {
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [error, setError] = useState('');
    const [detailItem, setDetailItem] = useState<ContentItem | null>(null);
    const [warningAccepted, setWarningAccepted] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [userRating, setUserRating] = useState(5);
    const [userComment, setUserComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const catConfig = getCategoryConfig(category?.name || '');
    const isDoctor = category?.name === 'ডাক্তার';

    // Show financial warning on page load for specific categories
    useEffect(() => {
        if (catConfig.showWarning && !warningAccepted) {
            setShowWarning(true);
        }
    }, [catConfig.showWarning, warningAccepted]);

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

    function updateField(key: string, value: string) {
        setFormData(prev => ({ ...prev, [key]: value }));
    }

    function openAddModal() {
        setFormData({});
        setError('');
        setSuccess(false);
        setModalOpen(true);
    }

    async function submitContent() {
        // Validate required fields
        const requiredFields = catConfig.fields.filter(f => f.required);
        for (const field of requiredFields) {
            if (!formData[field.key]?.trim()) {
                setError(`${field.label} লিখুন।`);
                return;
            }
        }

        setLoading(true);
        setError('');

        const { data: profile } = await supabase.from('profiles').select('division_id').eq('id', userId).single();

        // Separate standard fields from metadata
        const standardFields = ['title', 'phone', 'address', 'description'];
        const metadata: Record<string, string> = {};
        catConfig.fields.forEach(f => {
            if (!standardFields.includes(f.key) && formData[f.key]) {
                metadata[f.key] = formData[f.key];
            }
        });

        const { error: err } = await supabase.from('content').insert({
            category_id: category?.id,
            district_id: districtId,
            division_id: profile?.division_id || '',
            title: formData.title || '',
            phone: formData.phone || '',
            address: formData.address || '',
            description: formData.description || '',
            metadata: metadata,
            submitted_by: userId,
            submitted_by_name: userName,
            status: 'pending',
        });

        setLoading(false);
        if (err) { setError(err.message); return; }
        setSuccess(true);
        setTimeout(() => {
            setModalOpen(false);
            setSuccess(false);
            setFormData({});
            router.refresh();
        }, 2000);
    }

    function renderFieldInput(field: CategoryField) {
        const val = formData[field.key] || '';
        const baseClass = field.highlight
            ? 'w-full px-4 py-3 border-2 border-amber-300 rounded-xl text-gray-800 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all duration-200 bg-amber-50/50 font-bengali'
            : 'input-field';

        if (field.type === 'select' && field.options) {
            return (
                <select className={baseClass} value={val} onChange={e => updateField(field.key, e.target.value)}>
                    <option value="">বেছে নিন</option>
                    {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            );
        }
        if (field.type === 'textarea') {
            return <textarea className={`${baseClass} resize-none`} rows={3} placeholder={field.placeholder} value={val} onChange={e => updateField(field.key, e.target.value)} />;
        }
        return <input className={baseClass} type={field.type} placeholder={field.placeholder} value={val} onChange={e => updateField(field.key, e.target.value)} />;
    }

    async function toggleSave(item: ContentItem) {
        if (!userId) {
            router.push('/login');
            return;
        }

        const isCurrentlySaved = item.isSaved;

        // Optimistic UI update could be added here by managing items in state, 
        // but for simplicity we rely on router.refresh() after the db operation

        if (isCurrentlySaved) {
            await supabase.from('saved_items').delete().eq('user_id', userId).eq('content_id', item.id);
        } else {
            await supabase.from('saved_items').insert({ user_id: userId, content_id: item.id });
        }

        router.refresh(); // Refresh server component to get new saved state
    }

    // Render content card based on category
    function renderContentCard(item: ContentItem) {
        const meta = (item.metadata || {}) as Record<string, string>;
        const accentColor = category?.color || '#1a9e5c';

        return (
            <div key={item.id} className={`relative bg-white rounded-2xl overflow-hidden transition-all duration-300 group hover:-translate-y-0.5 ${item.is_sponsored ? 'ring-2 ring-amber-400/30 shadow-lg shadow-amber-100' : 'shadow-md shadow-gray-200/60 hover:shadow-xl hover:shadow-gray-300/40'}`} style={{ borderLeft: `3px solid ${accentColor}` }}>
                {/* Sponsored badge */}
                {item.is_sponsored && (
                    <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-400 to-orange-400 text-white text-[9px] font-bold px-3 py-1 rounded-bl-2xl flex items-center gap-1 shadow-sm z-10">
                        <span>⭐</span> <span>প্রিমিয়াম</span>
                    </div>
                )}

                {/* Card Header */}
                <div className="p-4 pb-2.5">
                    <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div
                            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                            style={{
                                background: `linear-gradient(135deg, ${accentColor}12, ${accentColor}25)`,
                                boxShadow: `0 4px 12px ${accentColor}15`,
                            }}
                        >
                            {category?.icon}
                        </div>
                        {/* Title & Phone */}
                        <div className="flex-1 min-w-0 pr-8">
                            <h3 className="font-extrabold text-gray-800 text-[15px] leading-snug group-hover:text-gray-900 transition-colors">{item.title}</h3>
                            {isDoctor && meta.specialty && (
                                <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-blue-50 text-blue-600 rounded-lg text-[11px] font-bold">🩺 {meta.specialty}</span>
                            )}
                            {item.phone && (
                                <a href={`tel:${item.phone}`} className="flex items-center gap-1.5 mt-1.5 text-primary-600 text-sm font-semibold hover:underline">
                                    📞 {item.phone}
                                </a>
                            )}
                        </div>
                        {/* Save Button */}
                        <button
                            onClick={(e) => { e.stopPropagation(); toggleSave(item); }}
                            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${item.isSaved ? 'bg-red-50 text-red-500 shadow-sm shadow-red-100' : 'bg-gray-50 text-gray-300 hover:bg-red-50 hover:text-red-400'}`}
                            title={item.isSaved ? "সেভ করা হয়েছে" : "সেভ করে রাখুন"}
                        >
                            <svg className={`w-4.5 h-4.5 ${item.isSaved ? 'fill-current' : 'fill-none stroke-current stroke-2'}`} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.998 21.054c-1.448-1.396-8.998-8.151-8.998-13.054 0-2.761 2.239-5 5-5 2.053 0 3.829 1.258 4.75 3.125A5.253 5.253 0 0 1 17.5 3c2.761 0 5 2.239 5 5 0 4.903-7.55 11.658-8.998 13.054a1.496 1.496 0 0 1-1.504 0Z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Highlighted Fields (Visit time, Fee, etc.) */}
                {(isDoctor || Object.keys(meta).length > 0) && catConfig.fields.filter(f => f.highlight && meta[f.key]).length > 0 && (
                    <div className="mx-4 mb-2 flex flex-wrap gap-1.5">
                        {catConfig.fields.filter(f => f.highlight && meta[f.key]).map(field => (
                            <div key={field.key} className="inline-flex items-center gap-1.5 py-1 px-2.5 bg-gradient-to-r from-amber-50 to-orange-50/80 border border-amber-200/50 rounded-lg">
                                <span className="text-[10px] font-bold text-amber-600">{field.label}:</span>
                                <span className="text-[10px] font-extrabold text-amber-800">{meta[field.key]}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Address */}
                {item.address && (
                    <div className="mx-4 mb-2">
                        <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.address + (district?.name ? `, ${district.name}` : ''))}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-gray-500 flex items-start gap-1.5 hover:text-primary-600 transition-colors group/addr"
                            title="ম্যাপে দেখুন"
                        >
                            <span className="flex-shrink-0 mt-0.5 group-hover/addr:scale-110 transition-transform">📍</span>
                            <span className="group-hover/addr:underline line-clamp-1">{item.address}</span>
                        </a>
                    </div>
                )}

                {/* Meta fields (non-highlighted) */}
                {Object.keys(meta).length > 0 && (
                    <div className="mx-4 mb-2 flex flex-wrap gap-1">
                        {catConfig.fields.filter(f => !f.highlight && f.key !== 'title' && f.key !== 'phone' && f.key !== 'address' && f.key !== 'description' && meta[f.key]).map(field => (
                            <span key={field.key} className="inline-flex items-center px-2 py-0.5 bg-gray-50 text-gray-600 rounded-md text-[10px] font-medium border border-gray-100">
                                {field.label.replace(/[⏰💰📞🩸🛣️🛤️🎟️📍🏢🎓📅💍💼📰🏫📚🛍️📦👮📱🚗🍽️🏊🚨📞]/g, '').trim()}: {meta[field.key]}
                            </span>
                        ))}
                    </div>
                )}

                {/* Description (truncated) */}
                {item.description && (
                    <div className="mx-4 mb-2">
                        <p className="text-[11px] text-gray-600 bg-gray-50/80 p-2.5 rounded-xl line-clamp-2 leading-relaxed">{item.description}</p>
                    </div>
                )}

                {/* Card Footer: Detail & Actions */}
                <div className="px-4 pb-3 pt-1 flex items-center justify-between border-t border-gray-50 mt-1">
                    <div className="flex items-center gap-2 text-[10px] text-gray-400">
                        {item.views !== undefined && <span>👁 {item.views}</span>}
                    </div>
                    <button onClick={() => setDetailItem(item)} className="text-[11px] text-primary-600 font-bold hover:text-primary-700 flex items-center gap-1 bg-primary-50/80 px-3 py-1.5 rounded-lg hover:bg-primary-100 transition-all active:scale-95">
                        বিস্তারিত →
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Financial Warning Modal */}
            {showWarning && catConfig.showWarning && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="w-full max-w-[400px] bg-white rounded-3xl shadow-2xl overflow-hidden animate-pop-in">
                        <div className="bg-gradient-to-br from-red-500 to-orange-500 px-6 py-8 text-center">
                            <div className="text-6xl mb-3">⚠️</div>
                            <h2 className="text-xl font-extrabold text-white">সতর্কতা!</h2>
                            <p className="text-white/80 text-sm mt-1">আর্থিক লেনদেনে সতর্ক থাকুন</p>
                        </div>
                        <div className="p-5 space-y-3">
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-800 leading-relaxed">
                                {catConfig.warningMessage}
                            </div>
                            <button onClick={() => { setShowWarning(false); setWarningAccepted(true); }} className="btn-primary w-full">
                                ✅ বুঝেছি, এগিয়ে যান
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Back + Header — fixed bar that never hides on scroll */}
            <div className="fixed top-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100" style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
                <div className="max-w-[480px] mx-auto px-3 py-1.5 flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center gap-0.5 text-gray-400 hover:text-gray-600 transition-colors text-[11px] font-medium">
                        ← ফিরে যান
                    </Link>
                    <div className="text-center flex items-center gap-1.5">
                        <span className="text-base">{category?.icon}</span>
                        <span className="text-[11px] font-bold text-gray-700">{category?.name}</span>
                        <span className="text-[9px] text-gray-400">• {district ? district.name : 'জেলা'}</span>
                    </div>
                    <button onClick={openAddModal} className="text-[10px] bg-gradient-to-r from-primary-500 to-primary-600 text-white px-2.5 py-1 rounded-lg font-semibold hover:from-primary-600 hover:to-primary-700 transition-all shadow-sm active:scale-95">+ যোগ</button>
                </div>
            </div>

            {/* Spacer for fixed header */}
            <div className="h-10" />

            {/* Content List */}
            <div className="p-3 space-y-3">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                        <div className="text-6xl mb-4 opacity-30">{category?.icon || '📭'}</div>
                        <p className="font-bold text-gray-500 text-base">কোনো তথ্য পাওয়া যায়নি</p>
                        <p className="text-sm mt-1.5 text-center text-gray-400">এই জেলায় {category?.name} এর তথ্য যোগ করুন!</p>
                        <button onClick={openAddModal} className="btn-primary mt-6 text-sm px-6 py-3 shadow-xl">+ প্রথম তথ্য যোগ করুন</button>
                    </div>
                ) : items.map(item => renderContentCard(item))}
            </div>

            {/* Submit Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 backdrop-blur-sm" onClick={e => e.target === e.currentTarget && setModalOpen(false)}>
                    <div className="w-full max-w-[480px] bg-white rounded-t-3xl animate-slide-up flex flex-col relative overflow-hidden" style={{ maxHeight: '92vh', minHeight: '60vh' }}>
                        {/* Modal Header - Fixed */}
                        <div className="flex items-center justify-between p-5 border-b border-gray-100 flex-shrink-0">
                            <h3 className="font-bold text-gray-800 text-base">✏️ নতুন {category?.name} যোগ করুন</h3>
                            <button onClick={() => setModalOpen(false)} className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-500 transition-all text-sm">✕</button>
                        </div>

                        {/* Modal Body - Scrollable */}
                        <div className="flex-1 overflow-y-auto p-5 pb-24">
                            {success ? (
                                <div className="text-center py-10">
                                    <div className="text-6xl mb-4">✅</div>
                                    <p className="font-bold text-green-700 text-lg">তথ্য জমা হয়েছে!</p>
                                    <p className="text-sm text-gray-500 mt-1">অ্যাডমিন অনুমোদনের পর প্রকাশিত হবে।</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-200">{error}</div>}

                                    {/* Category-specific warning */}
                                    {catConfig.showWarning && (
                                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 leading-relaxed">
                                            {catConfig.warningMessage}
                                        </div>
                                    )}

                                    {/* Dynamic Fields */}
                                    {catConfig.fields.map(field => (
                                        <div key={field.key}>
                                            <label className="text-sm font-semibold text-gray-700 mb-1.5 block flex items-center gap-1">
                                                {field.label}
                                                {field.required && <span className="text-red-500 ml-0.5">*</span>}
                                                {field.highlight && <span className="text-[10px] text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded-full font-bold ml-1">হাইলাইট</span>}
                                            </label>
                                            {renderFieldInput(field)}
                                        </div>
                                    ))}

                                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700 flex items-start gap-2">
                                        <span className="text-base">⚠️</span>
                                        <span>জমা দেওয়ার পর অ্যাডমিন পর্যালোচনা করবেন, অনুমোদনের পর প্রকাশিত হবে।</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer - Fixed at bottom */}
                        {!success && (
                            <div className="absolute bottom-0 left-0 right-0 flex gap-3 p-4 border-t border-gray-100 bg-white/95 backdrop-blur-md pb-8">
                                <button onClick={() => setModalOpen(false)} className="btn-secondary flex-1 text-sm py-3 shadow-md">বাতিল</button>
                                <button onClick={submitContent} disabled={loading} className="btn-primary flex-[2] text-sm py-3 shadow-md">
                                    {loading ? '⏳ পাঠানো হচ্ছে...' : '📤 জমা দিন'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {detailItem && (
                <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm" onClick={e => e.target === e.currentTarget && setDetailItem(null)}>
                    <div className="w-full max-w-[480px] bg-white rounded-t-3xl animate-slide-up flex flex-col relative overflow-hidden" style={{ maxHeight: '92vh', minHeight: '50vh' }}>
                        <div className="flex items-center justify-between p-5 border-b border-gray-100 flex-shrink-0">
                            <h3 className="font-bold text-gray-800 text-base">{category?.icon} বিস্তারিত তথ্য</h3>
                            <div className="flex items-center gap-2">
                                <button onClick={() => reportItem(detailItem)} className="text-[10px] text-red-500 bg-red-50 hover:bg-red-100 px-2 py-1.5 rounded-lg transition-colors font-bold flex items-center gap-1">
                                    <span>🚩</span> রিপোর্ট
                                </button>
                                <button onClick={() => setDetailItem(null)} className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-500 transition-all text-sm">✕</button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-5 space-y-4 pb-24">
                            {/* Title */}
                            <div className="text-center">
                                <div className="text-4xl mb-2">{category?.icon}</div>
                                <h2 className="text-xl font-extrabold text-gray-800">{detailItem.title}</h2>
                                {isDoctor && (detailItem.metadata as Record<string, string>)?.specialty && (
                                    <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">🩺 {(detailItem.metadata as Record<string, string>).specialty}</span>
                                )}
                            </div>

                            {/* Standard Info */}
                            <div className="bg-gray-50 rounded-2xl p-4 space-y-2.5">
                                {detailItem.phone && (
                                    <div className="flex justify-between items-center py-1">
                                        <span className="text-sm text-gray-500">📞 ফোন</span>
                                        <a href={`tel:${detailItem.phone}`} className="text-sm font-bold text-primary-600 hover:underline">{detailItem.phone}</a>
                                    </div>
                                )}
                                {detailItem.address && (
                                    <div className="flex justify-between items-center py-1 border-t border-gray-200/60 group">
                                        <span className="text-sm text-gray-500">📍 ঠিকানা</span>
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(detailItem.address + (district?.name ? `, ${district.name}` : ''))}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-semibold text-gray-800 text-right max-w-[55%] hover:text-primary-600 hover:underline transition-colors flex items-center justify-end gap-1"
                                            title="গুগল ম্যাপে দেখুন"
                                        >
                                            {detailItem.address}
                                            <span className="text-[10px] text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">↗ ম্যাপ</span>
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Highlighted Metadata */}
                            {(() => {
                                const meta = (detailItem.metadata || {}) as Record<string, string>;
                                const highlightedFields = catConfig.fields.filter(f => f.highlight && meta[f.key]);
                                if (highlightedFields.length === 0) return null;
                                return (
                                    <div className="grid grid-cols-2 gap-2.5">
                                        {highlightedFields.map(field => (
                                            <div key={field.key} className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-3.5 text-center">
                                                <div className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-1">{field.label.replace(/[⏰💰🎟️📅🚨📞🩸]/g, '').trim()}</div>
                                                <div className="text-sm font-extrabold text-amber-900">{meta[field.key]}</div>
                                            </div>
                                        ))}
                                    </div>
                                );
                            })()}

                            {/* All Metadata */}
                            {(() => {
                                const meta = (detailItem.metadata || {}) as Record<string, string>;
                                const otherFields = catConfig.fields.filter(f => !f.highlight && !['title', 'phone', 'address', 'description'].includes(f.key) && meta[f.key]);
                                if (otherFields.length === 0) return null;
                                return (
                                    <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
                                        {otherFields.map(field => (
                                            <div key={field.key} className="flex justify-between items-center py-1.5 border-b border-gray-100 last:border-0">
                                                <span className="text-sm text-gray-500">{field.label.replace(/[⏰💰📞🩸🛣️🛤️🎟️📍🏢🎓📅💍💼📰🏫📚🛍️📦👮📱🚗🍽️🏊🚨📞]/g, '').trim()}</span>
                                                <span className="text-sm font-semibold text-gray-800 text-right max-w-[55%]">{meta[field.key]}</span>
                                            </div>
                                        ))}
                                    </div>
                                );
                            })()}

                            {/* Full Description */}
                            {detailItem.description && (
                                <div className="mb-4">
                                    <h4 className="text-sm font-bold text-gray-700 mb-2">📝 বিবরণ</h4>
                                    <div className="bg-gray-50 rounded-2xl p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{detailItem.description}</div>
                                </div>
                            )}

                            {/* Review & Rating System */}
                            <div>
                                <h4 className="text-sm font-bold text-gray-700 mb-2">⭐ রেটিং ও মতামত</h4>

                                {/* Add Review */}
                                <div className="bg-amber-50/50 rounded-2xl p-4 mb-4 border border-amber-100">
                                    <div className="flex items-center gap-1 mb-2">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <button key={star} onClick={() => setUserRating(star)} className={`text-2xl transition-transform ${star <= userRating ? 'text-amber-400 hover:scale-110' : 'text-gray-300 hover:text-amber-200'}`}>★</button>
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

                                {/* Review List */}
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

                        {/* Action Buttons - Fixed at bottom */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white/95 backdrop-blur-md pb-8 flex gap-2">
                            {/* Share Button */}
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

                            {/* WhatsApp Button */}
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

                            {/* Call Button */}
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
