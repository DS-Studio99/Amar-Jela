-- Add ads table for clickable banner ads (300x250)
CREATE TABLE IF NOT EXISTS ads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT,
    image_url TEXT NOT NULL,
    click_url TEXT,
    district_id TEXT,
    is_active BOOLEAN DEFAULT true,
    clicks INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read active ads" ON ads FOR SELECT USING (true);
CREATE POLICY "Only admins can manage ads" ON ads FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Increment clicks function
CREATE OR REPLACE FUNCTION increment_ad_clicks(ad_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE ads SET clicks = clicks + 1 WHERE id = ad_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
