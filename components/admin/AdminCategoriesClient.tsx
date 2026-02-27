'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Category } from '@/types';

interface Props { categories: Category[]; }

const DEFAULT_FORM: Partial<Category> = { name: '', icon: '📌', group_name: 'সেবা সমূহ', color: '#1a9e5c', active: true, display_order: 0 };

export default function AdminCategoriesClient({ categories: initialCats }: Props) {
    const [cats, setCats] = useState(initialCats);
    const [modal, setModal] = useState(false);
    const [editing, setEditing] = useState<Partial<Category>>(DEFAULT_FORM);
    const [isEdit, setIsEdit] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const supabase = createClient();
    const router = useRouter();

    function openAdd() { setEditing(DEFAULT_FORM); setIsEdit(false); setModal(true); setError(''); }
    function openEdit(cat: Category) { setEditing(cat); setIsEdit(true); setModal(true); setError(''); }

    async function save() {
        if (!editing.name?.trim() || !editing.icon?.trim()) { setError('নাম এবং আইকন আবশ্যক।'); return; }
        setSaving(true);
        if (isEdit && editing.id) {
            const { error: err } = await supabase.from('categories').update({ name: editing.name, icon: editing.icon, group_name: editing.group_name, color: editing.color, active: editing.active, display_order: editing.display_order }).eq('id', editing.id);
            if (err) { setError(err.message); setSaving(false); return; }
        } else {
            const { error: err } = await supabase.from('categories').insert({ name: editing.name, icon: editing.icon, group_name: editing.group_name, color: editing.color, active: editing.active, display_order: editing.display_order });
            if (err) { setError(err.message); setSaving(false); return; }
        }
        setSaving(false); setModal(false); router.refresh();
    }

    async function toggleActive(cat: Category) {
        await supabase.from('categories').update({ active: !cat.active }).eq('id', cat.id);
        router.refresh();
    }

    async function deleteCat(id: string) {
        if (!confirm('এই ক্যাটাগরি মুছে ফেলবেন?')) return;
        await supabase.from('categories').delete().eq('id', id);
        router.refresh();
    }

    return (
        <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-800">ক্যাটাগরি ম্যানেজমেন্ট</h1>
                    <p className="text-sm text-gray-500">{cats.length}টি ক্যাটাগরি</p>
                </div>
                <button onClick={openAdd} className="btn-primary text-sm px-4 py-2.5">+ নতুন যোগ করুন</button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wide">
                        <tr>
                            <th className="px-4 py-3 text-left">#</th>
                            <th className="px-4 py-3 text-left">আইকন</th>
                            <th className="px-4 py-3 text-left">নাম</th>
                            <th className="px-4 py-3 text-left">গ্রুপ</th>
                            <th className="px-4 py-3 text-left">রঙ</th>
                            <th className="px-4 py-3 text-left">স্ট্যাটাস</th>
                            <th className="px-4 py-3 text-left">অ্যাকশন</th>
                        </tr>
                    </thead>
                    <tbody>
                        {initialCats.map((cat, i) => (
                            <tr key={cat.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                                <td className="px-4 py-3 text-sm text-gray-400">{i + 1}</td>
                                <td className="px-4 py-3 text-2xl">{cat.icon}</td>
                                <td className="px-4 py-3 font-semibold text-sm text-gray-800">{cat.name}</td>
                                <td className="px-4 py-3 text-xs text-gray-500">{cat.group_name}</td>
                                <td className="px-4 py-3"><div className="w-7 h-7 rounded-lg border border-gray-200" style={{ background: cat.color }} /></td>
                                <td className="px-4 py-3">
                                    <button onClick={() => toggleActive(cat)} className={`text-xs px-2.5 py-1 rounded-full font-semibold ${cat.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                        {cat.active ? '✅ সক্রিয়' : '⏸ নিষ্ক্রিয়'}
                                    </button>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-2">
                                        <button onClick={() => openEdit(cat)} className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-lg hover:bg-amber-200 font-semibold">✏️</button>
                                        <button onClick={() => deleteCat(cat.id)} className="text-xs bg-red-100 text-red-700 px-2.5 py-1 rounded-lg hover:bg-red-200 font-semibold">🗑️</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {modal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={e => e.target === e.currentTarget && setModal(false)}>
                    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                            <h3 className="font-bold text-gray-800">{isEdit ? 'ক্যাটাগরি সম্পাদনা' : 'নতুন ক্যাটাগরি'}</h3>
                            <button onClick={() => setModal(false)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-red-100 hover:text-red-500 text-sm">✕</button>
                        </div>
                        <div className="p-5 space-y-3">
                            {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>}
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="text-xs font-bold text-gray-700 block mb-1">নাম *</label><input className="input-field text-sm py-2" value={editing.name || ''} onChange={e => setEditing(p => ({ ...p, name: e.target.value }))} /></div>
                                <div><label className="text-xs font-bold text-gray-700 block mb-1">আইকন * (Emoji)</label><input className="input-field text-sm py-2" value={editing.icon || ''} onChange={e => setEditing(p => ({ ...p, icon: e.target.value }))} /></div>
                            </div>
                            <div><label className="text-xs font-bold text-gray-700 block mb-1">গ্রুপ নাম</label><input className="input-field text-sm py-2" value={editing.group_name || ''} onChange={e => setEditing(p => ({ ...p, group_name: e.target.value }))} /></div>
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="text-xs font-bold text-gray-700 block mb-1">রঙ</label><input type="color" className="input-field h-10 p-1" value={editing.color || '#1a9e5c'} onChange={e => setEditing(p => ({ ...p, color: e.target.value }))} /></div>
                                <div><label className="text-xs font-bold text-gray-700 block mb-1">ক্রম</label><input type="number" className="input-field text-sm py-2" value={editing.display_order || 0} onChange={e => setEditing(p => ({ ...p, display_order: +e.target.value }))} /></div>
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={editing.active ?? true} onChange={e => setEditing(p => ({ ...p, active: e.target.checked }))} className="w-4 h-4 rounded accent-primary-500" />
                                <span className="text-sm font-medium text-gray-700">সক্রিয় ক্যাটাগরি</span>
                            </label>
                            <div className="flex gap-3 pt-1">
                                <button onClick={() => setModal(false)} className="btn-secondary flex-1 text-sm py-2.5 text-gray-700">বাতিল</button>
                                <button onClick={save} disabled={saving} className="btn-primary flex-[2] text-sm py-2.5">{saving ? '⏳...' : '💾 সংরক্ষণ'}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
