import { createClient } from '@/lib/supabase/server';
import AdminNoticesClient from '@/components/admin/AdminNoticesClient';
import { Notice } from '@/types';

export default async function NoticesPage() {
    const supabase = await createClient();
    const { data: notices } = await supabase.from('notices').select('*').order('created_at', { ascending: false });
    return <AdminNoticesClient notices={(notices || []) as Notice[]} />;
}
