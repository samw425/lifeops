'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'


export default function MorningCheckIn({ focusAreas, goals }: { focusAreas: any[], goals: any[] }) {
    const [mood, setMood] = useState(3)
    const [energy, setEnergy] = useState(3)
    const [brainDump, setBrainDump] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleSubmit = async () => {
        setLoading(true)

        // 1. Save Check-in
        const { data: checkIn, error } = await supabase
            .from('daily_checkins')
            .insert({
                date: new Date().toISOString().split('T')[0],
                mood,
                energy,
                brain_dump: brainDump,
            })
            .select()
            .single()

        if (error) {
            console.error(error)
            setLoading(false)
            return
        }

        // 2. Generate Priorities via AI
        const response = await fetch('/api/ai/morning_priorities', {
            method: 'POST',
            body: JSON.stringify({ brainDump, focusAreas, goals }),
        })

        const { priorities } = await response.json()

        // 3. Save Priorities
        await supabase.from('daily_priorities').insert(
            priorities.map((title: string) => ({
                checkin_id: checkIn.id,
                title,
                focus_area_id: focusAreas[0]?.id // Default to first for now, user can change
            }))
        )

        router.refresh()
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">Morning Check-in</h1>
                <p className="text-muted-foreground">Clarity You Can Live In.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>How are you feeling?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Mood (1-5)</label>
                        <input
                            type="range" min="1" max="5"
                            value={mood} onChange={(e) => setMood(parseInt(e.target.value))}
                            className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Drained</span>
                            <span>Great</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Energy (1-5)</label>
                        <input
                            type="range" min="1" max="5"
                            value={energy} onChange={(e) => setEnergy(parseInt(e.target.value))}
                            className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Low</span>
                            <span>High</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Brain Dump</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        What's on your mind? Don't filter. The AI will help you find clarity.
                    </p>
                    <textarea
                        className="w-full min-h-[150px] p-3 rounded-md border bg-background"
                        placeholder="I need to finish that report, call mom, and I'm worried about the exam..."
                        value={brainDump}
                        onChange={(e) => setBrainDump(e.target.value)}
                    />
                    <Button onClick={handleSubmit} disabled={loading || !brainDump} className="w-full">
                        {loading ? 'Generating Clarity...' : 'Turn into Priorities'}
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
