import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

interface DeveloperInfo {
    name: string;
    title: string;
    bio: string;
    email: string;
    phone: string;
    website: string;
    facebook: string;
    github: string;
    linkedin: string;
    avatar_url: string;
    skills: string[];
}

export default async function AboutDeveloperPage() {
    const supabase = await createClient();
    const { data } = await supabase.from('app_settings').select('value').eq('key', 'developer_info').single();
    const dev: DeveloperInfo = data?.value || { name: 'ডেভেলপার', title: '', bio: '', email: '', phone: '', website: '', facebook: '', github: '', linkedin: '', avatar_url: '', skills: [] };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Fixed Header */}
            <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100" style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
                <div className="max-w-[480px] mx-auto px-3 py-2.5 flex items-center gap-3">
                    <Link href="/dashboard" className="text-gray-400 hover:text-gray-600 transition-colors text-sm">←</Link>
                    <h1 className="text-sm font-bold text-gray-700">👨‍💻 ডেভেলপার সম্পর্কে</h1>
                </div>
            </div>

            <div className="max-w-[480px] mx-auto">
                {/* Hero Section */}
                <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white px-6 py-10 text-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                    <div className="relative z-10">
                        {dev.avatar_url ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={dev.avatar_url} alt={dev.name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white/30 shadow-xl object-cover" />
                        ) : (
                            <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-white/20 flex items-center justify-center text-4xl border-4 border-white/30 shadow-xl">👨‍💻</div>
                        )}
                        <h2 className="text-2xl font-extrabold">{dev.name}</h2>
                        {dev.title && <p className="text-primary-100 text-sm font-medium mt-1">{dev.title}</p>}
                    </div>
                </div>

                <div className="p-4 space-y-4 pb-24">
                    {/* Bio */}
                    {dev.bio && (
                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                            <h3 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-1.5">📝 পরিচিতি</h3>
                            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{dev.bio}</p>
                        </div>
                    )}

                    {/* Skills */}
                    {dev.skills && dev.skills.length > 0 && (
                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-1.5">🛠️ দক্ষতা</h3>
                            <div className="flex flex-wrap gap-2">
                                {dev.skills.map((skill, i) => (
                                    <span key={i} className="bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 px-3 py-1.5 rounded-xl text-xs font-bold border border-primary-200/50 shadow-sm">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Contact & Social */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-3">
                        <h3 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-1.5">📞 যোগাযোগ</h3>
                        {dev.email && (
                            <a href={`mailto:${dev.email}`} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-primary-50 transition-colors group">
                                <span className="text-xl">📧</span>
                                <div className="flex-1 min-w-0">
                                    <div className="text-[10px] text-gray-400 font-semibold">ইমেইল</div>
                                    <div className="text-sm font-bold text-gray-800 group-hover:text-primary-600 truncate">{dev.email}</div>
                                </div>
                                <span className="text-gray-300 text-sm">→</span>
                            </a>
                        )}
                        {dev.phone && (
                            <a href={`tel:${dev.phone}`} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-primary-50 transition-colors group">
                                <span className="text-xl">📱</span>
                                <div className="flex-1 min-w-0">
                                    <div className="text-[10px] text-gray-400 font-semibold">ফোন</div>
                                    <div className="text-sm font-bold text-gray-800 group-hover:text-primary-600">{dev.phone}</div>
                                </div>
                                <span className="text-gray-300 text-sm">→</span>
                            </a>
                        )}
                        {dev.website && (
                            <a href={dev.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-primary-50 transition-colors group">
                                <span className="text-xl">🌐</span>
                                <div className="flex-1 min-w-0">
                                    <div className="text-[10px] text-gray-400 font-semibold">ওয়েবসাইট</div>
                                    <div className="text-sm font-bold text-gray-800 group-hover:text-primary-600 truncate">{dev.website}</div>
                                </div>
                                <span className="text-gray-300 text-sm">→</span>
                            </a>
                        )}
                        {dev.facebook && (
                            <a href={dev.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors group">
                                <span className="text-xl">📘</span>
                                <div className="flex-1 min-w-0">
                                    <div className="text-[10px] text-blue-400 font-semibold">Facebook</div>
                                    <div className="text-sm font-bold text-blue-700 truncate">{dev.facebook}</div>
                                </div>
                                <span className="text-blue-300 text-sm">→</span>
                            </a>
                        )}
                        {dev.linkedin && (
                            <a href={dev.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors group">
                                <span className="text-xl">💼</span>
                                <div className="flex-1 min-w-0">
                                    <div className="text-[10px] text-blue-400 font-semibold">LinkedIn</div>
                                    <div className="text-sm font-bold text-blue-700 truncate">{dev.linkedin}</div>
                                </div>
                                <span className="text-blue-300 text-sm">→</span>
                            </a>
                        )}
                    </div>

                    {/* App Credit */}
                    <div className="text-center py-4">
                        <p className="text-[10px] text-gray-400 font-semibold">আমার জেলা অ্যাপ দ্বারা চালিত</p>
                        <p className="text-xs text-gray-500 font-bold mt-0.5">❤️ বাংলাদেশের জন্য তৈরি</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
