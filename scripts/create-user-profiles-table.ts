// Run this to create user_profiles table in production Supabase
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vmmnuwxoiwivdmvhrhqz.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtbW51d3hvaWdpdmRtdmhyaHF6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mzg1NTQ5NCwiZXhwIjoyMDc5NDMxNDk0fQ.eh7cVzi52misacLXcnNKVMahRL13u0GEx0ReDerzsIg'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createUserProfilesTable() {
    console.log('Creating user_profiles table...')

    const { data, error } = await supabase.rpc('exec_sql', {
        sql_query: `
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
        `
    })

    if (error) {
        console.error('Error creating table:', error)

        // Try alternative method - direct SQL via edge function
        console.log('Trying alternative method...')
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
                'apikey': supabaseServiceKey,
                'Authorization': `Bearer ${supabaseServiceKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: `
                    CREATE TABLE IF NOT EXISTS user_profiles (
                      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                      user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
                      first_name TEXT,
                      timezone TEXT DEFAULT 'America/New_York',
                      created_at TIMESTAMPTZ DEFAULT NOW(),
                      updated_at TIMESTAMPTZ DEFAULT NOW()
                    );
                `
            })
        })

        console.log('Response:', await response.text())
    } else {
        console.log('Success!', data)
    }
}

createUserProfilesTable()
