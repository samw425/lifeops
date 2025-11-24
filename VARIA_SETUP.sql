-- Varia™ Engine Schema
-- This single table powers the entire platform.

CREATE TABLE IF NOT EXISTS varia_apps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  
  -- The DNA: Defines fields, views, and logic
  -- Example: { "fields": [{ "id": "f1", "type": "text", "label": "Name" }] }
  schema JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- The Memory: Stores all user records for this app
  -- Example: { "records": [{ "id": "r1", "f1": "John Doe" }] }
  data JSONB NOT NULL DEFAULT '{"records": []}'::jsonb,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Security
ALTER TABLE varia_apps ENABLE ROW LEVEL SECURITY;

-- Policies (Users can only touch their own apps)
CREATE POLICY "Users can view own apps"
  ON varia_apps FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create apps"
  ON varia_apps FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own apps"
  ON varia_apps FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own apps"
  ON varia_apps FOR DELETE
  USING (auth.uid() = user_id);

-- Performance Index for JSONB
CREATE INDEX idx_varia_apps_user ON varia_apps(user_id);
CREATE INDEX idx_varia_apps_schema ON varia_apps USING gin (schema);
