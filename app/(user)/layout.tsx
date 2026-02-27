import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import BottomNav from '@/components/layout/BottomNav';
import UserHeader from '@/components/layout/UserHeader';
import LoadingScreen from '@/components/layout/LoadingScreen';

export default async function UserLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();

    // Get unread notification count
    const { count: unreadCount } = await supabase
        .from('user_notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

    return (
        <div className="app-container">
            <LoadingScreen />
            <UserHeader profile={profile} unreadCount={unreadCount || 0} />
            <main className="pb-20">
                {children}
            </main>
            <BottomNav />
        </div>
    );
}
