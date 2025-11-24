# Create user_profiles Table - MANUAL SETUP REQUIRED

## ⚠️ CRITICAL: Run This SQL in Supabase Dashboard

The app is fully functional except name personalization requires this table.

### Steps:
1. Go to: https://supabase.com/dashboard/project/vmmnuwxoiwivdmvhrhqz/editor
2. Click **"SQL Editor"** in left sidebar
3. Click **"New Query"**
4. Paste the SQL below
5. Click **"Run"** (or press Cmd+Enter)

### SQL to Run:

```sql
-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  first_name TEXT,
  timezone TEXT DEFAULT 'America/New_York',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

-- Create policies
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = user_id);
```

### After Running:
- ✅ Onboarding tour will save names
- ✅ Dashboard will show "Good Morning, [Name]"
- ✅ Settings page will let users edit their name
- ✅ App is production-ready

**This takes 30 seconds and is the only manual step required.**
