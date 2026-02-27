-- Update Profiles Role Check to include district_admin
ALTER TABLE public.profiles DROP CONSTRAINT profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('user', 'admin', 'district_admin'));

-- Content Table RLS for District Admins
-- (They can update and delete content in their own district)
CREATE POLICY "content_select_district_admin" ON public.content FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'district_admin' AND district_id = content.district_id)
);

CREATE POLICY "content_update_district_admin" ON public.content FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'district_admin' AND district_id = content.district_id)
);

CREATE POLICY "content_delete_district_admin" ON public.content FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'district_admin' AND district_id = content.district_id)
);

-- Banners Table RLS for District Admins
-- (They can manage banners in their own district)
CREATE POLICY "banners_select_district_admin" ON public.banners FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'district_admin' AND district_id = banners.district_id)
);

CREATE POLICY "banners_all_district_admin" ON public.banners FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'district_admin' AND district_id = banners.district_id)
);
