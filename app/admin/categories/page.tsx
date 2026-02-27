import { createClient } from '@/lib/supabase/server';
import AdminCategoriesClient from '@/components/admin/AdminCategoriesClient';
import { Category } from '@/types';

export default async function CategoriesPage() {
    const supabase = await createClient();
    const { data: categories } = await supabase.from('categories').select('*').order('display_order');
    return <AdminCategoriesClient categories={(categories || []) as Category[]} />;
}
