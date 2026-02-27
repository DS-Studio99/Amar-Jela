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
        supabase.from('content')
            .select('*')
            .eq('category_id', catId)
            .eq('district_id', effectiveDistrictId)
            .eq('status', 'approved')
            // Order sponsored first
            .order('is_sponsored', { ascending: false, nullsFirst: false })
            .order('created_at', { ascending: false }),
        supabase.from('saved_items').select('content_id').eq('user_id', user.id),
    ]);

    const savedIds = new Set(savedItems?.map(s => s.content_id) || []);

    // Process items to respect sponsored_until expiry
    const now = new Date();
    const processedItems = (content || []).map((item: any) => {
        let isSponsored = item.is_sponsored;
        if (isSponsored && item.sponsored_until) {
            const expiry = new Date(item.sponsored_until);
            if (now > expiry) {
                isSponsored = false;
            }
        }
        return {
            ...item,
            is_sponsored: isSponsored,
            isSaved: savedIds.has(item.id)
        } as ContentItem;
    });

    // Re-sort in case some sponsored items expired and need to be moved down
    processedItems.sort((a, b) => {
        if (a.is_sponsored && !b.is_sponsored) return -1;
        if (!a.is_sponsored && b.is_sponsored) return 1;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return (
        <ServiceClient
            category={category as Category}
            items={processedItems}
            district={district || null}
            districtId={effectiveDistrictId}
            userId={user.id}
            userName={profile?.name || ''}
        />
    );
}
