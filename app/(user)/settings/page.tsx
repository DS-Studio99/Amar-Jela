import { createClient } from '@/lib/supabase/server';
import { BD_DIVISIONS, getDistrict } from '@/lib/data/bangladesh';
import { redirect } from 'next/navigation';
import SettingsClient from '@/components/layout/SettingsClient';

export default async function SettingsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();

    const currentDistrict = getDistrict(profile?.selected_district_id || profile?.district_id || '');

    return (
        <SettingsClient
            userId={user.id}
            currentDivisionId={profile?.selected_division_id || profile?.division_id || ''}
            currentDistrictId={profile?.selected_district_id || profile?.district_id || ''}
            currentDistrictName={currentDistrict?.name || ''}
            divisions={BD_DIVISIONS}
        />
    );
}
