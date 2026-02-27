import { createClient } from '@/lib/supabase/server';
import AdminBannersClient from '@/components/admin/AdminBannersClient';
import { Banner } from '@/types';

export default async function AdminBannersPage() {
    const supabase = await createClient();
    const { data } = await supabase.from('banners').select('*').order('created_at', { ascending: false });

    return <AdminBannersClient banners={(data || []) as Banner[]} />;
}
