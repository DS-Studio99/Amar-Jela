'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Category, ContentItem } from '@/types';
import { Division } from '@/types';
import { getCategoryConfig, CategoryField } from '@/lib/data/category-fields';

interface Props { categories: Category[]; divisions: Division[]; }

export default function AdminDistrictsClient({ categories, divisions }: Props) {
    const [selDiv, setSelDiv] = useState('');
    const [selDist, setSelDist] = useState('');
    const [selCat, setSelCat] = useState('');
    const [items, setItems] = useState<ContentItem[]>([]);
    const [modal, setModal] = useState(false);
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [editId, setEditId] = useState<string | null>(null);
    const [isEdit, setIsEdit] = useState(false);
    const [isSponsored, setIsSponsored] = useState(false);
    const [sponsoredUntil, setSponsoredUntil] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const supabase = createClient();
    const router = useRouter();

    const districts = divisions.find(d => d.id === selDiv)?.districts || [];
    const selectedCat = categories.find(c => c.id === selCat);
    const catConfig = getCategoryConfig(selectedCat?.name || '');

    function updateField(key: string, value: string) {
        setFormData(prev => ({ ...prev, [key]: value }));
    }

    async function loadItems() {
        if (!selDist || !selCat) return;
        const { data } = await supabase.from('content').select('*').eq('district_id', selDist).eq('category_id', selCat).order('created_at', { ascending: false });
        setItems((data || []) as ContentItem[]);
    }

    function openAdd() {
        setFormData({});
        setEditId(null);
        setIsEdit(false);
        setIsSponsored(false);
        setSponsoredUntil('');
        setModal(true);
        setError('');
    }

    function openEdit(item: ContentItem) {
        const meta = (item.metadata || {}) as Record<string, string>;
        setFormData({
            title: item.title || '',
            phone: item.phone || '',
            address: item.address || '',
            description: item.description || '',
            ...meta,
        });
        setEditId(item.id);
        setIsEdit(true);
        setIsSponsored(!!item.is_sponsored);
        setSponsoredUntil(item.sponsored_until ? item.sponsored_until.split('T')[0] : '');
        setModal(true);
        setError('');
    }

    async function save() {
        const requiredFields = catConfig.fields.filter(f => f.required);
        for (const field of requiredFields) {
            if (!formData[field.key]?.trim()) {
                setError(`${field.label} লিখুন।`);
                return;
            }
        }
        setLoading(true);

        const standardKeys = ['title', 'phone', 'address', 'description'];
        const metadata: Record<string, string> = {};
        catConfig.fields.forEach(f => {
            if (!standardKeys.includes(f.key) && formData[f.key]) {
                metadata[f.key] = formData[f.key];
            }
        });

        if (isEdit && editId) {
            await supabase.from('content').update({
                title: formData.title || '',
                phone: formData.phone || '',
                address: formData.address || '',
                description: formData.description || '',
                is_sponsored: isSponsored,
                sponsored_until: isSponsored && sponsoredUntil ? new Date(sponsoredUntil).toISOString() : null,
                metadata,
                updated_at: new Date().toISOString(),
            }).eq('id', editId);
        } else {
            await supabase.from('content').insert({
                category_id: selCat,
                district_id: selDist,
                division_id: selDiv,
                title: formData.title || '',
                phone: formData.phone || '',
                address: formData.address || '',
                description: formData.description || '',
                is_sponsored: isSponsored,
                sponsored_until: isSponsored && sponsoredUntil ? new Date(sponsoredUntil).toISOString() : null,
                metadata,
                submitted_by_name: 'Admin',
                status: 'approved',
            });
        }
        setLoading(false);
        setModal(false);
        loadItems();
    }

    function renderField(field: CategoryField) {
        const val = formData[field.key] || '';
        const cls = field.highlight
            ? 'w-full px-3 py-2 border-2 border-amber-300 rounded-xl text-sm focus:outline-none focus:border-primary-500 bg-amber-50/50'
            : 'input-field text-sm py-2';

        if (field.type === 'select' && field.options) {
            return (
                <select className={cls} value={val} onChange={e => updateField(field.key, e.target.value)}>
                    <option value="">বেছে নিন</option>
                    {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            );
        }
        if (field.type === 'textarea') {
            return <textarea className={`${cls} resize-none`} rows={3} placeholder={field.placeholder} value={val} onChange={e => updateField(field.key, e.target.value)} />;
        }
        return <input className={cls} type={field.type} placeholder={field.placeholder} value={val} onChange={e => updateField(field.key, e.target.value)} />;
    }

    async function approve(id: string) { await supabase.from('content').update({ status: 'approved', updated_at: new Date().toISOString() }).eq('id', id); loadItems(); }
    async function del(id: string) { if (!confirm('মুছবেন?')) return; await supabase.from('content').delete().eq('id', id); loadItems(); }

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-extrabold text-gray-800">জেলার তথ্য ম্যানেজমেন্ট</h1>

            {/* Filter Card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-3">
                <h2 className="font-bold text-gray-700 text-sm">তথ্য দেখতে বা যোগ করতে নিচে সিলেক্ট করুন</h2>
                <div className="grid md:grid-cols-3 gap-3">
                    <select className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-white outline-none focus:border-primary-500" value={selDiv} onChange={e => { setSelDiv(e.target.value); setSelDist(''); setItems([]); }}>
                        <option value="">বিভাগ বেছে নিন</option>
                        {divisions.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                    <select className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-white outline-none focus:border-primary-500" value={selDist} onChange={e => { setSelDist(e.target.value); setItems([]); }} disabled={!selDiv}>
                        <option value="">জেলা বেছে নিন</option>
                        {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                    <select className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-white outline-none focus:border-primary-500" value={selCat} onChange={e => setSelCat(e.target.value)} disabled={!selDist}>
                        <option value="">ক্যাটাগরি বেছে নিন</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                    </select>
                </div>
                <div className="flex gap-3">
                    <button onClick={loadItems} disabled={!selDiv || !selDist || !selCat} className="btn-primary text-sm px-5 py-2.5">🔍 খুঁজুন</button>
                    {selDist && selCat && <button onClick={openAdd} className="btn-outline text-sm px-5 py-2.5">+ নতুন যোগ করুন</button>}
                </div>
            </div>

            {/* Results */}
            {items.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 font-bold text-gray-800">ফলাফল ({items.length}টি)</div>
                    <table className="w-full">
                        <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wide">
                            <tr><th className="px-4 py-3 text-left">শিরোনাম</th><th className="px-4 py-3 text-left">ফোন</th><th className="px-4 py-3 text-left">স্ট্যাটাস</th><th className="px-4 py-3 text-left">অ্যাকশন</th></tr>
                        </thead>
                        <tbody>
                            {items.map(item => (
                                <tr key={item.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                                    <td className="px-4 py-3 font-semibold text-sm text-gray-800">{item.title}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{item.phone || '—'}</td>
                                    <td className="px-4 py-3">
                                        <span className={item.status === 'approved' ? 'badge-approved' : item.status === 'pending' ? 'badge-pending' : 'badge-rejected'}>
                                            {item.status === 'approved' ? '✅ অনুমোদিত' : item.status === 'pending' ? '⏳ পেন্ডিং' : '❌ প্রত্যাখ্যাত'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-1.5">
                                            <button onClick={() => openEdit(item)} className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-lg font-semibold">✏️</button>
                                            {item.status !== 'approved' && <button onClick={() => approve(item.id)} className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-lg font-semibold">✅</button>}
                                            <button onClick={() => del(item.id)} className="text-xs bg-red-100 text-red-700 px-2.5 py-1 rounded-lg font-semibold">🗑️</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add/Edit Modal - Dynamic Fields */}
            {modal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={e => e.target === e.currentTarget && setModal(false)}>
                    <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col" style={{ maxHeight: '85vh' }}>
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
                            <h3 className="font-bold text-gray-800">{isEdit ? 'তথ্য সম্পাদনা' : `নতুন ${selectedCat?.name || ''} যোগ করুন`}</h3>
                            <button onClick={() => setModal(false)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm hover:bg-red-100 hover:text-red-500">✕</button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-5 space-y-3">
                            {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>}

                            {catConfig.fields.map(field => (
                                <div key={field.key}>
                                    <label className="text-xs font-bold text-gray-700 block mb-1 flex items-center gap-1">
                                        {field.label}
                                        {field.required && <span className="text-red-500">*</span>}
                                        {field.highlight && <span className="text-[9px] text-amber-600 bg-amber-100 px-1 rounded">হাইলাইট</span>}
                                    </label>
                                    {renderField(field)}
                                </div>
                            ))}

                            <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-100 flex flex-col gap-3">
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" id="isSponsored" checked={isSponsored} onChange={e => setIsSponsored(e.target.checked)} className="w-5 h-5 text-amber-600 rounded border-amber-300 focus:ring-amber-500" />
                                    <label htmlFor="isSponsored" className="text-sm font-bold text-amber-900 cursor-pointer">
                                        ⭐ এই আইটেমটিকে স্পনসরড (প্রিমিয়াম) হিসেবে চিহ্নিত করুন
                                    </label>
                                </div>
                                {isSponsored && (
                                    <div className="ml-7 flex items-center gap-3">
                                        <label className="text-xs font-semibold text-amber-800">মেয়াদ (ঐচ্ছিক):</label>
                                        <input
                                            type="date"
                                            className="px-3 py-1.5 border border-amber-200 rounded-lg text-sm bg-white focus:outline-none focus:border-amber-400"
                                            value={sponsoredUntil}
                                            onChange={e => setSponsoredUntil(e.target.value)}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-3 p-5 border-t border-gray-100 flex-shrink-0">
                            <button onClick={() => setModal(false)} className="btn-secondary flex-1 text-sm py-2.5 text-gray-700">বাতিল</button>
                            <button onClick={save} disabled={loading} className="btn-primary flex-[2] text-sm py-2.5">{loading ? '⏳...' : '💾 সংরক্ষণ (অনুমোদিত)'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
