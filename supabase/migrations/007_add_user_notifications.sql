-- User Notifications Table
CREATE TABLE IF NOT EXISTS public.user_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'system',
    is_read BOOLEAN DEFAULT false,
    action_link TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policies
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
ON public.user_notifications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
ON public.user_notifications FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert notifications"
ON public.user_notifications FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);
