import { createClient } from '@/lib/supabase/server';
import { BD_DIVISIONS } from '@/lib/data/bangladesh';
import AdminDistrictsClient from '@/components/admin/AdminDistrictsClient';
import { Category } from '@/types';

export default async function DistrictsPage() {
    const supabase = await createClient();
    const { data: categories } = await supabase.from('categories').select('*').eq('active', true).order('display_order');
    return <AdminDistrictsClient categories={(categories || []) as Category[]} divisions={BD_DIVISIONS} />;
}
