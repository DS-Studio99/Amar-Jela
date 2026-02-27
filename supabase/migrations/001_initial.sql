-- =====================================================
-- Amar Jela — Supabase Database Migration
-- Run this in: Supabase Dashboard → SQL Editor
-- =====================================================

-- 1. PROFILES table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  division_id TEXT NOT NULL,
  district_id TEXT NOT NULL,
  thana TEXT DEFAULT '',
  village TEXT DEFAULT '',
  selected_division_id TEXT NOT NULL,
  selected_district_id TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. CATEGORIES table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '📌',
  group_name TEXT NOT NULL DEFAULT 'সেবা সমূহ',
  color TEXT NOT NULL DEFAULT '#1a9e5c',
  active BOOLEAN NOT NULL DEFAULT true,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. CONTENT table
CREATE TABLE IF NOT EXISTS public.content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  district_id TEXT NOT NULL,
  division_id TEXT NOT NULL,
  title TEXT NOT NULL,
  phone TEXT DEFAULT '',
  address TEXT DEFAULT '',
  description TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  submitted_by_name TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. NOTICES table
CREATE TABLE IF NOT EXISTS public.notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Categories: anyone can read; only admins can mutate (via service role)
CREATE POLICY "categories_select" ON public.categories FOR SELECT USING (true);
CREATE POLICY "categories_all_admin" ON public.categories FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Content: approved content is public; users can insert; admins manage all
CREATE POLICY "content_select_approved" ON public.content FOR SELECT USING (status = 'approved' OR submitted_by = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "content_insert" ON public.content FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "content_update_admin" ON public.content FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "content_delete_admin" ON public.content FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Notices: anyone reads, admins update
CREATE POLICY "notices_select" ON public.notices FOR SELECT USING (true);
CREATE POLICY "notices_all_admin" ON public.notices FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- =====================================================
-- FUNCTION: auto-create profile on signup
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  -- Profile is explicitly inserted from app code with full data
  RETURN NEW;
END;
$$;

-- =====================================================
-- SEED DEFAULT CATEGORIES
-- =====================================================
INSERT INTO public.categories (name, icon, group_name, color, display_order) VALUES
('ডাক্তার', '🩺', 'স্বাস্থ্য ও সেবা', '#4A90D9', 1),
('হাসপাতাল', '🏥', 'স্বাস্থ্য ও সেবা', '#27AE60', 2),
('ডায়াগনস্টিক', '🔬', 'স্বাস্থ্য ও সেবা', '#E74C3C', 3),
('রক্ত', '🩸', 'স্বাস্থ্য ও সেবা', '#C0392B', 4),
('বাসের সময়সূচি', '🚌', 'স্বাস্থ্য ও সেবা', '#F39C12', 5),
('ট্রেনের সময়সূচি', '🚂', 'স্বাস্থ্য ও সেবা', '#8E44AD', 6),
('দর্শনীয় স্থান', '🗺️', 'স্বাস্থ্য ও সেবা', '#2980B9', 7),
('বাসা ভাড়া', '🏠', 'বাসস্থান ও জীবনযাপন', '#16A085', 8),
('শপিং', '🛒', 'বাসস্থান ও জীবনযাপন', '#E91E8C', 9),
('ফায়ার সার্ভিস', '🔥', 'বাসস্থান ও জীবনযাপন', '#E74C3C', 10),
('কুরিয়ার সার্ভিস', '📦', 'বাসস্থান ও জীবনযাপন', '#F39C12', 11),
('থানা-পুলিশ', '👮', 'বাসস্থান ও জীবনযাপন', '#2C3E50', 12),
('বিদ্যুৎ অফিস', '⚡', 'বাসস্থান ও জীবনযাপন', '#F1C40F', 13),
('রেস্টুরেন্ট', '🍽️', 'ব্যবসা ও সেবা', '#E67E22', 14),
('হোটেল', '🏨', 'ব্যবসা ও সেবা', '#9B59B6', 15),
('ওয়েডিং সার্ভিস', '💍', 'ব্যবসা ও সেবা', '#E91E8C', 16),
('গাড়ি ভাড়া', '🚗', 'ব্যবসা ও সেবা', '#27AE60', 17),
('চাকরি', '💼', 'ব্যবসা ও সেবা', '#2980B9', 18),
('উদ্যোক্তা', '💡', 'ব্যবসা ও সেবা', '#F39C12', 19),
('শিক্ষা প্রতিষ্ঠান', '🏫', 'শিক্ষা ও তথ্য', '#3498DB', 20),
('শিক্ষক', '📚', 'শিক্ষা ও তথ্য', '#1ABC9C', 21),
('আজকের খবর', '📰', 'শিক্ষা ও তথ্য', '#E74C3C', 22),
('আমাদের জেলা', '🌐', 'শিক্ষা ও তথ্য', '#2980B9', 23)
ON CONFLICT DO NOTHING;

-- SEED default notice
INSERT INTO public.notices (content) VALUES
('আমার জেলা অ্যাপে আপনাকে স্বাগতম! আপনার জেলার তথ্য যোগ করুন এবং অন্যদের সাহায্য করুন।')
ON CONFLICT DO NOTHING;
