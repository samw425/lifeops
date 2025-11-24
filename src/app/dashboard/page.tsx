import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { format } from 'date-fns'
import ThePulse from '@/components/ThePulse'
import { ArrowRight, Battery, Zap } from 'lucide-react'
import OnboardingTour from '@/components/onboarding/OnboardingTour'
import HelpModal from '@/components/HelpModal'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return <div>Please log in</div>
    }

    // Fetch user profile for personalization (gracefully handle if table doesn't exist)
    let displayName = user.email?.split('@')[0] || 'there'
    try {
        const { data: profile } = await supabase
            .from('user_profiles')
            .select('first_name')
            .eq('user_id', user.id)
            .single()

        if (profile?.first_name) {
            displayName = profile.first_name
        }
    } catch (err) {
        // Table doesn't exist yet - use email fallback
    }

    const today = new Date().toISOString().split('T')[0]

    const { data: checkIn } = await supabase
        .from('daily_checkins')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single()

    const currentHour = new Date().getHours()
    const greeting = currentHour < 12 ? 'Morning' : currentHour < 18 ? 'Afternoon' : 'Evening'

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <OnboardingTour />
            <HelpModal />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-foreground">
                        Good {greeting}, {displayName}
                    </h1>
                    <p className="text-muted-foreground mt-1 text-lg">
                        {format(new Date(), 'EEEE, MMMM do')}
                    </p>
                </div>
                <Button variant="glass" size="sm">
                    Settings
                </Button>
            </div>

            {/* Today in one sentence */}
            {checkIn?.ai_summary && (
                <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-white/5 backdrop-blur-md">
                    <p className="text-xl font-medium italic text-center text-white/90">
                        "{checkIn.ai_summary}"
                    </p>
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Status Card */}
                <Card className="relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-amber-400" /> Today's Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {checkIn ? (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm text-muted-foreground">
                                        <span>Mood</span>
                                        <span>{checkIn.mood}/5</span>
                                    </div>
                                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(checkIn.mood / 5) * 100}%` }} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm text-muted-foreground">
                                        <span>Energy</span>
                                        <span>{checkIn.energy}/5</span>
                                    </div>
                                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                        <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(checkIn.energy / 5) * 100}%` }} />
                                    </div>
                                </div>
                                <Button asChild className="w-full mt-4 group-hover:bg-primary/90 transition-colors">
                                    <Link href="/today">View Today <ArrowRight className="ml-2 w-4 h-4" /></Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-muted-foreground text-sm">
                                    Clear your mental RAM. Dump your thoughts, and let AI organize your day.
                                </p>
                                <Button asChild className="w-full shadow-lg shadow-primary/20">
                                    <Link href="/today">Start Morning Check-in</Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pulse Card */}
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl opacity-30 group-hover:opacity-70 blur transition duration-1000 group-hover:duration-200" />
                    <Card className="relative h-full border-0 bg-black/90">
                        <ThePulse energy={checkIn?.energy} mood={checkIn?.mood} />
                    </Card>
                </div>

                {/* Weekly Pulse */}
                <Card>
                    <CardHeader>
                        <CardTitle>Weekly Pulse</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[120px] flex items-center justify-center text-muted-foreground/50 border-2 border-dashed border-white/5 rounded-lg text-sm text-center px-4">
                            Complete 3 daily check-ins to unlock weekly insights.
                        </div>
                        <Button asChild variant="ghost" className="w-full mt-4 hover:bg-white/5">
                            <Link href="/weekly">Go to Weekly Review</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
