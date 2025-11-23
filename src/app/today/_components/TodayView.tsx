'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, Circle, Clock, Sparkles } from 'lucide-react'
import FocusBlockModal, { type FocusBlockData } from '@/components/FocusBlockModal'
import NightReview from './NightReview'

export default function TodayView({ checkIn, priorities, focusAreas }: { checkIn: any, priorities: any[], focusAreas: any[] }) {
    const [showFocusModal, setShowFocusModal] = useState(false)
    const [showNightReview, setShowNightReview] = useState(false)
    const [coachingTip, setCoachingTip] = useState<string | null>(null)
    const [tipLoading, setTipLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const completedCount = priorities.filter(p => p.is_completed).length
    const isEvening = new Date().getHours() >= 17

    useEffect(() => {
        // Auto-fetch coaching tip on mount if not evening
        if (!isEvening && !checkIn.night_review_completed_at) {
            fetchCoachingTip()
        }
    }, [])

    const fetchCoachingTip = async () => {
        setTipLoading(true)
        try {
            const currentHour = new Date().getHours()
            const timeOfDay = currentHour < 12 ? 'morning' : currentHour < 17 ? 'afternoon' : 'evening'

            const response = await fetch('/api/ai/coaching_tip', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    current_priorities: priorities,
                    mood: checkIn.mood,
                    energy: checkIn.energy,
                    time_of_day: timeOfDay
                })
            })

            const { tip } = await response.json()
            setCoachingTip(tip)
        } catch (error) {
            console.error('Failed to fetch coaching tip:', error)
        } finally {
            setTipLoading(false)
        }
    }

    const togglePriority = async (id: string, currentStatus: boolean) => {
        await supabase
            .from('daily_priorities')
            .update({ is_completed: !currentStatus })
            .eq('id', id)

        router.refresh()
    }

    const saveFocusBlock = async (blockData: FocusBlockData) => {
        const today = new Date().toISOString().split('T')[0]

        await supabase.from('focus_blocks').insert({
            checkin_id: checkIn.id,
            date: today,
            ...blockData
        })

        router.refresh()
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Today's Focus</h1>
                <div className="text-sm text-muted-foreground">
                    Mood: {checkIn.mood}/5 • Energy: {checkIn.energy}/5
                </div>
            </div>

            {/* Progress Indicator */}
            <div className="p-4 rounded-lg bg-secondary/20 border">
                <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">Progress</span>
                    <span className="text-muted-foreground">{completedCount}/{priorities.length} priorities</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${priorities.length > 0 ? (completedCount / priorities.length) * 100 : 0}%` }}
                    />
                </div>
            </div>

            {/* AI Coaching Tip */}
            {coachingTip && (
                <Card className="border-2 border-amber-500/20 bg-amber-500/5 animate-in fade-in slide-in-from-top-2 duration-500">
                    <CardContent className="pt-4">
                        <div className="flex items-start gap-3">
                            <Sparkles className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-foreground/90">{coachingTip}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Priority Cards */}
            <Card>
                <CardHeader>
                    <CardTitle>Today's Priorities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {priorities.map((priority) => (
                        <div
                            key={priority.id}
                            className="flex items-start gap-3 p-4 rounded-lg border hover:bg-accent/50 transition-all cursor-pointer group"
                            onClick={() => togglePriority(priority.id, priority.is_completed)}
                        >
                            <div className="mt-0.5">
                                {priority.is_completed ? (
                                    <CheckCircle2 className="h-6 w-6 text-primary animate-in zoom-in duration-200" />
                                ) : (
                                    <Circle className="h-6 w-6 text-muted-foreground group-hover:text-primary/50 transition-colors" />
                                )}
                            </div>
                            <div className="flex-1">
                                <span className={`text-base ${priority.is_completed ? 'line-through text-muted-foreground' : ''}`}>
                                    {priority.title}
                                </span>
                                {priority.focus_area_id && focusAreas.find(fa => fa.id === priority.focus_area_id) && (
                                    <div className="mt-1 text-xs text-muted-foreground">
                                        {focusAreas.find(fa => fa.id === priority.focus_area_id)?.name}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
                <Button
                    variant="outline"
                    className="h-24 flex flex-col gap-2"
                    onClick={() => setShowFocusModal(true)}
                >
                    <Clock className="h-6 w-6" />
                    <span className="text-sm font-semibold">Log Focus Block</span>
                    <span className="text-xs text-muted-foreground">Track your attention</span>
                </Button>
                <Button
                    variant={isEvening ? "default" : "outline"}
                    className="h-24 flex flex-col gap-2"
                    onClick={() => setShowNightReview(true)}
                    disabled={!isEvening && !checkIn.night_review_completed_at}
                >
                    <span className="text-sm font-semibold">Night Review</span>
                    <span className="text-xs text-muted-foreground">
                        {isEvening ? 'Close the loop' : 'Available after 5 PM'}
                    </span>
                </Button>
            </div>

            {/* Night Review (conditional) */}
            {(showNightReview || checkIn.night_review_completed_at) && (
                <NightReview checkIn={checkIn} />
            )}

            {/* Focus Block Modal */}
            <FocusBlockModal
                isOpen={showFocusModal}
                onClose={() => setShowFocusModal(false)}
                onSave={saveFocusBlock}
                focusAreas={focusAreas}
            />
        </div>
    )
}
