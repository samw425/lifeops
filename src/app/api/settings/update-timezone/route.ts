import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function POST(request: Request) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return new Response('Unauthorized', { status: 401 })
    }

    const formData = await request.formData()
    const timezone = formData.get('timezone') as string

    // Upsert timezone
    const { error } = await supabase
        .from('user_profiles')
        .upsert({
            user_id: user.id,
            timezone,
            updated_at: new Date().toISOString()
        }, {
            onConflict: 'user_id'
        })

    if (error) {
        console.error('Timezone update error:', error)
        return new Response('Error updating timezone', { status: 500 })
    }

    revalidatePath('/settings')
    redirect('/settings')
}
