-- Add app_settings table for developer info and other app-wide settings
CREATE TABLE IF NOT EXISTS app_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default developer info
INSERT INTO app_settings (key, value) VALUES
('developer_info', '{
    "name": "ডেভেলপার",
    "title": "Full Stack Developer",
    "bio": "আমার জেলা অ্যাপের ডেভেলপার।",
    "email": "",
    "phone": "",
    "website": "",
    "facebook": "",
    "github": "",
    "linkedin": "",
    "avatar_url": "",
    "skills": ["Next.js", "React", "Supabase", "TypeScript"]
}')
ON CONFLICT (key) DO NOTHING;

-- Add RLS policies
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read app settings" ON app_settings FOR SELECT USING (true);
CREATE POLICY "Only admins can update app settings" ON app_settings FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Only admins can insert app settings" ON app_settings FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
