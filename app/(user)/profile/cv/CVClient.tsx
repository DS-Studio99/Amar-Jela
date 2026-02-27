'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Profile } from '@/types';
import { District } from '@/types';

interface CVData {
    photo: string;
    fullName: string;
    fatherName: string;
    motherName: string;
    dateOfBirth: string;
    gender: string;
    religion: string;
    nationality: string;
    nid: string;
    maritalStatus: string;
    phone: string;
    email: string;
    presentAddress: string;
    permanentAddress: string;
    objective: string;
    educations: Education[];
    experiences: Experience[];
    skills: string[];
    languages: string[];
    hobbies: string[];
    references: Reference[];
}

interface Education { degree: string; institution: string; year: string; result: string; }
interface Experience { title: string; company: string; duration: string; details: string; }
interface Reference { name: string; designation: string; phone: string; relation: string; }

interface Props {
    profile: Profile | null;
    dist: (District & { divisionId: string; divisionName: string }) | null;
}

const EMPTY_EDU: Education = { degree: '', institution: '', year: '', result: '' };
const EMPTY_EXP: Experience = { title: '', company: '', duration: '', details: '' };
const EMPTY_REF: Reference = { name: '', designation: '', phone: '', relation: '' };

export default function CVClient({ profile, dist }: Props) {
    const [step, setStep] = useState(0);
    const [generating, setGenerating] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);
    const printRef = useRef<HTMLDivElement>(null);

    const [data, setData] = useState<CVData>({
        photo: profile?.avatar_url || '',
        fullName: profile?.name || '',
        fatherName: '',
        motherName: '',
        dateOfBirth: '',
        gender: '',
        religion: '',
        nationality: 'বাংলাদেশী',
        nid: '',
        maritalStatus: '',
        phone: profile?.phone || '',
        email: profile?.email || '',
        presentAddress: '',
        permanentAddress: dist ? `${profile?.village || ''}, ${dist.name}, ${dist.divisionName}` : '',
        objective: '',
        educations: [{ ...EMPTY_EDU }],
        experiences: [],
        skills: [],
        languages: ['বাংলা', 'English'],
        hobbies: [],
        references: [{ ...EMPTY_REF }],
    });

    const [skillInput, setSkillInput] = useState('');
    const [hobbyInput, setHobbyInput] = useState('');

    function update(key: keyof CVData, value: string | Education[] | Experience[] | Reference[] | string[]) {
        setData(prev => ({ ...prev, [key]: value }));
    }

    function addEducation() { update('educations', [...data.educations, { ...EMPTY_EDU }]); }
    function removeEducation(i: number) { update('educations', data.educations.filter((_, idx) => idx !== i)); }
    function updateEducation(i: number, key: keyof Education, val: string) {
        const arr = [...data.educations]; arr[i] = { ...arr[i], [key]: val }; update('educations', arr);
    }

    function addExperience() { update('experiences', [...data.experiences, { ...EMPTY_EXP }]); }
    function removeExperience(i: number) { update('experiences', data.experiences.filter((_, idx) => idx !== i)); }
    function updateExperience(i: number, key: keyof Experience, val: string) {
        const arr = [...data.experiences]; arr[i] = { ...arr[i], [key]: val }; update('experiences', arr);
    }

    function addReference() { update('references', [...data.references, { ...EMPTY_REF }]); }
    function removeReference(i: number) { update('references', data.references.filter((_, idx) => idx !== i)); }
    function updateReference(i: number, key: keyof Reference, val: string) {
        const arr = [...data.references]; arr[i] = { ...arr[i], [key]: val }; update('references', arr);
    }

    function addSkill() { if (skillInput.trim()) { update('skills', [...data.skills, skillInput.trim()]); setSkillInput(''); } }
    function addHobby() { if (hobbyInput.trim()) { update('hobbies', [...data.hobbies, hobbyInput.trim()]); setHobbyInput(''); } }

    async function downloadPDF() {
        setGenerating(true);
        setPreviewMode(true);
        await new Promise(r => setTimeout(r, 500));

        try {
            const printWindow = window.open('', '_blank');
            if (!printWindow) { alert('পপআপ ব্লক করা থাকলে অনুগ্রহ করে অনুমতি দিন।'); setGenerating(false); return; }

            const cv = printRef.current?.innerHTML || '';
            printWindow.document.write(`<!DOCTYPE html><html><head><title>${data.fullName} - সিভি</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: 'Segoe UI', Tahoma, Geneva, sans-serif; font-size: 11px; color: #1a1a1a; line-height: 1.6; padding: 20px; }
                .cv-wrapper { max-width: 700px; margin: 0 auto; }
                .cv-header { text-align: center; border-bottom: 3px solid #1a9e5c; padding-bottom: 15px; margin-bottom: 15px; }
                .cv-header h1 { font-size: 22px; color: #1a1a1a; margin-bottom: 4px; }
                .cv-header p { font-size: 11px; color: #555; }
                .cv-photo { width: 90px; height: 90px; border-radius: 50%; border: 3px solid #1a9e5c; object-fit: cover; margin-bottom: 8px; }
                .section { margin-bottom: 14px; }
                .section h2 { font-size: 13px; color: #1a9e5c; border-bottom: 1.5px solid #1a9e5c; padding-bottom: 3px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px; }
                .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 20px; }
                .info-item { display: flex; gap: 6px; }
                .info-label { font-weight: 600; color: #444; min-width: 110px; }
                .info-value { color: #1a1a1a; }
                table { width: 100%; border-collapse: collapse; margin-top: 4px; }
                th, td { border: 1px solid #ddd; padding: 5px 8px; text-align: left; font-size: 10px; }
                th { background: #f0faf4; color: #1a9e5c; font-weight: 600; }
                .skills-list { display: flex; flex-wrap: wrap; gap: 5px; }
                .skill-tag { background: #f0faf4; color: #1a9e5c; padding: 3px 10px; border-radius: 4px; font-size: 10px; font-weight: 600; border: 1px solid #d0ead8; }
                .exp-item { margin-bottom: 10px; padding-left: 12px; border-left: 2px solid #1a9e5c; }
                .exp-title { font-weight: 700; font-size: 12px; }
                .exp-sub { color: #666; font-size: 10px; }
                .ref-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
                .ref-card { border: 1px solid #eee; padding: 8px; border-radius: 4px; }
                .ref-name { font-weight: 700; }
                .ref-detail { color: #666; font-size: 10px; }
                @media print { body { padding: 15px; } }
            </style></head><body>${cv}</body></html>`);
            printWindow.document.close();
            setTimeout(() => { printWindow.print(); }, 300);
        } catch {
            alert('PDF জেনারেট করতে সমস্যা হয়েছে।');
        }
        setGenerating(false);
    }

    const STEPS = ['ব্যক্তিগত', 'শিক্ষা', 'অভিজ্ঞতা ও দক্ষতা', 'রেফারেন্স', 'প্রিভিউ'];

    function renderStep() {
        switch (step) {
            case 0: return (
                <div className="space-y-3">
                    <h3 className="font-bold text-gray-800 text-base">👤 ব্যক্তিগত তথ্য</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2"><label className="label-sm">পূর্ণ নাম *</label><input className="input-field text-sm" placeholder="আপনার পূর্ণ নাম" value={data.fullName} onChange={e => update('fullName', e.target.value)} /></div>
                        <div><label className="label-sm">পিতার নাম</label><input className="input-field text-sm" placeholder="পিতার নাম" value={data.fatherName} onChange={e => update('fatherName', e.target.value)} /></div>
                        <div><label className="label-sm">মাতার নাম</label><input className="input-field text-sm" placeholder="মাতার নাম" value={data.motherName} onChange={e => update('motherName', e.target.value)} /></div>
                        <div><label className="label-sm">জন্ম তারিখ</label><input type="date" className="input-field text-sm" value={data.dateOfBirth} onChange={e => update('dateOfBirth', e.target.value)} /></div>
                        <div><label className="label-sm">লিঙ্গ</label>
                            <select className="input-field text-sm" value={data.gender} onChange={e => update('gender', e.target.value)}>
                                <option value="">নির্বাচন করুন</option>
                                <option value="পুরুষ">পুরুষ</option>
                                <option value="মহিলা">মহিলা</option>
                                <option value="অন্যান্য">অন্যান্য</option>
                            </select>
                        </div>
                        <div><label className="label-sm">ধর্ম</label><input className="input-field text-sm" placeholder="ইসলাম" value={data.religion} onChange={e => update('religion', e.target.value)} /></div>
                        <div><label className="label-sm">জাতীয়তা</label><input className="input-field text-sm" value={data.nationality} onChange={e => update('nationality', e.target.value)} /></div>
                        <div><label className="label-sm">NID নং</label><input className="input-field text-sm" placeholder="জাতীয় পরিচয়পত্র নম্বর" value={data.nid} onChange={e => update('nid', e.target.value)} /></div>
                        <div><label className="label-sm">বৈবাহিক অবস্থা</label>
                            <select className="input-field text-sm" value={data.maritalStatus} onChange={e => update('maritalStatus', e.target.value)}>
                                <option value="">নির্বাচন করুন</option>
                                <option value="অবিবাহিত">অবিবাহিত</option>
                                <option value="বিবাহিত">বিবাহিত</option>
                            </select>
                        </div>
                        <div><label className="label-sm">📞 ফোন</label><input className="input-field text-sm" value={data.phone} onChange={e => update('phone', e.target.value)} /></div>
                        <div><label className="label-sm">📧 ইমেইল</label><input className="input-field text-sm" value={data.email} onChange={e => update('email', e.target.value)} /></div>
                        <div className="col-span-2"><label className="label-sm">বর্তমান ঠিকানা</label><input className="input-field text-sm" placeholder="বর্তমান ঠিকানা" value={data.presentAddress} onChange={e => update('presentAddress', e.target.value)} /></div>
                        <div className="col-span-2"><label className="label-sm">স্থায়ী ঠিকানা</label><input className="input-field text-sm" value={data.permanentAddress} onChange={e => update('permanentAddress', e.target.value)} /></div>
                        <div className="col-span-2"><label className="label-sm">ক্যারিয়ার উদ্দেশ্য</label><textarea className="input-field text-sm resize-none" rows={2} placeholder="আপনার ক্যারিয়ারের লক্ষ্য..." value={data.objective} onChange={e => update('objective', e.target.value)} /></div>
                    </div>
                </div>
            );

            case 1: return (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-800 text-base">🎓 শিক্ষাগত যোগ্যতা</h3>
                        <button onClick={addEducation} className="text-xs text-primary-600 font-bold bg-primary-50 px-3 py-1.5 rounded-lg">+ যোগ করুন</button>
                    </div>
                    {data.educations.map((edu, i) => (
                        <div key={i} className="bg-gray-50 rounded-xl p-3 border border-gray-100 space-y-2 relative">
                            {data.educations.length > 1 && <button onClick={() => removeEducation(i)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">✕</button>}
                            <div className="grid grid-cols-2 gap-2">
                                <input className="input-field text-sm" placeholder="ডিগ্রি (SSC/HSC/BSc...)" value={edu.degree} onChange={e => updateEducation(i, 'degree', e.target.value)} />
                                <input className="input-field text-sm" placeholder="প্রতিষ্ঠান" value={edu.institution} onChange={e => updateEducation(i, 'institution', e.target.value)} />
                                <input className="input-field text-sm" placeholder="পাসের সাল" value={edu.year} onChange={e => updateEducation(i, 'year', e.target.value)} />
                                <input className="input-field text-sm" placeholder="ফলাফল (GPA/CGPA)" value={edu.result} onChange={e => updateEducation(i, 'result', e.target.value)} />
                            </div>
                        </div>
                    ))}
                </div>
            );

            case 2: return (
                <div className="space-y-4">
                    {/* Experience */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-gray-800 text-base">💼 কর্ম অভিজ্ঞতা</h3>
                            <button onClick={addExperience} className="text-xs text-primary-600 font-bold bg-primary-50 px-3 py-1.5 rounded-lg">+ যোগ করুন</button>
                        </div>
                        {data.experiences.length === 0 && <p className="text-xs text-gray-400 text-center py-3">কোনো অভিজ্ঞতা যোগ করা হয়নি (ঐচ্ছিক)</p>}
                        {data.experiences.map((exp, i) => (
                            <div key={i} className="bg-gray-50 rounded-xl p-3 border border-gray-100 space-y-2 relative">
                                {<button onClick={() => removeExperience(i)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">✕</button>}
                                <div className="grid grid-cols-2 gap-2">
                                    <input className="input-field text-sm" placeholder="পদবি" value={exp.title} onChange={e => updateExperience(i, 'title', e.target.value)} />
                                    <input className="input-field text-sm" placeholder="প্রতিষ্ঠান" value={exp.company} onChange={e => updateExperience(i, 'company', e.target.value)} />
                                    <input className="input-field text-sm" placeholder="সময়কাল" value={exp.duration} onChange={e => updateExperience(i, 'duration', e.target.value)} />
                                    <input className="input-field text-sm" placeholder="বিবরণ" value={exp.details} onChange={e => updateExperience(i, 'details', e.target.value)} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Skills */}
                    <div className="space-y-2">
                        <h3 className="font-bold text-gray-800 text-base">🛠️ দক্ষতা</h3>
                        <div className="flex gap-2">
                            <input className="input-field text-sm flex-1" placeholder="দক্ষতা যোগ করুন" value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())} />
                            <button onClick={addSkill} className="text-xs text-primary-600 font-bold bg-primary-50 px-3 rounded-lg">+</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {data.skills.map((s, i) => (
                                <span key={i} className="inline-flex items-center gap-1 bg-primary-50 text-primary-700 px-2.5 py-1 rounded-lg text-xs font-bold">
                                    {s} <button onClick={() => update('skills', data.skills.filter((_, idx) => idx !== i))} className="text-primary-400 hover:text-red-500">✕</button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Hobbies */}
                    <div className="space-y-2">
                        <h3 className="font-bold text-gray-800 text-base">🎨 শখ / আগ্রহ</h3>
                        <div className="flex gap-2">
                            <input className="input-field text-sm flex-1" placeholder="শখ যোগ করুন" value={hobbyInput} onChange={e => setHobbyInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addHobby())} />
                            <button onClick={addHobby} className="text-xs text-primary-600 font-bold bg-primary-50 px-3 rounded-lg">+</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {data.hobbies.map((h, i) => (
                                <span key={i} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg text-xs font-bold">
                                    {h} <button onClick={() => update('hobbies', data.hobbies.filter((_, idx) => idx !== i))} className="text-blue-400 hover:text-red-500">✕</button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Languages */}
                    <div className="space-y-2">
                        <h3 className="font-bold text-gray-800 text-base">🌐 ভাষা</h3>
                        <div className="flex flex-wrap gap-2">
                            {data.languages.map((l, i) => (
                                <span key={i} className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg text-xs font-bold">
                                    {l} <button onClick={() => update('languages', data.languages.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-red-500">✕</button>
                                </span>
                            ))}
                            <button onClick={() => {
                                const lang = prompt('ভাষা লিখুন:');
                                if (lang?.trim()) update('languages', [...data.languages, lang.trim()]);
                            }} className="text-xs text-primary-600 font-bold bg-primary-50 px-2.5 py-1 rounded-lg">+ যোগ</button>
                        </div>
                    </div>
                </div>
            );

            case 3: return (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-800 text-base">👥 রেফারেন্স</h3>
                        <button onClick={addReference} className="text-xs text-primary-600 font-bold bg-primary-50 px-3 py-1.5 rounded-lg">+ যোগ করুন</button>
                    </div>
                    {data.references.map((ref, i) => (
                        <div key={i} className="bg-gray-50 rounded-xl p-3 border border-gray-100 space-y-2 relative">
                            {data.references.length > 1 && <button onClick={() => removeReference(i)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">✕</button>}
                            <div className="grid grid-cols-2 gap-2">
                                <input className="input-field text-sm" placeholder="নাম" value={ref.name} onChange={e => updateReference(i, 'name', e.target.value)} />
                                <input className="input-field text-sm" placeholder="পদবি" value={ref.designation} onChange={e => updateReference(i, 'designation', e.target.value)} />
                                <input className="input-field text-sm" placeholder="ফোন" value={ref.phone} onChange={e => updateReference(i, 'phone', e.target.value)} />
                                <input className="input-field text-sm" placeholder="সম্পর্ক" value={ref.relation} onChange={e => updateReference(i, 'relation', e.target.value)} />
                            </div>
                        </div>
                    ))}
                </div>
            );

            case 4: return (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-800 text-base">📄 সিভি প্রিভিউ</h3>
                        <button onClick={downloadPDF} disabled={generating} className="text-xs bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold px-4 py-2 rounded-xl shadow-sm hover:from-blue-600 hover:to-blue-700 active:scale-95 transition-all disabled:opacity-50">
                            {generating ? '⏳ জেনারেট হচ্ছে...' : '📥 PDF ডাউনলোড'}
                        </button>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-200 p-4 text-sm overflow-auto shadow-sm" ref={printRef}>
                        <div className="cv-wrapper">
                            {/* CV Header */}
                            <div className="cv-header" style={{ textAlign: 'center', borderBottom: '3px solid #1a9e5c', paddingBottom: '12px', marginBottom: '14px' }}>
                                {data.photo && (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img src={data.photo} alt="" className="cv-photo" style={{ width: '90px', height: '90px', borderRadius: '50%', border: '3px solid #1a9e5c', objectFit: 'cover', margin: '0 auto 8px' }} />
                                )}
                                <h1 style={{ fontSize: '22px', color: '#1a1a1a', marginBottom: '2px', fontWeight: '800' }}>{data.fullName || 'আপনার নাম'}</h1>
                                <p style={{ fontSize: '11px', color: '#555' }}>
                                    {[data.phone, data.email, data.presentAddress || data.permanentAddress].filter(Boolean).join(' | ')}
                                </p>
                            </div>

                            {/* Objective */}
                            {data.objective && (
                                <div className="section" style={{ marginBottom: '14px' }}>
                                    <h2 style={{ fontSize: '13px', color: '#1a9e5c', borderBottom: '1.5px solid #1a9e5c', paddingBottom: '3px', marginBottom: '6px', letterSpacing: '1px' }}>ক্যারিয়ার উদ্দেশ্য</h2>
                                    <p style={{ fontSize: '11px', lineHeight: '1.6' }}>{data.objective}</p>
                                </div>
                            )}

                            {/* Personal Info */}
                            <div className="section" style={{ marginBottom: '14px' }}>
                                <h2 style={{ fontSize: '13px', color: '#1a9e5c', borderBottom: '1.5px solid #1a9e5c', paddingBottom: '3px', marginBottom: '6px', letterSpacing: '1px' }}>ব্যক্তিগত তথ্য</h2>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px 16px', fontSize: '11px' }}>
                                    {[['পিতার নাম', data.fatherName], ['মাতার নাম', data.motherName], ['জন্ম তারিখ', data.dateOfBirth], ['লিঙ্গ', data.gender], ['ধর্ম', data.religion], ['জাতীয়তা', data.nationality], ['NID', data.nid], ['বৈবাহিক অবস্থা', data.maritalStatus], ['স্থায়ী ঠিকানা', data.permanentAddress]].filter(([, v]) => v).map(([k, v]) => (
                                        <div key={k} style={{ display: 'flex', gap: '6px' }}>
                                            <span style={{ fontWeight: 600, color: '#444', minWidth: '100px' }}>{k}:</span>
                                            <span>{v}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Education */}
                            {data.educations.filter(e => e.degree).length > 0 && (
                                <div className="section" style={{ marginBottom: '14px' }}>
                                    <h2 style={{ fontSize: '13px', color: '#1a9e5c', borderBottom: '1.5px solid #1a9e5c', paddingBottom: '3px', marginBottom: '6px', letterSpacing: '1px' }}>শিক্ষাগত যোগ্যতা</h2>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '4px' }}>
                                        <thead><tr style={{ background: '#f0faf4' }}>
                                            <th style={{ border: '1px solid #ddd', padding: '5px 8px', textAlign: 'left', fontSize: '10px', color: '#1a9e5c', fontWeight: 600 }}>ডিগ্রি</th>
                                            <th style={{ border: '1px solid #ddd', padding: '5px 8px', textAlign: 'left', fontSize: '10px', color: '#1a9e5c', fontWeight: 600 }}>প্রতিষ্ঠান</th>
                                            <th style={{ border: '1px solid #ddd', padding: '5px 8px', textAlign: 'left', fontSize: '10px', color: '#1a9e5c', fontWeight: 600 }}>সাল</th>
                                            <th style={{ border: '1px solid #ddd', padding: '5px 8px', textAlign: 'left', fontSize: '10px', color: '#1a9e5c', fontWeight: 600 }}>ফলাফল</th>
                                        </tr></thead>
                                        <tbody>
                                            {data.educations.filter(e => e.degree).map((edu, i) => (
                                                <tr key={i}>
                                                    <td style={{ border: '1px solid #ddd', padding: '5px 8px', fontSize: '10px' }}>{edu.degree}</td>
                                                    <td style={{ border: '1px solid #ddd', padding: '5px 8px', fontSize: '10px' }}>{edu.institution}</td>
                                                    <td style={{ border: '1px solid #ddd', padding: '5px 8px', fontSize: '10px' }}>{edu.year}</td>
                                                    <td style={{ border: '1px solid #ddd', padding: '5px 8px', fontSize: '10px' }}>{edu.result}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Experience */}
                            {data.experiences.filter(e => e.title).length > 0 && (
                                <div className="section" style={{ marginBottom: '14px' }}>
                                    <h2 style={{ fontSize: '13px', color: '#1a9e5c', borderBottom: '1.5px solid #1a9e5c', paddingBottom: '3px', marginBottom: '6px', letterSpacing: '1px' }}>কর্ম অভিজ্ঞতা</h2>
                                    {data.experiences.filter(e => e.title).map((exp, i) => (
                                        <div key={i} style={{ marginBottom: '8px', paddingLeft: '10px', borderLeft: '2px solid #1a9e5c' }}>
                                            <div style={{ fontWeight: 700, fontSize: '12px' }}>{exp.title}</div>
                                            <div style={{ color: '#666', fontSize: '10px' }}>{exp.company} {exp.duration && `(${exp.duration})`}</div>
                                            {exp.details && <div style={{ fontSize: '10px', marginTop: '2px' }}>{exp.details}</div>}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Skills */}
                            {data.skills.length > 0 && (
                                <div className="section" style={{ marginBottom: '14px' }}>
                                    <h2 style={{ fontSize: '13px', color: '#1a9e5c', borderBottom: '1.5px solid #1a9e5c', paddingBottom: '3px', marginBottom: '6px', letterSpacing: '1px' }}>দক্ষতা</h2>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                                        {data.skills.map((s, i) => (
                                            <span key={i} style={{ background: '#f0faf4', color: '#1a9e5c', padding: '3px 10px', borderRadius: '4px', fontSize: '10px', fontWeight: 600, border: '1px solid #d0ead8' }}>{s}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Languages & Hobbies */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                                {data.languages.length > 0 && (
                                    <div>
                                        <h2 style={{ fontSize: '13px', color: '#1a9e5c', borderBottom: '1.5px solid #1a9e5c', paddingBottom: '3px', marginBottom: '6px', letterSpacing: '1px' }}>ভাষা</h2>
                                        <p style={{ fontSize: '11px' }}>{data.languages.join(', ')}</p>
                                    </div>
                                )}
                                {data.hobbies.length > 0 && (
                                    <div>
                                        <h2 style={{ fontSize: '13px', color: '#1a9e5c', borderBottom: '1.5px solid #1a9e5c', paddingBottom: '3px', marginBottom: '6px', letterSpacing: '1px' }}>শখ ও আগ্রহ</h2>
                                        <p style={{ fontSize: '11px' }}>{data.hobbies.join(', ')}</p>
                                    </div>
                                )}
                            </div>

                            {/* References */}
                            {data.references.filter(r => r.name).length > 0 && (
                                <div className="section">
                                    <h2 style={{ fontSize: '13px', color: '#1a9e5c', borderBottom: '1.5px solid #1a9e5c', paddingBottom: '3px', marginBottom: '6px', letterSpacing: '1px' }}>রেফারেন্স</h2>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                        {data.references.filter(r => r.name).map((ref, i) => (
                                            <div key={i} style={{ border: '1px solid #eee', padding: '8px', borderRadius: '4px' }}>
                                                <div style={{ fontWeight: 700, fontSize: '11px' }}>{ref.name}</div>
                                                <div style={{ color: '#666', fontSize: '10px' }}>{ref.designation}</div>
                                                <div style={{ color: '#666', fontSize: '10px' }}>📞 {ref.phone}</div>
                                                {ref.relation && <div style={{ color: '#888', fontSize: '9px' }}>সম্পর্ক: {ref.relation}</div>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Header */}
            <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100" style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
                <div className="max-w-[480px] mx-auto px-3 py-2.5 flex items-center gap-3">
                    <Link href="/profile" className="text-gray-400 hover:text-gray-600 transition-colors text-sm">←</Link>
                    <h1 className="text-sm font-bold text-gray-700">📄 সিভি জেনারেটর</h1>
                </div>
            </div>

            <div className="max-w-[480px] mx-auto">
                {/* Progress Steps */}
                <div className="p-3 pt-4">
                    <div className="flex items-center justify-between mb-1">
                        {STEPS.map((label, i) => (
                            <button key={i} onClick={() => setStep(i)} className={`flex items-center gap-1 text-[10px] font-bold transition-all ${i === step ? 'text-primary-600' : i < step ? 'text-green-500' : 'text-gray-300'}`}>
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] ${i === step ? 'bg-primary-500 text-white' : i < step ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                                    {i < step ? '✓' : i + 1}
                                </span>
                                <span className="hidden sm:inline">{label}</span>
                            </button>
                        ))}
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full">
                        <div className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all duration-500" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
                    </div>
                </div>

                {/* Step Content */}
                <div className="p-4 pb-32">
                    {renderStep()}
                </div>

                {/* Navigation Buttons */}
                <div className="fixed bottom-14 left-0 right-0 z-20 bg-white border-t border-gray-100 p-3">
                    <div className="max-w-[480px] mx-auto flex gap-3">
                        {step > 0 && (
                            <button onClick={() => setStep(step - 1)} className="btn-secondary flex-1 text-sm py-2.5">← পিছনে</button>
                        )}
                        {step < STEPS.length - 1 ? (
                            <button onClick={() => setStep(step + 1)} className="btn-primary flex-[2] text-sm py-2.5">পরবর্তী →</button>
                        ) : (
                            <button onClick={downloadPDF} disabled={generating || !data.fullName} className="btn-primary flex-[2] text-sm py-2.5">
                                {generating ? '⏳ জেনারেট হচ্ছে...' : '📥 PDF ডাউনলোড করুন'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
