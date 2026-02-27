import { createClient } from '@/lib/supabase/server';
import { getDistrict } from '@/lib/data/bangladesh';
import { redirect } from 'next/navigation';
import SearchClient from './SearchClient';
import { ContentItem } from '@/types';

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function SearchPage({ searchParams }: Props) {
    const params = await searchParams;
    const q = (params?.q as string) || '';
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (!profile) redirect('/login');

    const districtId = profile.selected_district_id || profile.district_id;
    const district = getDistrict(districtId);

    // Fetch matching content logically
    let items = [];
    if (q.trim()) {
        const { data } = await supabase
            .from('content')
            .select('*, categories(name, icon, color)')
            .eq('district_id', districtId)
            .eq('status', 'approved')
            .or(`title.ilike.%${q}%,phone.ilike.%${q}%,address.ilike.%${q}%,description.ilike.%${q}%`)
            .order('is_sponsored', { ascending: false, nullsFirst: false })
            .order('created_at', { ascending: false })
            .limit(50);

        items = data || [];
    }

    // Attach saved status
    const { data: savedData } = await supabase.from('saved_items').select('content_id').eq('user_id', user.id);
    const savedIds = new Set(savedData?.map(s => s.content_id) || []);

    const contentItems = items.map((item: any) => ({
        ...item,
        isSaved: savedIds.has(item.id)
    })) as ContentItem[];

    return (
        <SearchClient
            query={q}
            items={contentItems}
            district={district || null}
            districtId={districtId}
            userId={user.id}
            userName={profile.name}
        />
    );
}
