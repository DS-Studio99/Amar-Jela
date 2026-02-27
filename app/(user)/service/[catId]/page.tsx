import { createClient } from '@/lib/supabase/server';
import { getDistrict } from '@/lib/data/bangladesh';
import { Category, ContentItem } from '@/types';
import ServiceClient from '@/components/dashboard/ServiceClient';
import { redirect } from 'next/navigation';

export default async function ServicePage({
    params,
    searchParams,
}: {
    params: Promise<{ catId: string }>;
    searchParams: Promise<{ district?: string }>;
}) {
    const { catId } = await params;
    const { district: districtId } = await searchParams;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    const effectiveDistrictId = districtId || profile?.selected_district_id || profile?.district_id || '';
    const district = getDistrict(effectiveDistrictId);

    const [{ data: category }, { data: content }, { data: savedItems }] = await Promise.all([
        supabase.from('categories').select('*').eq('id', catId).single(),
        supabase.from('content').select('*').eq('category_id', catId).eq('district_id', effectiveDistrictId).eq('status', 'approved').order('is_sponsored', { ascending: false, nullsFirst: false }).order('created_at', { ascending: false }),
        supabase.from('saved_items').select('content_id').eq('user_id', user.id),
    ]);

    const savedIds = new Set(savedItems?.map(s => s.content_id) || []);
    const itemsWithSavedState = (content || []).map(item => ({
        ...item,
        isSaved: savedIds.has(item.id)
    })) as ContentItem[];

    return (
        <ServiceClient
            category={category as Category}
            items={(content || []) as ContentItem[]}
            district={district || null}
            districtId={effectiveDistrictId}
            userId={user.id}
            userName={profile?.name || ''}
        />
    );
}
