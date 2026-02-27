import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AdminReportsClient from '@/components/admin/AdminReportsClient';

export default async function AdminReportsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/admin');

    const { data: profile } = await supabase.from('profiles').select('role, division_id, district_id').eq('id', user.id).single();
    if (!profile || (profile.role !== 'admin' && profile.role !== 'district_admin')) redirect('/admin');

    const isAdmin = profile.role === 'admin';

    let query = supabase.from('reports')
        .select(`
            *,
            content!inner (id, title, status, district_id, category_id),
            profiles (name, phone)
        `)
        .order('created_at', { ascending: false });

    if (!isAdmin && profile.district_id) {
        query = query.eq('content.district_id', profile.district_id);
    }

    const { data: reports } = await query;

    return <AdminReportsClient reports={reports || []} />;
}
