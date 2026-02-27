import { createClient } from '@/lib/supabase/server';
import { BD_DIVISIONS } from '@/lib/data/bangladesh';
import AdminContentClient from '@/components/admin/AdminContentClient';
import { Category, ContentItem } from '@/types';

export default async function ContentPage() {
    const supabase = await createClient();
    const [{ data: content }, { data: categories }] = await Promise.all([
        supabase.from('content').select('*,categories(name,icon,color)').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').eq('active', true),
    ]);
    return (
        <AdminContentClient
            content={(content || []) as (ContentItem & { categories: { name: string; icon: string; color: string } | null })[]}
            categories={(categories || []) as Category[]}
            divisions={BD_DIVISIONS}
        />
    );
}
