'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Division } from '@/types';

interface Props {
    divisions: Division[];
    sentNotifications: any[];
    bloodRequests: any[];
}

export default function AdminNotificationsClient({ divisions, sentNotifications, bloodRequests }: Props) {
    const [activeTab, setActiveTab] = useState<'create' | 'blood'>('create');
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [type, setType] = useState('general');
    const [target, setTarget] = useState('all');
    const [divId, setDivId] = useState('');
    const [distId, setDistId] = useState('');

    // Advanced Popup Fields
    const [showAsPopup, setShowAsPopup] = useState(false);
    const [viewDurationSeconds, setViewDurationSeconds] = useState(5);
    const [isCancellable, setIsCancellable] = useState(true);

    const [sending, setSending] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    const districts = divisions.find(d => d.id === divId)?.districts || [];

    async function sendNotification() {
        if (!title.trim() || !message.trim()) { alert('শিরোনাম এবং বার্তা লিখুন'); return; }

        setSending(true);

        // Determine target users
        let query = supabase.from('profiles').select('id');

        if (target === 'division' && divId) {
            query = query.eq('division_id', divId);
        } else if (target === 'district' && distId) {
            query = query.eq('district_id', distId);
        }

        const { data: users } = await query;

        if (!users || users.length === 0) {
            alert('কোনো ব্যবহারকারী পাওয়া যায়নি।');
            setSending(false);
            return;
        }

        const notifications = users.map(u => ({
            user_id: u.id,
            title: title.trim(),
            message: message.trim(),
            type,
            show_as_popup: showAsPopup,
            view_duration_seconds: viewDurationSeconds,
            is_cancellable: isCancellable,
            district_target: target === 'district' ? distId : null,
            division_target: target === 'division' ? divId : null,
        }));

        const { error } = await supabase.from('user_notifications').insert(notifications);

        if (error) {
            alert('ত্রুটি: ' + error.message);
        } else {
            alert(`✅ ${users.length} জন ব্যবহারকারীকে নোটিফিকেশন পাঠানো হয়েছে!`);
            setTitle('');
            setMessage('');
            setType('general');
            setTarget('all');
            setShowAsPopup(false);
            router.refresh();
        }
        setSending(false);
    }

    async function approveBloodRequest(req: any) {
        setTitle('🆘 জরুরি রক্তের প্রয়োজন!');
        setMessage(`রক্তের গ্রুপ: ${req.blood_group}\nরোগী আছে: ${req.hospital}\nযোগাযোগ: ${req.phone}\nপ্রয়োজনকারী: ${req.profiles?.name || 'অজ্ঞাত'}`);
        setType('emergency');
        setTarget('district');

        let foundDiv = '';
        divisions.forEach(div => {
            if (div.districts.some(d => d.id === req.district_id)) foundDiv = div.id;
        });

        setDivId(foundDiv);
        setDistId(req.district_id);
        setShowAsPopup(true);
        setViewDurationSeconds(10);
        setIsCancellable(false);

        setActiveTab('create');

        await supabase.from('blood_requests').update({ status: 'approved' }).eq('id', req.id);
        router.refresh();
    }

    async function rejectBloodRequest(id: string) {
        if (!confirm('এই অনুরোধটি বাতিল করতে চান?')) return;
        await supabase.from('blood_requests').update({ status: 'rejected' }).eq('id', id);
        router.refresh();
    }

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
                <span>🔔</span> নোটিফিকেশন ও অ্যালার্ট
            </h1>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200 pb-px">
                <button
                    onClick={() => setActiveTab('create')}
                    className={`px-5 py-2.5 text-sm font-bold border-b-2 transition-colors ${activeTab === 'create' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                    নোটিফিকেশন পাঠান
                </button>
                <button
                    onClick={() => setActiveTab('blood')}
                    className={`px-5 py-2.5 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'blood' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                    রক্তের অনুরোধ
                    {bloodRequests.length > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{bloodRequests.length}</span>}
                </button>
            </div>

            {activeTab === 'create' && (
                <div className="space-y-6">
                    {/* Send Form */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
                        <h2 className="text-base font-bold text-gray-700">নতুন নোটিফিকেশন</h2>

                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">শিরোনাম <span className="text-red-500">*</span></label>
                            <input
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 bg-white"
                                placeholder="নোটিফিকেশনের শিরোনাম"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">বার্তা <span className="text-red-500">*</span></label>
                            <textarea
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 bg-white resize-none"
                                rows={3}
                                placeholder="বিস্তারিত বার্তা লিখুন..."
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">ধরন</label>
                                <select className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-primary-500" value={type} onChange={e => setType(e.target.value)}>
                                    <option value="general">📢 সাধারণ</option>
                                    <option value="emergency">🚨 জরুরি</option>
                                    <option value="update">🔄 আপডেট</option>
                                    <option value="promotion">🎁 প্রমোশন</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">প্রাপক</label>
                                <select className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-primary-500" value={target} onChange={e => { setTarget(e.target.value); setDivId(''); setDistId(''); }}>
                                    <option value="all">🌐 সকল ব্যবহারকারী</option>
                                    <option value="division">📍 নির্দিষ্ট বিভাগ</option>
                                    <option value="district">📍 নির্দিষ্ট জেলা</option>
                                </select>
                            </div>
                        </div>

                        {target === 'division' && (
                            <div>
                                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">বিভাগ নির্বাচন</label>
                                <select className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-primary-500" value={divId} onChange={e => setDivId(e.target.value)}>
                                    <option value="">বিভাগ বেছে নিন</option>
                                    {divisions.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                </select>
                            </div>
                        )}

                        {target === 'district' && (
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">বিভাগ</label>
                                    <select className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-primary-500" value={divId} onChange={e => { setDivId(e.target.value); setDistId(''); }}>
                                        <option value="">বিভাগ বেছে নিন</option>
                                        {divisions.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">জেলা</label>
                                    <select className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-primary-500" value={distId} onChange={e => setDistId(e.target.value)}>
                                        <option value="">জেলা বেছে নিন</option>
                                        {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* Advanced Popup Options */}
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="showAsPopup" checked={showAsPopup} onChange={e => setShowAsPopup(e.target.checked)} className="w-4 h-4 text-primary-600 rounded" />
                                <label htmlFor="showAsPopup" className="text-sm font-bold text-gray-800 cursor-pointer">পপ-আপ অ্যালার্ট হিসেবে দেখান (ইউজার অ্যাপ খুললেই স্ক্রিনে ভাসবে)</label>
                            </div>

                            {showAsPopup && (
                                <div className="pl-6 grid grid-cols-2 gap-4 mt-2">
                                    <div>
                                        <label className="text-xs font-semibold text-gray-600 mb-1 block">কতক্ষণ স্ক্রিনে থাকবে (সেকেন্ড)</label>
                                        <input type="number" min="1" max="60" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" value={viewDurationSeconds} onChange={e => setViewDurationSeconds(parseInt(e.target.value) || 5)} />
                                    </div>
                                    <div className="flex items-end pb-2">
                                        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                            <input type="checkbox" checked={isCancellable} onChange={e => setIsCancellable(e.target.checked)} className="rounded" />
                                            ইউজার কেটে দিতে পারবে (Cancellable)
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={sendNotification}
                            disabled={sending}
                            className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-extrabold py-3 rounded-xl shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {sending ? '⏳ পাঠানো হচ্ছে...' : '🚀 নোটিফিকেশন পাঠান'}
                        </button>
                    </div>

                    {/* Sent Notifications History */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                        <h2 className="text-base font-bold text-gray-700 mb-3">সাম্প্রতিক নোটিফিকেশন</h2>
                        {sentNotifications.length === 0 ? (
                            <p className="text-center text-gray-400 py-8 text-sm">কোনো নোটিফিকেশন পাঠানো হয়নি।</p>
                        ) : (
                            <div className="space-y-2">
                                {sentNotifications.map(n => (
                                    <div key={n.id} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                                        <div className="text-lg">
                                            {n.type === 'emergency' ? '🚨' : n.type === 'update' ? '🔄' : n.type === 'promotion' ? '🎁' : '📢'}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-sm font-bold text-gray-800">{n.title}</h3>
                                            <p className="text-xs text-gray-500 mt-0.5 whitespace-pre-line">{n.message}</p>
                                            <p className="text-[10px] text-gray-400 mt-1">{new Date(n.created_at).toLocaleString('bn-BD')}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'blood' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <h2 className="text-base font-bold text-gray-700 mb-3">সাম্প্রতিক রক্তের অনুরোধ (পেন্ডিং)</h2>

                    {bloodRequests.length === 0 ? (
                        <p className="text-center text-gray-400 py-12 text-sm bg-gray-50 rounded-xl border border-dashed border-gray-200">কোনো নতুন রক্তের অনুরোধ নেই।</p>
                    ) : (
                        <div className="space-y-3">
                            {bloodRequests.map(req => (
                                <div key={req.id} className="border border-red-100 bg-red-50/30 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-start md:items-center">
                                    <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-2xl font-extrabold flex-shrink-0 border-2 border-white shadow-sm">
                                        {req.blood_group}
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-800 text-sm">রোগী আছেন: <span className="text-red-600">{req.hospital}</span></h3>
                                        <p className="text-xs font-semibold text-gray-600 mt-0.5">যোগাযোগ: {req.phone}</p>
                                        <p className="text-[11px] text-gray-500 mt-1">প্রয়োজনকারী: {req.profiles?.name || 'অজ্ঞাত'} • {new Date(req.created_at).toLocaleString('bn-BD')}</p>
                                    </div>

                                    <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
                                        <button onClick={() => approveBloodRequest(req)} className="flex-1 md:flex-none bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm">
                                            অনুমোদন করুন (পপ-আপ তৈরি)
                                        </button>
                                        <button onClick={() => rejectBloodRequest(req.id)} className="px-3 py-2 bg-gray-200 hover:bg-red-100 hover:text-red-700 text-gray-600 rounded-lg text-xs font-bold transition-colors">
                                            বাতিল
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
