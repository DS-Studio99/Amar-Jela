-- Add analytics columns to content table
ALTER TABLE public.content ADD COLUMN IF NOT EXISTS views INT DEFAULT 0;
ALTER TABLE public.content ADD COLUMN IF NOT EXISTS calls INT DEFAULT 0;

-- Create RPC functions to safely increment counters without needing UPDATE permissions

CREATE OR REPLACE FUNCTION increment_content_views(content_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.content SET views = views + 1 WHERE id = content_id;
END;
$$;

CREATE OR REPLACE FUNCTION increment_content_calls(content_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.content SET calls = calls + 1 WHERE id = content_id;
END;
$$;
