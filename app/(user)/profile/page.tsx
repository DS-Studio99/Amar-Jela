import { createClient } from '@/lib/supabase/server';
import { getDistrict } from '@/lib/data/bangladesh';
import { redirect } from 'next/navigation';
import ProfileClient from '@/components/layout/ProfileClient';

export default async function ProfilePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const [{ data: profile }, { data: submissions }, { data: savedItems }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('content').select('*,categories(name,icon)').eq('submitted_by', user.id).order('created_at', { ascending: false }),
        supabase.from('saved_items').select('id, content:content_id(*, categories(name, icon))').eq('user_id', user.id).order('created_at', { ascending: false }),
    ]);

    const dist = getDistrict(profile?.selected_district_id || profile?.district_id || '');

    // Flatten the joined content for the UI
    const flattenedSavedItems = (savedItems || []).map(item => Array.isArray(item.content) ? item.content[0] : item.content) as any[];

    return <ProfileClient profile={profile} dist={dist || null} submissions={submissions || []} savedItems={flattenedSavedItems} userId={user.id} />;
}
