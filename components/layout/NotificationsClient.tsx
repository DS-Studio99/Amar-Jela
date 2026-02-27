'use client';

import { useState, useEffect } from 'react';
import { UserNotification } from '@/types';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Props { notifications: UserNotification[]; }

export default function NotificationsClient({ notifications: initial }: Props) {
    const [notifications, setNotifications] = useState(initial);
    const supabase = createClient();
    const router = useRouter();

    // Sort: unread first, then by date
    const sorted = [...notifications].sort((a, b) => {
        if (a.is_read !== b.is_read) return a.is_read ? 1 : -1;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    const unreadCount = notifications.filter(n => !n.is_read).length;

    async function markAsRead(id: string) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        await supabase.from('user_notifications').update({ is_read: true }).eq('id', id);
        router.refresh();
    }

    async function markAllAsRead() {
        const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
        if (unreadIds.length === 0) return;
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        await supabase.from('user_notifications').update({ is_read: true }).in('id', unreadIds);
        router.refresh();
    }

    const typeConfig: Record<string, { icon: string; gradient: string; border: string }> = {
        emergency: { icon: '🆘', gradient: 'from-red-500 to-red-600', border: 'border-red-200' },
        approval: { icon: '✅', gradient: 'from-green-500 to-emerald-600', border: 'border-green-200' },
        rejection: { icon: '❌', gradient: 'from-orange-500 to-red-500', border: 'border-orange-200' },
        info: { icon: '💡', gradient: 'from-blue-500 to-indigo-600', border: 'border-blue-200' },
        default: { icon: '🔔', gradient: 'from-primary-500 to-primary-600', border: 'border-primary-200' },
    };

    function getTypeStyle(type: string) {
        return typeConfig[type] || typeConfig.default;
    }

    if (notifications.length === 0) {
        return (
            <div className="p-4 text-center py-20 text-gray-400">
                <div className="text-6xl mb-4 opacity-30">🔔</div>
                <p className="font-bold text-gray-500 text-base">কোনো নোটিফিকেশন নেই</p>
                <p className="text-sm mt-1.5">তথ্য অনুমোদিত বা প্রত্যাখ্যাত হলে এখানে দেখাবে।</p>
            </div>
        );
    }

    return (
        <div className="p-4 space-y-4 pb-20">
            {/* Header with actions */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-extrabold text-gray-800 flex items-center gap-2">
                        🔔 নোটিফিকেশন
                    </h1>
                    {unreadCount > 0 && (
                        <p className="text-[11px] text-primary-600 font-semibold mt-0.5">{unreadCount}টি অপঠিত</p>
                    )}
                </div>
                {unreadCount > 0 && (
                    <button onClick={markAllAsRead} className="text-[11px] font-bold text-primary-600 hover:text-primary-800 bg-primary-50 px-3 py-1.5 rounded-lg transition-colors active:scale-95">
                        ✓ সব পড়া হয়েছে
                    </button>
                )}
            </div>

            {/* Notification Cards */}
            <div className="space-y-3">
                {sorted.map(n => {
                    const style = getTypeStyle(n.type);
                    return (
                        <div
                            key={n.id}
                            onClick={() => !n.is_read && markAsRead(n.id)}
                            className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${n.is_read
                                    ? 'bg-white border border-gray-100 opacity-70'
                                    : `bg-white border-2 ${style.border} shadow-md cursor-pointer hover:shadow-lg hover:-translate-y-0.5`
                                }`}
                        >
                            {/* Unread indicator strip */}
                            {!n.is_read && (
                                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${style.gradient}`} />
                            )}

                            <div className="p-4 pt-3">
                                <div className="flex items-start gap-3">
                                    {/* Type Icon */}
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${n.is_read ? 'bg-gray-100' : `bg-gradient-to-br ${style.gradient} text-white shadow-sm`
                                        }`}>
                                        {n.is_read ? '📭' : style.icon}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <h3 className={`text-sm leading-snug ${n.is_read ? 'font-semibold text-gray-600' : 'font-extrabold text-gray-900'}`}>
                                                {n.title}
                                            </h3>
                                            <span className="text-[9px] text-gray-400 whitespace-nowrap font-medium flex-shrink-0 mt-0.5">
                                                {new Date(n.created_at).toLocaleDateString('bn-BD')}
                                            </span>
                                        </div>
                                        <p className={`text-xs leading-relaxed mt-1 ${n.is_read ? 'text-gray-400' : 'text-gray-600'}`}>
                                            {n.message}
                                        </p>

                                        {/* Action link */}
                                        {n.action_link && (
                                            <Link
                                                href={n.action_link}
                                                className="inline-flex items-center gap-1 mt-2.5 text-[11px] font-bold text-primary-600 hover:text-primary-700 bg-primary-50 border border-primary-100 px-3 py-1.5 rounded-lg transition-all hover:scale-105 active:scale-95"
                                            >
                                                🔗 বিস্তারিত দেখুন
                                            </Link>
                                        )}

                                        {/* Unread badge */}
                                        {!n.is_read && (
                                            <div className="flex items-center gap-1 mt-2">
                                                <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse" />
                                                <span className="text-[9px] text-primary-500 font-bold">অপঠিত — ক্লিক করে পড়ুন</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
