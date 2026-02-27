// Category-specific form field definitions
// Each category has its own set of fields for data entry

export interface CategoryField {
    key: string;
    label: string;
    placeholder: string;
    type: 'text' | 'tel' | 'textarea' | 'select' | 'number';
    required?: boolean;
    options?: string[];  // for select type
    highlight?: boolean; // highlighted fields (e.g., fee, time)
}

export interface CategoryConfig {
    nameKey: string;       // which field is the "name/title"
    fields: CategoryField[];
    showWarning?: boolean;  // financial warning
    warningMessage?: string;
}

// Map category names to their specific fields
const CATEGORY_FIELDS: Record<string, CategoryConfig> = {
    'ডাক্তার': {
        nameKey: 'title',
        fields: [
            { key: 'title', label: 'ডাক্তারের নাম', placeholder: 'ডাঃ আব্দুল করিম', type: 'text', required: true },
            { key: 'phone', label: 'ফোন নম্বর', placeholder: '01XXXXXXXXX', type: 'tel' },
            { key: 'specialty', label: 'কীসের ডাক্তার (বিশেষজ্ঞতা)', placeholder: 'হৃদরোগ / চর্ম / শিশু / মেডিসিন', type: 'text', required: true },
            { key: 'chamber', label: 'চেম্বার ঠিকানা', placeholder: 'চেম্বারের ঠিকানা লিখুন', type: 'text' },
            { key: 'visit_time', label: '⏰ ভিজিটের সময়', placeholder: 'সকাল ১০টা - দুপুর ২টা', type: 'text', highlight: true },
            { key: 'visit_fee', label: '💰 ভিজিট ফি', placeholder: '৫০০ টাকা', type: 'text', highlight: true },
            { key: 'description', label: 'বিবরণ', placeholder: 'অতিরিক্ত তথ্য যেমন ছুটির দিন, অনলাইন সেবা ইত্যাদি', type: 'textarea' },
        ],
    },
    'হাসপাতাল': {
        nameKey: 'title',
        fields: [
            { key: 'title', label: 'হাসপাতালের নাম', placeholder: 'ঢাকা মেডিকেল কলেজ হাসপাতাল', type: 'text', required: true },
            { key: 'phone', label: 'ফোন নম্বর', placeholder: '01XXXXXXXXX', type: 'tel' },
            { key: 'address', label: 'ঠিকানা', placeholder: 'বিস্তারিত ঠিকানা', type: 'text' },
            { key: 'hospital_type', label: 'হাসপাতালের ধরন', placeholder: 'সরকারি / বেসরকারি / ক্লিনিক', type: 'select', options: ['সরকারি', 'বেসরকারি', 'ক্লিনিক', 'ডায়াগনস্টিক সেন্টার'] },
            { key: 'departments', label: 'বিভাগ সমূহ', placeholder: 'মেডিসিন, সার্জারি, গাইনি, শিশু', type: 'text' },
            { key: 'emergency', label: '🚨 ইমারজেন্সি নম্বর', placeholder: 'জরুরি নম্বর', type: 'tel', highlight: true },
            { key: 'description', label: 'বিবরণ', placeholder: 'বেড সংখ্যা, সুযোগ-সুবিধা ইত্যাদি', type: 'textarea' },
        ],
    },
    'ডায়াগনস্টিক': {
        nameKey: 'title',
        fields: [
            { key: 'title', label: 'ডায়াগনস্টিক সেন্টারের নাম', placeholder: 'পপুলার ডায়াগনস্টিক', type: 'text', required: true },
            { key: 'phone', label: 'ফোন নম্বর', placeholder: '01XXXXXXXXX', type: 'tel' },
            { key: 'address', label: 'ঠিকানা', placeholder: 'বিস্তারিত ঠিকানা', type: 'text' },
            { key: 'services', label: 'সেবা সমূহ', placeholder: 'এক্স-রে, আল্ট্রাসনোগ্রাফি, ব্লাড টেস্ট', type: 'text' },
            { key: 'timing', label: '⏰ সেবার সময়', placeholder: 'সকাল ৮টা - রাত ১০টা', type: 'text', highlight: true },
            { key: 'description', label: 'বিবরণ', placeholder: 'অতিরিক্ত তথ্য', type: 'textarea' },
        ],
    },
    'রক্ত': {
        nameKey: 'title',
        fields: [
            { key: 'title', label: 'দাতার নাম', placeholder: 'মোঃ করিম', type: 'text', required: true },
            { key: 'phone', label: 'ফোন নম্বর', placeholder: '01XXXXXXXXX', type: 'tel', required: true },
            { key: 'blood_group', label: '🩸 রক্তের গ্রুপ', placeholder: 'A+', type: 'select', options: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'], highlight: true },
            { key: 'address', label: 'ঠিকানা', placeholder: 'এলাকা ও ঠিকানা', type: 'text' },
            { key: 'last_donated', label: 'সর্বশেষ রক্তদান', placeholder: 'তারিখ বা মাস', type: 'text' },
            { key: 'description', label: 'অতিরিক্ত তথ্য', placeholder: 'যেকোনো বিশেষ তথ্য', type: 'textarea' },
        ],
    },
    'বাসের সময়সূচি': {
        nameKey: 'title',
        fields: [
            { key: 'title', label: 'বাস কোম্পানির নাম', placeholder: 'গ্রিনলাইন / হানিফ', type: 'text', required: true },
            { key: 'phone', label: 'বুকিং নম্বর', placeholder: '01XXXXXXXXX', type: 'tel' },
            { key: 'route', label: '🛣️ রুট', placeholder: 'ঢাকা - চট্টগ্রাম', type: 'text', required: true },
            { key: 'departure_time', label: '⏰ ছাড়ার সময়', placeholder: 'সকাল ৮:০০, দুপুর ২:০০', type: 'text', highlight: true },
            { key: 'fare', label: '💰 ভাড়া', placeholder: '৬০০ টাকা', type: 'text', highlight: true },
            { key: 'bus_type', label: 'বাসের ধরন', placeholder: 'এসি / নন-এসি', type: 'select', options: ['এসি', 'নন-এসি', 'স্লিপার', 'বিজনেস ক্লাস'] },
            { key: 'address', label: 'কাউন্টার ঠিকানা', placeholder: 'কাউন্টারের ঠিকানা', type: 'text' },
            { key: 'description', label: 'বিবরণ', placeholder: 'অতিরিক্ত তথ্য', type: 'textarea' },
        ],
    },
    'ট্রেনের সময়সূচি': {
        nameKey: 'title',
        fields: [
            { key: 'title', label: 'ট্রেনের নাম', placeholder: 'সুবর্ণ এক্সপ্রেস', type: 'text', required: true },
            { key: 'route', label: '🛤️ রুট', placeholder: 'ঢাকা - চট্টগ্রাম', type: 'text', required: true },
            { key: 'departure_time', label: '⏰ ছাড়ার সময়', placeholder: 'সকাল ৭:০০', type: 'text', highlight: true },
            { key: 'fare', label: '💰 ভাড়া', placeholder: 'শোভন: ৩৪৫ টাকা', type: 'text', highlight: true },
            { key: 'train_class', label: 'ক্লাস', placeholder: '', type: 'select', options: ['শোভন', 'শোভন চেয়ার', 'প্রথম শ্রেণি', 'এসি চেয়ার', 'এসি বার্থ', 'স্নিগ্ধা'] },
            { key: 'phone', label: 'যোগাযোগ নম্বর', placeholder: 'স্টেশন নম্বর', type: 'tel' },
            { key: 'description', label: 'বিবরণ', placeholder: 'ছুটির দিন, স্টপেজ ইত্যাদি', type: 'textarea' },
        ],
    },
    'দর্শনীয় স্থান': {
        nameKey: 'title',
        fields: [
            { key: 'title', label: 'স্থানের নাম', placeholder: 'সোনারগাঁও জাদুঘর', type: 'text', required: true },
            { key: 'address', label: 'ঠিকানা', placeholder: 'বিস্তারিত ঠিকানা', type: 'text', required: true },
            { key: 'entry_fee', label: '🎟️ প্রবেশ মূল্য', placeholder: 'ফ্রি / ২০ টাকা', type: 'text', highlight: true },
            { key: 'timing', label: '⏰ সময়সূচি', placeholder: 'সকাল ৯টা - বিকাল ৫টা', type: 'text', highlight: true },
            { key: 'phone', label: 'যোগাযোগ নম্বর', placeholder: '01XXXXXXXXX', type: 'tel' },
            { key: 'description', label: 'বিবরণ', placeholder: 'স্থানটির বিশেষত্ব, কিভাবে যাবেন ইত্যাদি', type: 'textarea' },
        ],
    },
    'বাসা ভাড়া': {
        nameKey: 'title',
        fields: [
            { key: 'title', label: 'বিজ্ঞাপনের শিরোনাম', placeholder: '২ রুমের বাসা ভাড়া দেওয়া হবে', type: 'text', required: true },
            { key: 'phone', label: 'যোগাযোগ নম্বর', placeholder: '01XXXXXXXXX', type: 'tel', required: true },
            { key: 'address', label: 'ঠিকানা', placeholder: 'বাসার ঠিকানা', type: 'text', required: true },
            { key: 'rent', label: '💰 ভাড়া', placeholder: '৮,০০০ টাকা / মাস', type: 'text', highlight: true },
            { key: 'rooms', label: '🛏️ রুম সংখ্যা', placeholder: '২ রুম, ১ বাথরুম, ১ কিচেন', type: 'text' },
            { key: 'rent_type', label: 'ভাড়ার ধরন', placeholder: '', type: 'select', options: ['পরিবার', 'ব্যাচেলর', 'সাবলেট', 'অফিস'] },
            { key: 'description', label: 'বিবরণ', placeholder: 'সুযোগ-সুবিধা, শর্তাবলি ইত্যাদি', type: 'textarea' },
        ],
    },
    'শপিং': {
        nameKey: 'title',
        fields: [
            { key: 'title', label: 'দোকান/মার্কেটের নাম', placeholder: 'নিউ মার্কেট', type: 'text', required: true },
            { key: 'phone', label: 'নম্বর', placeholder: '01XXXXXXXXX', type: 'tel' },
            { key: 'address', label: 'ঠিকানা', placeholder: 'বিস্তারিত ঠিকানা', type: 'text' },
            { key: 'product_type', label: '🛍️ পণ্যের ধরন', placeholder: 'কাপড় / ইলেকট্রনিক্স / গ্রোসারি', type: 'text' },
            { key: 'timing', label: '⏰ দোকান খোলার সময়', placeholder: 'সকাল ১০টা - রাত ৯টা', type: 'text', highlight: true },
            { key: 'description', label: 'বিবরণ', placeholder: 'বিশেষ অফার বা তথ্য', type: 'textarea' },
        ],
    },
    'ফায়ার সার্ভিস': {
        nameKey: 'title',
        fields: [
            { key: 'title', label: 'স্টেশনের নাম', placeholder: 'ফায়ার সার্ভিস ও সিভিল ডিফেন্স', type: 'text', required: true },
            { key: 'phone', label: '📞 জরুরি নম্বর', placeholder: '999 / 01XXXXXXXXX', type: 'tel', required: true, highlight: true },
            { key: 'address', label: 'ঠিকানা', placeholder: 'স্টেশনের ঠিকানা', type: 'text' },
            { key: 'description', label: 'বিবরণ', placeholder: 'অতিরিক্ত তথ্য', type: 'textarea' },
        ],
    },
    'কুরিয়ার সার্ভিস': {
        nameKey: 'title',
        fields: [
            { key: 'title', label: 'কুরিয়ার সার্ভিসের নাম', placeholder: 'সুন্দরবন কুরিয়ার', type: 'text', required: true },
            { key: 'phone', label: 'ফোন নম্বর', placeholder: '01XXXXXXXXX', type: 'tel' },
            { key: 'address', label: 'অফিস ঠিকানা', placeholder: 'বিস্তারিত ঠিকানা', type: 'text' },
            { key: 'service_area', label: '📍 সেবা এলাকা', placeholder: 'সারাদেশ / ঢাকা শহর', type: 'text' },
            { key: 'timing', label: '⏰ অফিস সময়', placeholder: 'সকাল ৯টা - সন্ধ্যা ৬টা', type: 'text', highlight: true },
            { key: 'description', label: 'বিবরণ', placeholder: 'রেট, ডেলিভারি সময় ইত্যাদি', type: 'textarea' },
        ],
    },
    'থানা-পুলিশ': {
        nameKey: 'title',
        fields: [
            { key: 'title', label: 'থানার নাম', placeholder: 'কোতওয়ালি থানা', type: 'text', required: true },
            { key: 'phone', label: '📞 জরুরি নম্বর', placeholder: '999 / 01XXXXXXXXX', type: 'tel', required: true, highlight: true },
            { key: 'address', label: 'ঠিকানা', placeholder: 'থানার ঠিকানা', type: 'text' },
            { key: 'oc_name', label: '👮 ওসির নাম', placeholder: 'ওসি/ভারপ্রাপ্ত কর্মকর্তা', type: 'text' },
            { key: 'description', label: 'বিবরণ', placeholder: 'অতিরিক্ত তথ্য', type: 'textarea' },
        ],
    },
    'বিদ্যুৎ অফিস': {
        nameKey: 'title',
        fields: [
            { key: 'title', label: 'অফিসের নাম', placeholder: 'পল্লী বিদ্যুৎ সমিতি', type: 'text', required: true },
            { key: 'phone', label: '📞 অভিযোগ নম্বর', placeholder: '01XXXXXXXXX', type: 'tel', highlight: true },
            { key: 'address', label: 'ঠিকানা', placeholder: 'অফিসের ঠিকানা', type: 'text' },
            { key: 'timing', label: '⏰ অফিস সময়', placeholder: 'সকাল ৯টা - বিকাল ৫টা', type: 'text' },
            { key: 'description', label: 'বিবরণ', placeholder: 'অতিরিক্ত তথ্য', type: 'textarea' },
        ],
    },
    'রেস্টুরেন্ট': {
        nameKey: 'title',
        fields: [
            { key: 'title', label: 'রেস্টুরেন্টের নাম', placeholder: 'স্টার কাবাব', type: 'text', required: true },
            { key: 'phone', label: 'ফোন / অর্ডার নম্বর', placeholder: '01XXXXXXXXX', type: 'tel' },
            { key: 'address', label: 'ঠিকানা', placeholder: 'বিস্তারিত ঠিকানা', type: 'text' },
            { key: 'food_type', label: '🍽️ খাবারের ধরন', placeholder: 'বাঙালি / চাইনিজ / ফাস্টফুড', type: 'text' },
            { key: 'price_range', label: '💰 মূল্য পরিসীমা', placeholder: '১০০-৫০০ টাকা', type: 'text', highlight: true },
            { key: 'timing', label: '⏰ খোলার সময়', placeholder: 'সকাল ৮টা - রাত ১১টা', type: 'text', highlight: true },
            { key: 'delivery', label: 'ডেলিভারি', placeholder: '', type: 'select', options: ['হোম ডেলিভারি আছে', 'হোম ডেলিভারি নেই', 'ফুডপান্ডায় আছে'] },
            { key: 'description', label: 'বিবরণ', placeholder: 'স্পেশাল আইটেম, বসার ব্যবস্থা ইত্যাদি', type: 'textarea' },
        ],
    },
    'হোটেল': {
        nameKey: 'title',
        fields: [
            { key: 'title', label: 'হোটেলের নাম', placeholder: 'হোটেল রয়্যাল', type: 'text', required: true },
            { key: 'phone', label: 'বুকিং নম্বর', placeholder: '01XXXXXXXXX', type: 'tel' },
            { key: 'address', label: 'ঠিকানা', placeholder: 'বিস্তারিত ঠিকানা', type: 'text' },
            { key: 'room_rate', label: '💰 রুম ভাড়া', placeholder: '১,৫০০ - ৫,০০০ টাকা', type: 'text', highlight: true },
            { key: 'hotel_type', label: 'হোটেলের ধরন', placeholder: '', type: 'select', options: ['আবাসিক', 'অনাবাসিক', 'রিসোর্ট', 'মোটেল', 'গেস্ট হাউস'] },
            { key: 'amenities', label: '🏊 সুবিধা সমূহ', placeholder: 'এসি, ওয়াইফাই, পার্কিং', type: 'text' },
            { key: 'description', label: 'বিবরণ', placeholder: 'চেক-ইন/আউট সময়, নীতিমালা ইত্যাদি', type: 'textarea' },
        ],
    },
    'ওয়েডিং সার্ভিস': {
        nameKey: 'title',
        fields: [
            { key: 'title', label: 'সার্ভিসের নাম', placeholder: 'ড্রিম ওয়েডিং প্ল্যানার', type: 'text', required: true },
            { key: 'phone', label: 'যোগাযোগ নম্বর', placeholder: '01XXXXXXXXX', type: 'tel' },
            { key: 'address', label: 'ঠিকানা', placeholder: 'বিস্তারিত ঠিকানা', type: 'text' },
            { key: 'service_type', label: '💍 সেবার ধরন', placeholder: '', type: 'select', options: ['কমিউনিটি সেন্টার', 'ক্যাটারিং', 'ডেকোরেশন', 'ফটোগ্রাফি', 'মেকআপ', 'মিউজিক', 'কমপ্লিট প্যাকেজ'] },
            { key: 'price', label: '💰 মূল্য', placeholder: 'প্যাকেজ শুরু ৫০,০০০ টাকা', type: 'text', highlight: true },
            { key: 'description', label: 'বিবরণ', placeholder: 'সেবা বিবরণ, প্যাকেজ ডিটেইলস', type: 'textarea' },
        ],
    },
    'গাড়ি ভাড়া': {
        nameKey: 'title',
        fields: [
            { key: 'title', label: 'সার্ভিসের নাম / মালিকের নাম', placeholder: 'আল-আমিন রেন্ট-আ-কার', type: 'text', required: true },
            { key: 'phone', label: 'যোগাযোগ নম্বর', placeholder: '01XXXXXXXXX', type: 'tel', required: true },
            { key: 'vehicle_type', label: '🚗 গাড়ির ধরন', placeholder: '', type: 'select', options: ['সেডান', 'মাইক্রোবাস', 'প্রাইভেট কার', 'পিকআপ', 'সিএনজি', 'বাইক'] },
            { key: 'fare', label: '💰 ভাড়া', placeholder: '৫,০০০ টাকা / দিন', type: 'text', highlight: true },
            { key: 'address', label: 'এলাকা', placeholder: 'ড-স্ট্যান্ড / গ্যারেজ ঠিকানা', type: 'text' },
            { key: 'ac_status', label: 'এসি/নন-এসি', placeholder: '', type: 'select', options: ['এসি', 'নন-এসি', 'দুটোই আছে'] },
            { key: 'description', label: 'বিবরণ', placeholder: 'ড্রাইভার সহ/ছাড়া, শর্তাবলি', type: 'textarea' },
        ],
    },
    'চাকরি': {
        nameKey: 'title',
        showWarning: true,
        warningMessage: '⚠️ সতর্কতা: চাকরি সংক্রান্ত কোনো আর্থিক লেনদেন করার আগে অবশ্যই যাচাই করুন। কোনো প্রতিষ্ঠান বা ব্যক্তি যদি চাকরির বিনিময়ে টাকা দাবি করে তাহলে সেটি প্রতারণা হতে পারে। "আমার জেলা" কোনো আর্থিক লেনদেনের জন্য দায়ী নয়।',
        fields: [
            { key: 'title', label: 'পদের নাম', placeholder: 'সিনিয়র অফিসার', type: 'text', required: true },
            { key: 'company', label: '🏢 প্রতিষ্ঠানের নাম', placeholder: 'XYZ কোম্পানি লিমিটেড', type: 'text', required: true },
            { key: 'phone', label: 'যোগাযোগ নম্বর', placeholder: '01XXXXXXXXX', type: 'tel' },
            { key: 'salary', label: '💰 বেতন', placeholder: '২৫,০০০ - ৩৫,০০০ টাকা', type: 'text', highlight: true },
            { key: 'qualification', label: '🎓 যোগ্যতা', placeholder: 'ন্যূনতম এইচএসসি / স্নাতক', type: 'text' },
            { key: 'job_type', label: 'চাকরির ধরন', placeholder: '', type: 'select', options: ['ফুল-টাইম', 'পার্ট-টাইম', 'কন্ট্রাক্ট', 'ইন্টার্ন', 'ফ্রিল্যান্স'] },
            { key: 'deadline', label: '📅 আবেদনের শেষ তারিখ', placeholder: '৩০ মার্চ ২০২৫', type: 'text', highlight: true },
            { key: 'address', label: 'কর্মস্থল', placeholder: 'ঠিকানা', type: 'text' },
            { key: 'description', label: 'বিবরণ', placeholder: 'দায়িত্ব, সুযোগ-সুবিধা, আবেদন প্রক্রিয়া', type: 'textarea' },
        ],
    },
    'উদ্যোক্তা': {
        nameKey: 'title',
        showWarning: true,
        warningMessage: '⚠️ সতর্কতা: ব্যবসায়িক বা বিনিয়োগ সংক্রান্ত কোনো আর্থিক লেনদেন করার আগে অবশ্যই যাচাই করুন। অপরিচিত কাউকে অগ্রিম টাকা প্রদান করবেন না। "আমার জেলা" কোনো আর্থিক লেনদেনের জন্য দায়ী নয়।',
        fields: [
            { key: 'title', label: 'ব্যবসার নাম / পরিচিতি', placeholder: 'গ্রামীণ হস্তশিল্প', type: 'text', required: true },
            { key: 'phone', label: 'যোগাযোগ নম্বর', placeholder: '01XXXXXXXXX', type: 'tel', required: true },
            { key: 'business_type', label: '💼 ব্যবসার ধরন', placeholder: 'খাদ্য / পোশাক / প্রযুক্তি', type: 'text' },
            { key: 'address', label: 'ঠিকানা', placeholder: 'ব্যবসার ঠিকানা', type: 'text' },
            { key: 'social_media', label: '📱 সোশ্যাল মিডিয়া', placeholder: 'Facebook Page / Website', type: 'text' },
            { key: 'description', label: 'বিবরণ', placeholder: 'পণ্য/সেবা বিবরণ, প্রতিষ্ঠার সাল ইত্যাদি', type: 'textarea' },
        ],
    },
    'শিক্ষা প্রতিষ্ঠান': {
        nameKey: 'title',
        fields: [
            { key: 'title', label: 'প্রতিষ্ঠানের নাম', placeholder: 'জেলা স্কুল', type: 'text', required: true },
            { key: 'phone', label: 'ফোন নম্বর', placeholder: '01XXXXXXXXX', type: 'tel' },
            { key: 'address', label: 'ঠিকানা', placeholder: 'বিস্তারিত ঠিকানা', type: 'text' },
            { key: 'institution_type', label: '🏫 প্রতিষ্ঠানের ধরন', placeholder: '', type: 'select', options: ['প্রাথমিক বিদ্যালয়', 'মাধ্যমিক বিদ্যালয়', 'কলেজ', 'বিশ্ববিদ্যালয়', 'মাদ্রাসা', 'কারিগরি', 'প্রশিক্ষণ কেন্দ্র'] },
            { key: 'principal', label: 'প্রধান শিক্ষক/অধ্যক্ষ', placeholder: 'নাম', type: 'text' },
            { key: 'description', label: 'বিবরণ', placeholder: 'ক্লাস পরিসীমা, ছাত্র সংখ্যা ইত্যাদি', type: 'textarea' },
        ],
    },
    'শিক্ষক': {
        nameKey: 'title',
        fields: [
            { key: 'title', label: 'শিক্ষকের নাম', placeholder: 'মোঃ আরিফ হোসেন', type: 'text', required: true },
            { key: 'phone', label: 'ফোন নম্বর', placeholder: '01XXXXXXXXX', type: 'tel', required: true },
            { key: 'subject', label: '📚 বিষয়', placeholder: 'গণিত / ইংরেজি / পদার্থবিজ্ঞান', type: 'text', required: true },
            { key: 'class_range', label: '📖 ক্লাস', placeholder: 'ক্লাস ৬ - ১০', type: 'text' },
            { key: 'fee', label: '💰 বেতন (মাসিক)', placeholder: '২,০০০ টাকা', type: 'text', highlight: true },
            { key: 'timing', label: '⏰ পড়ানোর সময়', placeholder: 'বিকাল ৪টা - রাত ৮টা', type: 'text', highlight: true },
            { key: 'address', label: 'ঠিকানা', placeholder: 'ব্যাচের ঠিকানা', type: 'text' },
            { key: 'tuition_type', label: 'পড়ানোর ধরন', placeholder: '', type: 'select', options: ['ব্যাচ', 'প্রাইভেট (বাসায়)', 'অনলাইন', 'কোচিং সেন্টার'] },
            { key: 'description', label: 'বিবরণ', placeholder: 'অভিজ্ঞতা, ফলাফল ইত্যাদি', type: 'textarea' },
        ],
    },
    'আজকের খবর': {
        nameKey: 'title',
        fields: [
            { key: 'title', label: 'খবরের শিরোনাম', placeholder: 'শিরোনাম লিখুন', type: 'text', required: true },
            { key: 'news_source', label: '📰 সূত্র', placeholder: 'প্রথম আলো / কালের কণ্ঠ', type: 'text' },
            { key: 'description', label: 'বিস্তারিত খবর', placeholder: 'খবরের বিবরণ লিখুন', type: 'textarea', required: true },
        ],
    },
    'আমাদের জেলা': {
        nameKey: 'title',
        fields: [
            { key: 'title', label: 'শিরোনাম', placeholder: 'জেলার ইতিহাস / জেলা প্রশাসক', type: 'text', required: true },
            { key: 'description', label: 'বিবরণ', placeholder: 'বিস্তারিত তথ্য লিখুন', type: 'textarea', required: true },
        ],
    },
};

// Default config for unknown categories
const DEFAULT_CONFIG: CategoryConfig = {
    nameKey: 'title',
    fields: [
        { key: 'title', label: 'শিরোনাম / নাম', placeholder: 'শিরোনাম লিখুন', type: 'text', required: true },
        { key: 'phone', label: 'ফোন নম্বর', placeholder: '01XXXXXXXXX', type: 'tel' },
        { key: 'address', label: 'ঠিকানা', placeholder: 'ঠিকানা লিখুন', type: 'text' },
        { key: 'description', label: 'বিবরণ', placeholder: 'অতিরিক্ত তথ্য', type: 'textarea' },
    ],
};

export function getCategoryConfig(categoryName: string): CategoryConfig {
    return CATEGORY_FIELDS[categoryName] || DEFAULT_CONFIG;
}

export function getStandardFields(config: CategoryConfig): string[] {
    // Fields that map to content table columns directly
    return ['title', 'phone', 'address', 'description'];
}

export function getExtraFields(config: CategoryConfig): CategoryField[] {
    const standard = ['title', 'phone', 'address', 'description'];
    return config.fields.filter(f => !standard.includes(f.key));
}
