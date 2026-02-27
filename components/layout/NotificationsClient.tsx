'use client';

import { useState } from 'react';
import { UserNotification } from '@/types';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Props { notifications: UserNotification[]; }

export default function NotificationsClient({ notifications: initial }: Props) {
    const [notifications, setNotifications] = useState(initial);
    const supabase = createClient();
    const router = useRouter();

    async function markAsRead(id: string) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        await supabase.from('user_notifications').update({ is_read: true }).eq('id', id);
        router.refresh(); // Tell Next.js to update the server component payload
    }

    async function markAllAsRead() {
        const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
        if (unreadIds.length === 0) return;
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        await supabase.from('user_notifications').update({ is_read: true }).in('id', unreadIds);
        router.refresh();
    }

    if (notifications.length === 0) {
        return (
            <div className="p-4 text-center py-16 text-gray-400">
                <div className="text-5xl mb-3 mt-10">🔔</div>
                <p className="font-semibold text-gray-600">কোনো নোটিফিকেশন নেই</p>
                <p className="text-sm mt-1">তথ্য অনুমোদিত বা প্রত্যাখ্যাত হলে এখানে দেখাবে।</p>
            </div>
        );
    }

    return (
        <div className="p-4 space-y-4 pb-24">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-extrabold text-gray-800 flex items-center gap-2">
                    <span className="text-2xl">🔔</span> নোটিফিকেশন
                </h1>
                {notifications.some(n => !n.is_read) && (
                    <button onClick={markAllAsRead} className="text-[11px] font-bold text-primary-600 hover:text-primary-800 bg-primary-50 px-3 py-1.5 rounded-lg transition-colors">
                        সবগুলো পড়া হয়েছে
                    </button>
                )}
            </div>

            <div className="space-y-3">
                {notifications.map(n => (
                    <div
                        key={n.id}
                        onClick={() => !n.is_read && markAsRead(n.id)}
                        className={`p-4 rounded-2xl border transition-all ${n.is_read ? 'bg-white border-gray-100 opacity-75' : 'bg-primary-50/40 border-primary-200 cursor-pointer shadow-sm relative overflow-hidden'}`}
                    >
                        {!n.is_read && <div className="absolute top-0 left-0 w-1.5 h-full bg-primary-500"></div>}

                        <div className="flex items-start justify-between mb-1.5">
                            <h3 className={`text-sm leading-snug ${n.is_read ? 'font-semibold text-gray-700' : 'font-extrabold text-gray-900'}`}>
                                {n.title}
                            </h3>
                            <span className="text-[10px] text-gray-400 whitespace-nowrap ml-3 font-medium">
                                {new Date(n.created_at).toLocaleDateString('bn-BD')}
                            </span>
                        </div>
                        <p className={`text-xs leading-relaxed ${n.is_read ? 'text-gray-500' : 'text-gray-700'}`}>{n.message}</p>

                        {n.action_link && (
                            <Link href={n.action_link} className="inline-flex items-center gap-1 mt-3 text-[11px] font-bold text-primary-600 hover:text-primary-700 bg-white border border-primary-100 px-3 py-1.5 rounded-lg shadow-sm transition-transform hover:scale-105">
                                🔗 বিস্তারিত দেখুন
                            </Link>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
