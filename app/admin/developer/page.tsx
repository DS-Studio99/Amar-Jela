import { createClient } from '@/lib/supabase/server';
import AdminDeveloperClient from '@/components/admin/AdminDeveloperClient';

export default async function AdminDeveloperPage() {
    const supabase = await createClient();
    const { data } = await supabase.from('app_settings').select('value').eq('key', 'developer_info').single();

    return <AdminDeveloperClient initial={data?.value || {
        name: '', title: '', bio: '', email: '', phone: '',
        website: '', facebook: '', github: '', linkedin: '',
        avatar_url: '', skills: [],
    }} />;
}
