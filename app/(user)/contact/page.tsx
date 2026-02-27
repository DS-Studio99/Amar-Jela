'use client';

export default function ContactPage() {
    return (
        <div className="p-4 space-y-4">
            <div className="text-center py-4">
                <div className="text-4xl mb-2">📞</div>
                <h1 className="text-xl font-extrabold text-gray-800">যোগাযোগ করুন</h1>
            </div>
            <div className="card p-4 space-y-3">
                {[
                    { icon: '📞', label: 'ফোন', value: '+880 1700-000000', href: 'tel:+8801700000000' },
                    { icon: '📧', label: 'ইমেইল', value: 'info@amarjela.com.bd', href: 'mailto:info@amarjela.com.bd' },
                    { icon: '📍', label: 'ঠিকানা', value: 'ঢাকা, বাংলাদেশ', href: undefined },
                ].map(({ icon, label, value, href }) => (
                    <div key={label} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xl shadow-sm">{icon}</div>
                        <div>
                            <div className="text-xs text-gray-500">{label}</div>
                            {href ? <a href={href} className="text-sm font-semibold text-primary-600 hover:underline">{value}</a> : <div className="text-sm font-semibold text-gray-800">{value}</div>}
                        </div>
                    </div>
                ))}
            </div>
            <div className="card p-4">
                <h3 className="font-bold text-gray-800 mb-3">💬 মেসেজ পাঠান</h3>
                <div className="space-y-3">
                    <input className="input-field" placeholder="আপনার নাম" />
                    <textarea className="input-field resize-none" rows={3} placeholder="বার্তা লিখুন..." />
                    <button className="btn-primary w-full" onClick={() => alert('বার্তা পাঠানো হয়েছে!')}>📤 পাঠান</button>
                </div>
            </div>
        </div>
    );
}
