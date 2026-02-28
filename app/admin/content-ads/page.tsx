import { createClient } from '@/lib/supabase/server';
import ContentAdsClient from '@/components/admin/ContentAdsClient';

export default async function ContentAdsPage() {
    const supabase = await createClient();

    // Admins bypass RLS
    const { data: ads } = await supabase
        .from('content_ads')
        .select('*')
        .order('created_at', { ascending: false });

    return <ContentAdsClient ads={ads || []} />;
}
