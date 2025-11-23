
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing environment variables')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

async function createDemoUser() {
    const email = 'demo@lifeops.app'
    const password = 'lifeops-demo-user'

    console.log(`Attempting to create user: ${email}`)

    // Check if user exists first
    const { data: existingUsers, error: searchError } = await supabase.auth.admin.listUsers()

    if (searchError) {
        console.error('Error listing users:', searchError)
        return
    }

    const existingUser = existingUsers.users.find(u => u.email === email)

    if (existingUser) {
        console.log('User already exists. Updating password to ensure access...')
        const { error: updateError } = await supabase.auth.admin.updateUserById(
            existingUser.id,
            { password: password, email_confirm: true }
        )
        if (updateError) {
            console.error('Error updating user:', updateError)
        } else {
            console.log('User updated successfully.')
        }
        return
    }

    const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true // Auto-confirm the email
    })

    if (error) {
        console.error('Error creating user:', error)
    } else {
        console.log('Demo user created successfully:', data.user.id)
    }
}

createDemoUser()
