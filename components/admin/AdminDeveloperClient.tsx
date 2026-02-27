'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

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

interface Props {
    initial: DeveloperInfo;
}

const DEFAULT_INFO: DeveloperInfo = {
    name: '', title: '', bio: '', email: '', phone: '',
    website: '', facebook: '', github: '', linkedin: '',
    avatar_url: '', skills: [],
};

export default function AdminDeveloperClient({ initial }: Props) {
    const [info, setInfo] = useState<DeveloperInfo>(initial || DEFAULT_INFO);
    const [skillInput, setSkillInput] = useState('');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    function update(key: keyof DeveloperInfo, value: string) {
        setInfo(prev => ({ ...prev, [key]: value }));
    }

    function addSkill() {
        if (!skillInput.trim()) return;
        setInfo(prev => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }));
        setSkillInput('');
    }

    function removeSkill(idx: number) {
        setInfo(prev => ({ ...prev, skills: prev.skills.filter((_, i) => i !== idx) }));
    }

    async function save() {
        setSaving(true);
        await supabase.from('app_settings').upsert({
            key: 'developer_info',
            value: info,
            updated_at: new Date().toISOString(),
        });
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        router.refresh();
    }

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-extrabold text-gray-800">👨‍💻 ডেভেলপার তথ্য</h1>
                <p className="text-sm text-gray-500 mt-1">অ্যাপ ডেভেলপারের তথ্য যা ব্যবহারকারীদের কাছে দেখানো হবে।</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
                {/* Avatar URL */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">প্রোফাইল ছবির URL</label>
                    <input className="input-field text-sm" placeholder="https://example.com/photo.jpg" value={info.avatar_url} onChange={e => update('avatar_url', e.target.value)} />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">নাম *</label>
                        <input className="input-field text-sm" placeholder="আপনার নাম" value={info.name} onChange={e => update('name', e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">পদবি / টাইটেল</label>
                        <input className="input-field text-sm" placeholder="Full Stack Developer" value={info.title} onChange={e => update('title', e.target.value)} />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">বায়ো / পরিচিতি</label>
                    <textarea className="input-field text-sm resize-none" rows={3} placeholder="সংক্ষেপে নিজের পরিচয়..." value={info.bio} onChange={e => update('bio', e.target.value)} />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">📧 ইমেইল</label>
                        <input className="input-field text-sm" placeholder="dev@example.com" value={info.email} onChange={e => update('email', e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">📱 ফোন</label>
                        <input className="input-field text-sm" placeholder="01XXXXXXXXX" value={info.phone} onChange={e => update('phone', e.target.value)} />
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">🌐 ওয়েবসাইট</label>
                        <input className="input-field text-sm" placeholder="https://..." value={info.website} onChange={e => update('website', e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">📘 Facebook</label>
                        <input className="input-field text-sm" placeholder="https://fb.com/..." value={info.facebook} onChange={e => update('facebook', e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">💼 LinkedIn</label>
                        <input className="input-field text-sm" placeholder="https://linkedin.com/in/..." value={info.linkedin} onChange={e => update('linkedin', e.target.value)} />
                    </div>
                </div>

                {/* Skills */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">🛠️ দক্ষতা / Skills</label>
                    <div className="flex gap-2 mb-2">
                        <input className="input-field text-sm flex-1" placeholder="যেমন: React, Next.js" value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())} />
                        <button onClick={addSkill} className="bg-primary-50 text-primary-600 px-3 py-2 rounded-xl text-sm font-bold hover:bg-primary-100">+ যোগ</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {info.skills.map((skill, i) => (
                            <span key={i} className="inline-flex items-center gap-1 bg-primary-50 text-primary-700 px-3 py-1 rounded-lg text-xs font-bold">
                                {skill}
                                <button onClick={() => removeSkill(i)} className="text-primary-400 hover:text-red-500 ml-1">✕</button>
                            </span>
                        ))}
                    </div>
                </div>

                <button onClick={save} disabled={saving || !info.name.trim()} className="btn-primary w-full md:w-auto px-8 py-3 text-sm">
                    {saving ? '⏳ সংরক্ষণ হচ্ছে...' : saved ? '✅ সংরক্ষিত!' : '💾 সংরক্ষণ করুন'}
                </button>
            </div>
        </div>
    );
}
