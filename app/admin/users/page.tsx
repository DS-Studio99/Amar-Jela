import { createClient } from '@/lib/supabase/server';
import AdminUsersClient from '@/components/admin/AdminUsersClient';
import { Profile } from '@/types';
import { BD_DIVISIONS } from '@/lib/data/bangladesh';

export default async function UsersPage() {
    const supabase = await createClient();
    const { data: profiles } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    return <AdminUsersClient users={(profiles || []) as Profile[]} divisions={BD_DIVISIONS} />;
}
