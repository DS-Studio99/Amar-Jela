'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Profile } from '@/types';
import { Division } from '@/types';
import { useState } from 'react';

interface Props { users: Profile[]; divisions: Division[]; }

export default function AdminUsersClient({ users, divisions }: Props) {
    const [detail, setDetail] = useState<Profile | null>(null);
    const router = useRouter();
    const supabase = createClient();

    function getDistrictName(divId: string, distId: string) {
        const div = divisions.find(d => d.id === divId);
        return div?.districts.find(d => d.id === distId)?.name || distId;
    }

    async function makeAdmin(id: string) {
        if (!confirm('এই ব্যবহারকারীকে সুপার অ্যাডমিন করবেন?')) return;
        await supabase.from('profiles').update({ role: 'admin' }).eq('id', id);
        router.refresh();
    }

    async function makeDistrictAdmin(id: string) {
        if (!confirm('এই ব্যবহারকারীকে জেলা অ্যাডমিন করবেন?')) return;
        await supabase.from('profiles').update({ role: 'district_admin' }).eq('id', id);
        router.refresh();
    }

    async function removeAdmin(id: string) {
        if (!confirm('এই ব্যবহারকারীকে সাধারণ ইউজার করবেন?')) return;
        await supabase.from('profiles').update({ role: 'user' }).eq('id', id);
        router.refresh();
    }

    async function deleteUser(id: string) {
        if (!confirm('মুছে ফেলবেন?')) return;
        await supabase.from('profiles').delete().eq('id', id);
        setDetail(null); router.refresh();
    }

    return (
        <div className="p-6 space-y-4">
            <div>
                <h1 className="text-2xl font-extrabold text-gray-800">ব্যবহারকারী ম্যানেজমেন্ট</h1>
                <p className="text-sm text-gray-500">{users.length}জন নিবন্ধিত</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
                <table className="w-full min-w-[500px]">
                    <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wide">
                        <tr>
                            <th className="px-4 py-3 text-left">#</th>
                            <th className="px-4 py-3 text-left">নাম</th>
                            <th className="px-4 py-3 text-left">ফোন</th>
                            <th className="px-4 py-3 text-left">জেলা</th>
                            <th className="px-4 py-3 text-left">ভূমিকা</th>
                            <th className="px-4 py-3 text-left">অ্যাকশন</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr><td colSpan={6} className="text-center py-12 text-gray-400">কোনো ব্যবহারকারী নেই।</td></tr>
                        ) : users.map((u, i) => (
                            <tr key={u.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                                <td className="px-4 py-3 text-sm text-gray-400">{i + 1}</td>
                                <td className="px-4 py-3 font-semibold text-sm text-gray-800">👤 {u.name}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{u.phone}</td>
                                <td className="px-4 py-3 text-xs text-gray-500">{getDistrictName(u.division_id, u.district_id)}</td>
                                <td className="px-4 py-3">
                                    <span className={u.role === 'admin' ? 'bg-purple-100 text-purple-700 px-2 py-0.5 rounded-md text-xs font-bold' : u.role === 'district_admin' ? 'bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md text-xs font-bold' : 'bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md text-xs font-bold'}>
                                        {u.role === 'admin' ? '🛡️ Super Admin' : u.role === 'district_admin' ? '📍 District Admin' : '👤 User'}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-1.5 flex-wrap">
                                        <button onClick={() => setDetail(u)} className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg hover:bg-gray-200 font-semibold" title="ব্যাবহারকারীর বিস্তারিত">👁️</button>

                                        {u.role !== 'admin' && (
                                            <button onClick={() => makeAdmin(u.id)} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-lg hover:bg-purple-200 font-semibold focus:outline-none" title="সুপার অ্যাডমিন বানান">🛡️ S.A.</button>
                                        )}
                                        {u.role !== 'district_admin' && (
                                            <button onClick={() => makeDistrictAdmin(u.id)} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-lg hover:bg-blue-200 font-semibold focus:outline-none" title="জেলা অ্যাডমিন বানান">📍 D.A.</button>
                                        )}
                                        {u.role !== 'user' && (
                                            <button onClick={() => removeAdmin(u.id)} className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-lg hover:bg-gray-300 font-semibold focus:outline-none" title="সাধারণ ইউজার বানান">👤 User</button>
                                        )}
                                        <button onClick={() => deleteUser(u.id)} className="text-xs bg-red-100 text-red-700 px-2.5 py-1 rounded-lg hover:bg-red-200 font-semibold" title="মুছে ফেলুন">🗑️</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Detail Modal */}
            {detail && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={e => e.target === e.currentTarget && setDetail(null)}>
                    <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
                        <div className="bg-gradient-to-br from-primary-600 to-primary-800 p-6 text-center text-white">
                            <div className="text-4xl mb-2">👤</div>
                            <div className="font-extrabold text-xl">{detail.name}</div>
                            <div className="text-white/70 text-sm">{detail.phone}</div>
                        </div>
                        <div className="p-5 space-y-2">
                            {[['ইমেইল', detail.email || '—'], ['বিভাগ', detail.division_id], ['জেলা', getDistrictName(detail.division_id, detail.district_id)], ['থানা', detail.thana || '—'], ['গ্রাম', detail.village || '—'], ['ভূমিকা', detail.role], ['নিবন্ধন', new Date(detail.created_at).toLocaleDateString('bn-BD')]].map(([k, v]) => (
                                <div key={k} className="flex justify-between text-sm border-b border-gray-50 pb-1.5">
                                    <span className="text-gray-500">{k}</span>
                                    <span className="font-semibold text-gray-800">{v}</span>
                                </div>
                            ))}
                            <button onClick={() => { setDetail(null); }} className="btn-secondary w-full mt-3 text-sm py-2.5 text-gray-700">বন্ধ করুন</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
