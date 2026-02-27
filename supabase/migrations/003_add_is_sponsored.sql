ALTER TABLE public.content ADD COLUMN IF NOT EXISTS is_sponsored BOOLEAN DEFAULT false;
