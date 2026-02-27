import { createClient } from '@/lib/supabase/server';
import { getDistrict } from '@/lib/data/bangladesh';
import { redirect } from 'next/navigation';
import CVClient from './CVClient';

export default async function CVPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (!profile) redirect('/login');

    const dist = getDistrict(profile.district_id);

    return <CVClient profile={profile} dist={dist || null} />;
}
