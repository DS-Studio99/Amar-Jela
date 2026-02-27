CREATE TABLE reports (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    content_id uuid REFERENCES content(id) ON DELETE CASCADE,
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    reason text NOT NULL,
    status text DEFAULT 'pending',
    created_at timestamptz DEFAULT now()
);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert reports"
    ON reports FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view reports"
    ON reports FOR SELECT
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'district_admin')));

CREATE POLICY "Admins can update reports"
    ON reports FOR UPDATE
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'district_admin')));
