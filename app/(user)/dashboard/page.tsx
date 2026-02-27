import { createClient } from '@/lib/supabase/server';
import { getDistrict } from '@/lib/data/bangladesh';
import { Category, Notice, Banner } from '@/types';
import DashboardClient from '@/components/dashboard/DashboardClient';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (!profile) redirect('/login');

    const districtId = profile.selected_district_id || profile.district_id;
    const district = getDistrict(districtId);

    const [{ data: categories }, { data: notices }, { data: banners }] = await Promise.all([
        supabase.from('categories').select('*').eq('active', true).order('display_order'),
        supabase.from('notices').select('*').eq('active', true).order('created_at', { ascending: false }),
        supabase.from('banners').select('*').eq('active', true).eq('district_id', districtId).order('created_at', { ascending: false }),
    ]);

    return (
        <DashboardClient
            categories={(categories || []) as Category[]}
            notices={(notices || []) as Notice[]}
            banners={(banners || []) as Banner[]}
            district={district || null}
            districtId={districtId}
        />
    );
}
