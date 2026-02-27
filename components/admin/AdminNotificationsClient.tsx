'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Division } from '@/types';

interface Props {
    divisions: Division[];
    sentNotifications: Array<{
        id: string;
        title: string;
        message: string;
        type: string;
        created_at: string;
        target: string;
    }>;
}

export default function AdminNotificationsClient({ divisions, sentNotifications }: Props) {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [type, setType] = useState('general');
    const [target, setTarget] = useState('all');
    const [divId, setDivId] = useState('');
    const [distId, setDistId] = useState('');
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
            router.refresh();
        }
        setSending(false);
    }

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
                <span>🔔</span> নোটিফিকেশন পাঠান
            </h1>

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
                        {sentNotifications.slice(0, 20).map(n => (
                            <div key={n.id} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                                <div className="text-lg">
                                    {n.type === 'emergency' ? '🚨' : n.type === 'update' ? '🔄' : n.type === 'promotion' ? '🎁' : '📢'}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-bold text-gray-800">{n.title}</h3>
                                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                                    <p className="text-[10px] text-gray-400 mt-1">{new Date(n.created_at).toLocaleString('bn-BD')}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
