'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, Circle } from 'lucide-react'

export default function TodayView({ checkIn, priorities }: { checkIn: any, priorities: any[] }) {
    const router = useRouter()
    const supabase = createClient()

    const togglePriority = async (id: string, currentStatus: boolean) => {
        await supabase
            .from('daily_priorities')
            .update({ is_completed: !currentStatus })
            .eq('id', id)

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

            <Card>
                <CardHeader>
                    <CardTitle>Priorities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {priorities.map((priority) => (
                        <div
                            key={priority.id}
                            className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
                            onClick={() => togglePriority(priority.id, priority.is_completed)}
                        >
                            {priority.is_completed ? (
                                <CheckCircle2 className="h-6 w-6 text-primary" />
                            ) : (
                                <Circle className="h-6 w-6 text-muted-foreground" />
                            )}
                            <span className={priority.is_completed ? 'line-through text-muted-foreground' : ''}>
                                {priority.title}
                            </span>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-24 flex flex-col gap-2">
                    <span className="text-lg font-bold">Log Focus Block</span>
                    <span className="text-xs text-muted-foreground">Track your attention</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col gap-2">
                    <span className="text-lg font-bold">Night Review</span>
                    <span className="text-xs text-muted-foreground">Close the loop</span>
                </Button>
            </div>
        </div>
    )
}
