const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://vmmnuwxoiwivdmvhrhqz.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtbW51d3hvaWdpdmRtdmhyaHF6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mzg1NTQ5NCwiZXhwIjoyMDc5NDMxNDk0fQ.eh7cVzi52misacLXcnNKVMahRL13u0GEx0ReDerzsIg'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

async function createTable() {
    console.log('Creating user_profiles table...')

    // Create table with service role (bypasses RLS)
    const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .limit(1)

    if (error && error.message.includes('does not exist')) {
        console.log('Table does not exist, needs manual creation')
        console.log('\nPlease run this SQL in Supabase dashboard:')
        console.log('https://supabase.com/dashboard/project/vmmnuwxoiwivdmvhrhqz/editor')
        console.log('\n--- SQL START ---')
        console.log(`
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  first_name TEXT,
  timezone TEXT DEFAULT 'America/New_York',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = user_id);
    `)
        console.log('--- SQL END ---\n')
    } else if (error) {
        console.error('Error checking table:', error)
    } else {
        console.log('✅ Table exists!', data)
    }
}

createTable()
