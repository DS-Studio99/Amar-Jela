import { createClient } from '@/lib/supabase/server';
import AdminDashboardClient from '@/components/admin/AdminDashboardClient';

export default async function AdminDashboardPage() {
    const supabase = await createClient();

    const [
        { count: usersCount },
        { count: catsCount },
        { count: pendingCount },
        { count: approvedCount },
        { count: rejectedCount },
        { data: recentPending },
        { data: notices },
    ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('categories').select('*', { count: 'exact', head: true }).eq('active', true),
        supabase.from('content').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('content').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
        supabase.from('content').select('*', { count: 'exact', head: true }).eq('status', 'rejected'),
        supabase.from('content').select('*,categories(name,icon)').eq('status', 'pending').order('created_at', { ascending: false }).limit(5),
        supabase.from('notices').select('*').eq('active', true).order('created_at', { ascending: false }),
    ]);

    return (
        <AdminDashboardClient
            stats={{ totalUsers: usersCount || 0, totalCategories: catsCount || 0, pending: pendingCount || 0, approved: approvedCount || 0, rejected: rejectedCount || 0, totalContent: (pendingCount || 0) + (approvedCount || 0) + (rejectedCount || 0) }}
            recentPending={recentPending || []}
            notices={notices || []}
        />
    );
}
