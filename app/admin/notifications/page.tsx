import { createClient } from '@/lib/supabase/server';
import { BD_DIVISIONS } from '@/lib/data/bangladesh';
import AdminNotificationsClient from '@/components/admin/AdminNotificationsClient';

export default async function AdminNotificationsPage() {
    const supabase = await createClient();

    // Get recently sent notifications (distinct by title + message, latest 20)
    const { data: sentRaw } = await supabase
        .from('user_notifications')
        .select('id, title, message, type, created_at')
        .order('created_at', { ascending: false })
        .limit(100);

    // Deduplicate by title+message, keep latest
    const seen = new Set<string>();
    const sentNotifications = (sentRaw || []).filter(n => {
        const key = `${n.title}|${n.message}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    }).slice(0, 20).map(n => ({ ...n, target: 'all' }));

    return (
        <AdminNotificationsClient
            divisions={BD_DIVISIONS}
            sentNotifications={sentNotifications}
        />
    );
}
