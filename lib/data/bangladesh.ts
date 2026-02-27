import { Division, District } from '@/types';

export const BD_DIVISIONS: Division[] = [
    {
        id: 'dhaka', name: 'ঢাকা', nameEn: 'Dhaka',
        districts: [
            { id: 'dhaka_city', name: 'ঢাকা', nameEn: 'Dhaka', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop', thanas: ['মিরপুর', 'গুলশান', 'উত্তরা', 'মোহাম্মদপুর', 'ধানমন্ডি', 'রমনা', 'লালবাগ', 'ডেমরা', 'যাত্রাবাড়ি', 'সবুজবাগ', 'খিলগাঁও', 'পল্লবী', 'বাড্ডা', 'কাফরুল', 'তেজগাঁও', 'হাজারীবাগ', 'ক্যান্টনমেন্ট'] },
            { id: 'gazipur', name: 'গাজীপুর', nameEn: 'Gazipur', image: 'https://images.unsplash.com/photo-1567446537708-ac4aa75c9c28?w=800&auto=format&fit=crop', thanas: ['গাজীপুর সদর', 'কালীগঞ্জ', 'কাপাসিয়া', 'শ্রীপুর', 'টঙ্গী'] },
            { id: 'manikganj', name: 'মানিকগঞ্জ', nameEn: 'Manikganj', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop', thanas: ['মানিকগঞ্জ সদর', 'সিঙ্গাইর', 'শিবালয়', 'ঘিওর', 'দৌলতপুর', 'হরিরামপুর', 'সাটুরিয়া'] },
            { id: 'munshiganj', name: 'মুন্সিগঞ্জ', nameEn: 'Munshiganj', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop', thanas: ['মুন্সিগঞ্জ সদর', 'লৌহজং', 'টঙ্গীবাড়ি', 'শ্রীনগর', 'সিরাজদিখান', 'গজারিয়া'] },
            { id: 'narayanganj', name: 'নারায়ণগঞ্জ', nameEn: 'Narayanganj', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop', thanas: ['নারায়ণগঞ্জ সদর', 'বন্দর', 'আড়াইহাজার', 'রূপগঞ্জ', 'সোনারগাঁ'] },
            { id: 'narsingdi', name: 'নরসিংদী', nameEn: 'Narsingdi', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop', thanas: ['নরসিংদী সদর', 'বেলাব', 'মনোহরদি', 'পলাশ', 'রায়পুরা', 'শিবপুর'] },
            { id: 'faridpur', name: 'ফরিদপুর', nameEn: 'Faridpur', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop', thanas: ['ফরিদপুর সদর', 'আলফাডাঙ্গা', 'বোয়ালমারী', 'ভাঙ্গা', 'মধুখালী', 'নগরকান্দা', 'সদরপুর', 'সালথা', 'চরভদ্রাসন'] },
            { id: 'gopalganj', name: 'গোপালগঞ্জ', nameEn: 'Gopalganj', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop', thanas: ['গোপালগঞ্জ সদর', 'কাশিয়ানী', 'কোটালীপাড়া', 'মুকসুদপুর', 'টুঙ্গিপাড়া'] },
            { id: 'madaripur', name: 'মাদারীপুর', nameEn: 'Madaripur', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop', thanas: ['মাদারীপুর সদর', 'কালকিনি', 'রাজৈর', 'শিবচর'] },
            { id: 'shariatpur', name: 'শরীয়তপুর', nameEn: 'Shariatpur', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop', thanas: ['পালং', 'নড়িয়া', 'জাজিরা', 'গোসাইরহাট', 'ভেদরগঞ্জ', 'ডামুড্যা'] },
            { id: 'kishoreganj', name: 'কিশোরগঞ্জ', nameEn: 'Kishoreganj', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop', thanas: ['কিশোরগঞ্জ সদর', 'অষ্টগ্রাম', 'বাজিতপুর', 'ভৈরব', 'হোসেনপুর', 'ইটনা', 'করিমগঞ্জ', 'কটিয়াদী', 'মিঠামইন', 'নিকলি', 'পাকুন্দিয়া', 'তাড়াইল'] },
            { id: 'tangail', name: 'টাঙ্গাইল', nameEn: 'Tangail', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop', thanas: ['টাঙ্গাইল সদর', 'বাসাইল', 'ভূঞাপুর', 'দেলদুয়ার', 'ঘাটাইল', 'গোপালপুর', 'কালিহাতী', 'মধুপুর', 'মির্জাপুর', 'নাগরপুর', 'সখিপুর', 'ধনবাড়ী'] },
        ]
    },
    {
        id: 'chittagong', name: 'চট্টগ্রাম', nameEn: 'Chittagong',
        districts: [
            { id: 'chittagong_city', name: 'চট্টগ্রাম', nameEn: 'Chittagong', image: 'https://images.unsplash.com/photo-1578895101408-1a36b37a94ad?w=800&auto=format&fit=crop', thanas: ['পাঁচলাইশ', 'বায়েজিদ', 'বাকলিয়া', 'বন্দর', 'চান্দগাঁও', 'ডাবলমুরিং', 'ইপিজেড', 'হালিশহর', 'হাটহাজারী', 'কোতওয়ালি', 'পতেঙ্গা', 'রাউজান'] },
            { id: 'coxsbazar', name: 'কক্সবাজার', nameEn: "Cox's Bazar", image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&auto=format&fit=crop', thanas: ['কক্সবাজার সদর', 'চকরিয়া', 'কুতুবদিয়া', 'মহেশখালী', 'পেকুয়া', 'রামু', 'টেকনাফ', 'উখিয়া'] },
            { id: 'comilla', name: 'কুমিল্লা', nameEn: 'Comilla', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop', thanas: ['কুমিল্লা সদর', 'বরুড়া', 'ব্রাহ্মণপাড়া', 'বুড়িচং', 'চান্দিনা', 'চৌদ্দগ্রাম', 'দাউদকান্দি', 'দেবিদ্বার', 'হোমনা', 'লাকসাম', 'লালমাই', 'মনোহরগঞ্জ', 'মেঘনা', 'মুরাদনগর', 'নাঙ্গলকোট', 'তিতাস'] },
            { id: 'noakhali', name: 'নোয়াখালী', nameEn: 'Noakhali', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop', thanas: ['নোয়াখালী সদর', 'বেগমগঞ্জ', 'চাটখিল', 'কোম্পানীগঞ্জ', 'হাতিয়া', 'কবিরহাট', 'সেনবাগ', 'সোনাইমুড়ী', 'সুবর্ণচর'] },
            { id: 'feni', name: 'ফেনী', nameEn: 'Feni', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop', thanas: ['ফেনী সদর', 'ছাগলনাইয়া', 'দাগনভূঞা', 'ফুলগাজী', 'পরশুরাম', 'সোনাগাজী'] },
            { id: 'brahmanbaria', name: 'ব্রাহ্মণবাড়িয়া', nameEn: 'Brahmanbaria', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop', thanas: ['ব্রাহ্মণবাড়িয়া সদর', 'আখাউড়া', 'আশুগঞ্জ', 'বাঞ্ছারামপুর', 'বিজয়নগর', 'কসবা', 'নাসিরনগর', 'নবীনগর', 'সরাইল'] },
            { id: 'chandpur', name: 'চাঁদপুর', nameEn: 'Chandpur', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop', thanas: ['চাঁদপুর সদর', 'ফরিদগঞ্জ', 'হাইমচর', 'হাজীগঞ্জ', 'কচুয়া', 'মতলব উত্তর', 'মতলব দক্ষিণ', 'শাহরাস্তি'] },
            { id: 'lakshmipur', name: 'লক্ষ্মীপুর', nameEn: 'Lakshmipur', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop', thanas: ['লক্ষ্মীপুর সদর', 'কমলনগর', 'রামগঞ্জ', 'রামগতি', 'রায়পুর'] },
            { id: 'rangamati', name: 'রাঙ্গামাটি', nameEn: 'Rangamati', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop', thanas: ['রাঙ্গামাটি সদর', 'বাঘাইছড়ি', 'বরকল', 'বিলাইছড়ি', 'জুরাছড়ি', 'কাউখালী', 'কাপ্তাই', 'লংগদু', 'নানিয়ারচর', 'রাজস্থলী'] },
            { id: 'bandarban', name: 'বান্দরবান', nameEn: 'Bandarban', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop', thanas: ['বান্দরবান সদর', 'আলীকদম', 'লামা', 'নাইক্ষ্যংছড়ি', 'রোয়াংছড়ি', 'রুমা', 'থানচি'] },
            { id: 'khagrachhari', name: 'খাগড়াছড়ি', nameEn: 'Khagrachhari', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop', thanas: ['খাগড়াছড়ি সদর', 'দিঘিনালা', 'গুইমারা', 'লক্ষ্মীছড়ি', 'মহালছড়ি', 'মানিকছড়ি', 'মাটিরাঙ্গা', 'পানছড়ি', 'রামগড়'] },
        ]
    },
    {
        id: 'rajshahi', name: 'রাজশাহী', nameEn: 'Rajshahi',
        districts: [
            { id: 'rajshahi_city', name: 'রাজশাহী', nameEn: 'Rajshahi', image: 'https://images.unsplash.com/photo-1542640244-7e672d6cef4e?w=800&auto=format&fit=crop', thanas: ['রাজশাহী সদর', 'বাঘা', 'বাগমারা', 'চারঘাট', 'দুর্গাপুর', 'গোদাগাড়ী', 'মোহনপুর', 'পবা', 'পুঠিয়া', 'তানোর'] },
            { id: 'bogra', name: 'বগুড়া', nameEn: 'Bogra', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop', thanas: ['বগুড়া সদর', 'আদমদিঘী', 'ধুনট', 'দুপচাঁচিয়া', 'গাবতলী', 'কাহালু', 'নন্দীগ্রাম', 'সারিয়াকান্দি', 'শাহজাহানপুর', 'শেরপুর', 'শিবগঞ্জ', 'সোনাতলা'] },
            { id: 'naogaon', name: 'নওগাঁ', nameEn: 'Naogaon', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop', thanas: ['নওগাঁ সদর', 'আত্রাই', 'বদলগাছি', 'ধামইরহাট', 'মহাদেবপুর', 'মান্দা', 'নিয়ামতপুর', 'পত্নীতলা', 'পোরশা', 'রাণীনগর', 'সাপাহার'] },
            { id: 'natore', name: 'নাটোর', nameEn: 'Natore', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop', thanas: ['নাটোর সদর', 'বড়াইগ্রাম', 'গুরুদাসপুর', 'লালপুর', 'সিংড়া', 'বাগাতিপাড়া'] },
            { id: 'pabna', name: 'পাবনা', nameEn: 'Pabna', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop', thanas: ['পাবনা সদর', 'আটঘরিয়া', 'বেড়া', 'ভাঙ্গুড়া', 'চাটমোহর', 'ফরিদপুর', 'ঈশ্বরদী', 'সাঁথিয়া', 'সুজানগর'] },
            { id: 'sirajganj', name: 'সিরাজগঞ্জ', nameEn: 'Sirajganj', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop', thanas: ['সিরাজগঞ্জ সদর', 'বেলকুচি', 'চৌহালী', 'কামারখন্দ', 'কাজীপুর', 'রায়গঞ্জ', 'শাহজাদপুর', 'তাড়াশ', 'উল্লাপাড়া'] },
            { id: 'chapainawabganj', name: 'চাঁপাইনবাবগঞ্জ', nameEn: 'Chapainawabganj', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop', thanas: ['চাঁপাইনবাবগঞ্জ সদর', 'ভোলাহাট', 'গোমস্তাপুর', 'নাচোল', 'শিবগঞ্জ'] },
            { id: 'joypurhat', name: 'জয়পুরহাট', nameEn: 'Joypurhat', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop', thanas: ['জয়পুরহাট সদর', 'আক্কেলপুর', 'কালাই', 'ক্ষেতলাল', 'পাঁচবিবি'] },
        ]
    },
    {
        id: 'khulna', name: 'খুলনা', nameEn: 'Khulna',
        districts: [
            { id: 'khulna_city', name: 'খুলনা', nameEn: 'Khulna', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop', thanas: ['খুলনা সদর', 'বটিয়াঘাটা', 'দাকোপ', 'ডুমুরিয়া', 'দিঘলিয়া', 'কয়রা', 'পাইকগাছা', 'ফুলতলা', 'তেরখাদা'] },
            { id: 'jessore', name: 'যশোর', nameEn: 'Jessore', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop', thanas: ['যশোর সদর', 'অভয়নগর', 'বাঘারপাড়া', 'চৌগাছা', 'ঝিকরগাছা', 'কেশবপুর', 'মণিরামপুর', 'শার্শা'] },
            { id: 'satkhira', name: 'সাতক্ষীরা', nameEn: 'Satkhira', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop', thanas: ['সাতক্ষীরা সদর', 'আশাশুনি', 'দেবহাটা', 'কালীগঞ্জ', 'কলারোয়া', 'শ্যামনগর', 'তালা'] },
            { id: 'kushtia', name: 'কুষ্টিয়া', nameEn: 'Kushtia', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop', thanas: ['কুষ্টিয়া সদর', 'ভেড়ামারা', 'দৌলতপুর', 'খোকসা', 'কুমারখালী', 'মিরপুর'] },
            { id: 'bagerhat', name: 'বাগেরহাট', nameEn: 'Bagerhat', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop', thanas: ['বাগেরহাট সদর', 'চিতলমারী', 'ফকিরহাট', 'কচুয়া', 'মোল্লাহাট', 'মোংলা', 'মোড়েলগঞ্জ', 'রামপাল', 'শরণখোলা'] },
            { id: 'narail', name: 'নড়াইল', nameEn: 'Narail', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop', thanas: ['নড়াইল সদর', 'কালিয়া', 'লোহাগড়া'] },
            { id: 'jhenaidah', name: 'ঝিনাইদহ', nameEn: 'Jhenaidah', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop', thanas: ['ঝিনাইদহ সদর', 'হরিণাকুন্ডু', 'কালীগঞ্জ', 'কোটচাঁদপুর', 'মহেশপুর', 'শৈলকুপা'] },
            { id: 'magura', name: 'মাগুরা', nameEn: 'Magura', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop', thanas: ['মাগুরা সদর', 'মোহাম্মদপুর', 'শালিখা', 'শ্রীপুর'] },
            { id: 'meherpur', name: 'মেহেরপুর', nameEn: 'Meherpur', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop', thanas: ['মেহেরপুর সদর', 'গাংনী', 'মুজিবনগর'] },
            { id: 'chuadanga', name: 'চুয়াডাঙ্গা', nameEn: 'Chuadanga', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop', thanas: ['চুয়াডাঙ্গা সদর', 'আলমডাঙা', 'দামুড়হুদা', 'জীবননগর'] },
        ]
    },
    {
        id: 'barisal', name: 'বরিশাল', nameEn: 'Barisal',
        districts: [
            { id: 'barisal_city', name: 'বরিশাল', nameEn: 'Barisal', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop', thanas: ['বরিশাল সদর', 'আগৈলঝাড়া', 'বাকেরগঞ্জ', 'বানারীপাড়া', 'বাবুগঞ্জ', 'গৌরনদী', 'হিজলা', 'মেহেন্দিগঞ্জ', 'মুলাদী', 'উজিরপুর'] },
            { id: 'bhola', name: 'ভোলা', nameEn: 'Bhola', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop', thanas: ['ভোলা সদর', 'বোরহানউদ্দিন', 'চরফ্যাশন', 'দৌলতখান', 'লালমোহন', 'মনপুরা', 'তজুমদ্দিন'] },
            { id: 'jhalokati', name: 'ঝালকাঠি', nameEn: 'Jhalokati', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop', thanas: ['ঝালকাঠি সদর', 'কাঁঠালিয়া', 'নলছিটি', 'রাজাপুর'] },
            { id: 'patuakhali', name: 'পটুয়াখালী', nameEn: 'Patuakhali', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop', thanas: ['পটুয়াখালী সদর', 'বাউফল', 'দশমিনা', 'কলাপাড়া', 'মির্জাগঞ্জ', 'গলাচিপা', 'রাঙ্গাবালী'] },
            { id: 'pirojpur', name: 'পিরোজপুর', nameEn: 'Pirojpur', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop', thanas: ['পিরোজপুর সদর', 'ভাণ্ডারিয়া', 'কাউখালী', 'মঠবাড়িয়া', 'নাজিরপুর', 'জিয়ানগর'] },
            { id: 'barguna', name: 'বরগুনা', nameEn: 'Barguna', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop', thanas: ['বরগুনা সদর', 'আমতলী', 'বামনা', 'বেতাগী', 'পাথরঘাটা', 'তালতলী'] },
        ]
    },
    {
        id: 'sylhet', name: 'সিলেট', nameEn: 'Sylhet',
        districts: [
            { id: 'sylhet_city', name: 'সিলেট', nameEn: 'Sylhet', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop', thanas: ['সিলেট সদর', 'বালাগঞ্জ', 'বিশ্বনাথ', 'কোম্পানীগঞ্জ', 'ফেঞ্চুগঞ্জ', 'গোয়াইনঘাট', 'গোলাপগঞ্জ', 'জকিগঞ্জ', 'কানাইঘাট', 'ওসমানীনগর', 'দক্ষিণ সুরমা', 'জৈন্তাপুর'] },
            { id: 'habiganj', name: 'হবিগঞ্জ', nameEn: 'Habiganj', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop', thanas: ['হবিগঞ্জ সদর', 'আজমিরীগঞ্জ', 'বাহুবল', 'বানিয়াচং', 'চুনারুঘাট', 'লাখাই', 'মাধবপুর', 'নবীগঞ্জ'] },
            { id: 'moulvibazar', name: 'মৌলভীবাজার', nameEn: 'Moulvibazar', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop', thanas: ['মৌলভীবাজার সদর', 'বড়লেখা', 'জুড়ী', 'কমলগঞ্জ', 'কুলাউড়া', 'রাজনগর', 'শ্রীমঙ্গল'] },
            { id: 'sunamganj', name: 'সুনামগঞ্জ', nameEn: 'Sunamganj', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop', thanas: ['সুনামগঞ্জ সদর', 'বিশ্বম্ভরপুর', 'ছাতক', 'দিরাই', 'দোয়ারাবাজার', 'জামালগঞ্জ', 'জগন্নাথপুর', 'তাহিরপুর', 'ধর্মপাশা', 'শাল্লা'] },
        ]
    },
    {
        id: 'rangpur', name: 'রংপুর', nameEn: 'Rangpur',
        districts: [
            { id: 'rangpur_city', name: 'রংপুর', nameEn: 'Rangpur', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop', thanas: ['রংপুর সদর', 'বদরগঞ্জ', 'গঙ্গাচড়া', 'কাউনিয়া', 'মিঠাপুকুর', 'পীরগঞ্জ', 'পীরগাছা', 'তারাগঞ্জ'] },
            { id: 'dinajpur', name: 'দিনাজপুর', nameEn: 'Dinajpur', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop', thanas: ['দিনাজপুর সদর', 'বিরামপুর', 'বিরল', 'বোচাগঞ্জ', 'চিরিরবন্দর', 'ফুলবাড়ী', 'ঘোড়াঘাট', 'হাকিমপুর', 'খানসামা', 'নবাবগঞ্জ', 'পার্বতীপুর'] },
            { id: 'gaibandha', name: 'গাইবান্ধা', nameEn: 'Gaibandha', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop', thanas: ['গাইবান্ধা সদর', 'ফুলছড়ি', 'গোবিন্দগঞ্জ', 'পলাশবাড়ী', 'সাঘাটা', 'সাদুল্যাপুর', 'সুন্দরগঞ্জ'] },
            { id: 'kurigram', name: 'কুড়িগ্রাম', nameEn: 'Kurigram', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop', thanas: ['কুড়িগ্রাম সদর', 'ভূরুঙ্গামারী', 'চর রাজিবপুর', 'চিলমারী', 'ফুলবাড়ী', 'নাগেশ্বরী', 'রাজারহাট', 'রৌমারী', 'উলিপুর'] },
            { id: 'lalmonirhat', name: 'লালমনিরহাট', nameEn: 'Lalmonirhat', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop', thanas: ['লালমনিরহাট সদর', 'আদিতমারী', 'হাতীবান্ধা', 'কালীগঞ্জ', 'পাটগ্রাম'] },
            { id: 'nilphamari', name: 'নীলফামারী', nameEn: 'Nilphamari', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop', thanas: ['নীলফামারী সদর', 'ডিমলা', 'ডোমার', 'জলঢাকা', 'কিশোরগঞ্জ', 'সৈয়দপুর'] },
            { id: 'panchagarh', name: 'পঞ্চগড়', nameEn: 'Panchagarh', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop', thanas: ['পঞ্চগড় সদর', 'আটোয়ারী', 'বোদা', 'দেবীগঞ্জ', 'তেতুলিয়া'] },
            { id: 'thakurgaon', name: 'ঠাকুরগাঁও', nameEn: 'Thakurgaon', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop', thanas: ['ঠাকুরগাঁও সদর', 'বালিয়াডাঙ্গী', 'হরিপুর', 'পীরগঞ্জ', 'রাণীশংকৈল'] },
        ]
    },
    {
        id: 'mymensingh', name: 'ময়মনসিংহ', nameEn: 'Mymensingh',
        districts: [
            { id: 'mymensingh_city', name: 'ময়মনসিংহ', nameEn: 'Mymensingh', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop', thanas: ['ময়মনসিংহ সদর', 'ভালুকা', 'ধোবাউড়া', 'ফুলবাড়ীয়া', 'ফুলপুর', 'গফরগাঁও', 'গৌরীপুর', 'হালুয়াঘাট', 'ঈশ্বরগঞ্জ', 'মুক্তাগাছা', 'নান্দাইল', 'তারাকান্দা', 'ত্রিশাল'] },
            { id: 'jamalpur', name: 'জামালপুর', nameEn: 'Jamalpur', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop', thanas: ['জামালপুর সদর', 'বকশীগঞ্জ', 'দেওয়ানগঞ্জ', 'ইসলামপুর', 'মাদারগঞ্জ', 'মেলান্দহ', 'সরিষাবাড়ী'] },
            { id: 'netrokona', name: 'নেত্রকোণা', nameEn: 'Netrokona', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop', thanas: ['নেত্রকোণা সদর', 'আটপাড়া', 'বারহাট্টা', 'দুর্গাপুর', 'কলমাকান্দা', 'কেন্দুয়া', 'খালিয়াজুরী', 'মদন', 'মোহনগঞ্জ', 'পূর্বধলা'] },
            { id: 'sherpur', name: 'শেরপুর', nameEn: 'Sherpur', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop', thanas: ['শেরপুর সদর', 'ঝিনাইগাতী', 'নকলা', 'নালিতাবাড়ী', 'শ্রীবরদী'] },
        ]
    },
];

export function getDivision(id: string): Division | undefined {
    return BD_DIVISIONS.find(d => d.id === id);
}

export function getDistrict(distId: string): (District & { divisionId: string; divisionName: string }) | undefined {
    for (const div of BD_DIVISIONS) {
        const dist = div.districts.find(d => d.id === distId);
        if (dist) return { ...dist, divisionId: div.id, divisionName: div.name };
    }
    return undefined;
}
