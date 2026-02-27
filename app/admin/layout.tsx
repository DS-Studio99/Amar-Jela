import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AdminSidebarClient from '@/components/admin/AdminSidebarClient';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/admin');

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') redirect('/admin');

    return (
        <div className="flex h-screen overflow-hidden bg-gray-100">
            <AdminSidebarClient />
            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}
