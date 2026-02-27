-- Table for tracking blood requests that need admin approval
CREATE TABLE IF NOT EXISTS blood_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    district_id TEXT NOT NULL,
    blood_group TEXT NOT NULL,
    hospital TEXT NOT NULL,
    phone TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE blood_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert their own requests" ON blood_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can read their own requests" ON blood_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can do everything" ON blood_requests FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Function to handle timestamp update
-- Note: 'trigger_set_timestamp()' does not exist by default. If needed, we must create it first.
-- CREATE TRIGGER set_blood_requests_timestamp
-- BEFORE UPDATE ON blood_requests
-- FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- Extend user_notifications to support advanced popup fields
ALTER TABLE user_notifications
ADD COLUMN IF NOT EXISTS show_as_popup BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS view_duration_seconds INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS is_cancellable BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS district_target TEXT,
ADD COLUMN IF NOT EXISTS division_target TEXT,
ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS popup_views INTEGER DEFAULT 0;
