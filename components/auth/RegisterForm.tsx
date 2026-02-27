'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { BD_DIVISIONS, getDistrict } from '@/lib/data/bangladesh';

type Step = 1 | 2 | 3;

export default function RegisterForm() {
    const router = useRouter();
    const supabase = createClient();
    const [step, setStep] = useState<Step>(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPw, setShowPw] = useState(false);

    // Form state
    const [form, setForm] = useState({
        name: '', email: '', phone: '', password: '',
        divisionId: '', districtId: '', thana: '', village: '',
    });

    const update = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));
    const districts = BD_DIVISIONS.find(d => d.id === form.divisionId)?.districts || [];
    const thanas = BD_DIVISIONS.find(d => d.id === form.divisionId)?.districts.find(d => d.id === form.districtId)?.thanas || [];
    const distName = districts.find(d => d.id === form.districtId)?.name || '';
    const divName = BD_DIVISIONS.find(d => d.id === form.divisionId)?.name || '';

    async function handleRegister() {
        setLoading(true); setError('');
        try {
            const trimmedEmail = form.email.trim();
            const emailInput = trimmedEmail || `${form.phone.trim()}@amarjela.app`;
            const { data: authData, error: signUpError } = await supabase.auth.signUp({
                email: emailInput,
                password: form.password,
            });
            if (signUpError) throw signUpError;
            if (!authData.user) throw new Error('ব্যবহারকারী তৈরি হয়নি।');

            const { error: profileError } = await supabase.from('profiles').insert({
                id: authData.user.id,
                name: form.name, phone: form.phone, division_id: form.divisionId,
                district_id: form.districtId, thana: form.thana, village: form.village,
                selected_division_id: form.divisionId, selected_district_id: form.districtId,
                role: 'user',
            });
            if (profileError) throw profileError;
            router.push('/dashboard');
        } catch (err: unknown) { setError((err as Error).message); }
        finally { setLoading(false); }
    }

    function nextStep() {
        setError('');
        if (step === 1) {
            if (!form.name.trim()) { setError('নাম লিখুন।'); return; }
            if (!/^01[3-9]\d{8}$/.test(form.phone)) { setError('সঠিক ফোন নম্বর লিখুন।'); return; }
            if (form.password.length < 6) { setError('পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে।'); return; }
            setStep(2);
        } else if (step === 2) {
            if (!form.divisionId) { setError('বিভাগ সিলেক্ট করুন।'); return; }
            if (!form.districtId) { setError('জেলা সিলেক্ট করুন।'); return; }
            setStep(3);
        }
    }

    const steps = [1, 2, 3];

    return (
        <div className="p-6">
            {/* Step indicator */}
            <div className="flex items-center justify-center mb-6 gap-2">
                {steps.map((s, i) => (
                    <div key={s} className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= s ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-400'}`}>{s}</div>
                        {i < 2 && <div className={`w-10 h-1 rounded-full transition-all ${step > s ? 'bg-primary-500' : 'bg-gray-100'}`} />}
                    </div>
                ))}
            </div>

            {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{error}</div>}

            {/* Step 1 */}
            {step === 1 && (
                <div className="space-y-4">
                    <h3 className="text-base font-bold text-gray-500 mb-4">ব্যক্তিগত তথ্য</h3>
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1.5">পূর্ণ নাম *</label>
                        <input className="input-field" placeholder="আপনার নাম" value={form.name} onChange={e => update('name', e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1.5">ফোন নম্বর *</label>
                        <input className="input-field" placeholder="01XXXXXXXXX" value={form.phone} onChange={e => update('phone', e.target.value)} type="tel" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1.5">ইমেইল <span className="text-gray-400 text-xs">(ঐচ্ছিক)</span></label>
                        <input className="input-field" placeholder="example@email.com" value={form.email} onChange={e => update('email', e.target.value)} type="email" />
                    </div>
                    <div className="relative">
                        <label className="block text-sm font-semibold text-gray-600 mb-1.5">পাসওয়ার্ড *</label>
                        <input className="input-field pr-12" placeholder="কমপক্ষে ৬ অক্ষর" value={form.password} onChange={e => update('password', e.target.value)} type={showPw ? 'text' : 'password'} />
                        <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-9 text-gray-400">{showPw ? '🙈' : '👁️'}</button>
                    </div>
                    <button onClick={nextStep} className="btn-primary w-full mt-2">পরবর্তী →</button>
                </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
                <div className="space-y-4">
                    <h3 className="text-base font-bold text-gray-500 mb-4">আপনার অবস্থান</h3>
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1.5">বিভাগ *</label>
                        <select className="input-field" value={form.divisionId} onChange={e => update('divisionId', e.target.value)}>
                            <option value="">বিভাগ সিলেক্ট করুন</option>
                            {BD_DIVISIONS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1.5">জেলা *</label>
                        <select className="input-field" value={form.districtId} onChange={e => update('districtId', e.target.value)} disabled={!form.divisionId}>
                            <option value="">জেলা সিলেক্ট করুন</option>
                            {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1.5">থানা <span className="text-gray-400 text-xs">(ঐচ্ছিক)</span></label>
                        <select className="input-field" value={form.thana} onChange={e => update('thana', e.target.value)} disabled={!form.districtId}>
                            <option value="">থানা সিলেক্ট করুন</option>
                            {thanas.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1.5">গ্রাম/মহল্লা <span className="text-gray-400 text-xs">(ঐচ্ছিক)</span></label>
                        <input className="input-field" placeholder="গ্রাম বা মহল্লার নাম" value={form.village} onChange={e => update('village', e.target.value)} />
                    </div>
                    <div className="flex gap-3 mt-2">
                        <button onClick={() => setStep(1)} className="btn-secondary flex-1">← আগে</button>
                        <button onClick={nextStep} className="btn-primary flex-[2]">পরবর্তী →</button>
                    </div>
                </div>
            )}

            {/* Step 3 - Confirm */}
            {step === 3 && (
                <div className="space-y-4">
                    <h3 className="text-base font-bold text-gray-500 mb-4">নিশ্চিত করুন</h3>
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                        {([['নাম', form.name], ['ফোন', form.phone], form.email ? ['ইমেইল', form.email] : null, ['বিভাগ', divName], ['জেলা', distName], form.thana ? ['থানা', form.thana] : null, form.village ? ['গ্রাম', form.village] : null].filter(Boolean) as string[][]).map(([k, v]) => (
                            <div key={k} className="flex justify-between text-sm border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                                <span className="text-gray-500">{k}</span>
                                <span className="font-semibold">{v as string}</span>
                            </div>
                        ))}
                    </div>
                    <button onClick={handleRegister} disabled={loading} className="btn-primary w-full">
                        {loading ? '⏳ রেজিষ্ট্রেশন হচ্ছে...' : '✅ রেজিষ্ট্রেশন সম্পন্ন করুন'}
                    </button>
                    <div className="flex justify-center">
                        <button onClick={() => setStep(2)} className="btn-secondary text-sm px-4 py-2">← সম্পাদনা করুন</button>
                    </div>
                </div>
            )}
        </div>
    );
}
