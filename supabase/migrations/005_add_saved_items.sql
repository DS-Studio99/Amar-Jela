-- Saved Items Table
CREATE TABLE IF NOT EXISTS public.saved_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content_id UUID REFERENCES public.content(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, content_id)
);

-- RLS Policies
ALTER TABLE public.saved_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see their own saved items"
ON public.saved_items FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved items"
ON public.saved_items FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved items"
ON public.saved_items FOR DELETE
USING (auth.uid() = user_id);
