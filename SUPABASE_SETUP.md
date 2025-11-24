# Create user_profiles Table in Supabase

**The `user_profiles` table doesn't exist in production yet. Here's how to fix it:**

## Option 1: Run SQL in Supabase Dashboard (RECOMMENDED)

1. Go to https://supabase.com/dashboard/project/vmmnuwxoiwivdmvhrhqz
2. Click "SQL Editor" in the left sidebar
3. Click "New Query"
4. Paste this SQL and click "Run":

```sql
-- User Profiles for personalization
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  first_name TEXT,
  timezone TEXT DEFAULT 'America/New_York',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = user_id);
```

## Option 2: Use Migration File

The migration exists at `supabase/migrations/20250124000001_add_user_profiles.sql`.

To apply it, you would normally run:
```bash
supabase db push
```

But this requires Supabase CLI setup with your project.

##After Creating the Table

1. Redeploy the app (it's already configured to use this table)
2. New users will have their names saved and displayed
3. Existing users can re-enter their name via Settings (when implemented)

---

**For now, the app works fine without this table** - it just shows the email prefix instead of first name.
