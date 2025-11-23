import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import MorningCheckIn from './_components/MorningCheckIn'
import TodayView from './_components/TodayView'

export default async function TodayPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const today = new Date().toISOString().split('T')[0]

    // Fetch Check-in
    const { data: checkIn } = await supabase
        .from('daily_checkins')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single()

    // Fetch Focus Areas (needed for check-in)
    const { data: focusAreas } = await supabase
        .from('focus_areas')
        .select('*')
        .eq('user_id', user.id)

    // Fetch Goals (needed for context)
    const { data: goals } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')

    if (!checkIn) {
        return <MorningCheckIn focusAreas={focusAreas || []} goals={goals || []} />
    }

    // Fetch Priorities if check-in exists
    const { data: priorities } = await supabase
        .from('daily_priorities')
        .select('*')
        .eq('checkin_id', checkIn.id)

    return <TodayView checkIn={checkIn} priorities={priorities || []} focusAreas={focusAreas || []} />
}
