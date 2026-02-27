import { createClient } from '@/lib/supabase/server';
import AdminAdsClient from '@/components/admin/AdminAdsClient';

export default async function AdminAdsPage() {
    const supabase = await createClient();
    const { data: ads } = await supabase.from('ads').select('*').order('created_at', { ascending: false });

    return <AdminAdsClient ads={ads || []} />;
}
