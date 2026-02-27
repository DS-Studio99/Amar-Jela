import { createClient } from '@/lib/supabase/server';
import AdminAdsClient from '@/components/admin/AdminAdsClient';

export default async function AdminAdsPage() {
    const supabase = await createClient();
    const [{ data: ads }, { data: categories }] = await Promise.all([
        supabase.from('ads').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('group_name').eq('active', true),
    ]);

    // Extract unique group names
    const groups = [...new Set((categories || []).map(c => c.group_name).filter(Boolean))];

    return <AdminAdsClient ads={ads || []} groups={groups} />;
}
