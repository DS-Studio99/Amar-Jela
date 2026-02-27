import { createClient } from '@/lib/supabase/server';
import NotificationsClient from '@/components/layout/NotificationsClient';
import { redirect } from 'next/navigation';
import { UserNotification } from '@/types';

export default async function NotificationsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { data: notifications } = await supabase.from('user_notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    return <NotificationsClient notifications={(notifications || []) as UserNotification[]} />;
}
