'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, CheckCircle2 } from 'lucide-react'

interface NightReviewProps {
    checkIn: any
}

export default function NightReview({ checkIn }: NightReviewProps) {
    const [whatWentWell, setWhatWentWell] = useState('')
    const [whatBroke, setWhatBroke] = useState('')
    const [aiSummary, setAiSummary] = useState<string | null>(null)
    const [aiSuggestion, setAiSuggestion] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [completed, setCompleted] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleGenerate = async () => {
        setLoading(true)

        try {
            // Get priorities for context
            const { data: priorities } = await supabase
                .from('daily_priorities')
                .select('*')
                .eq('checkin_id', checkIn.id)

            // Get focus blocks
            const { data: focusBlocks } = await supabase
                .from('focus_blocks')
                .select('*')
                .eq('checkin_id', checkIn.id)

            // Call AI endpoint
            const response = await fetch('/api/ai/daily_summary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mood: checkIn.mood,
                    energy: checkIn.energy,
                    brain_dump: checkIn.brain_dump,
                    what_went_well: whatWentWell,
                    what_broke: whatBroke,
                    priorities: priorities || [],
                    focus_blocks: focusBlocks || []
                })
            })

            const { summary, suggestion } = await response.json()
            setAiSummary(summary)
            setAiSuggestion(suggestion)

            // Save to database
            await supabase
                .from('daily_checkins')
                .update({
                    what_went_well: whatWentWell,
                    what_broke: whatBroke,
                    ai_summary: summary,
                    night_review_completed_at: new Date().toISOString()
                })
                .eq('id', checkIn.id)

            setCompleted(true)
            router.refresh()
        } catch (error) {
            console.error('Failed to generate summary:', error)
        } finally {
            setLoading(false)
        }
    }

    if (completed || checkIn.night_review_completed_at) {
        return (
            <Card className="border-2 border-green-500/20 bg-green-500/5">
                <CardContent className="pt-6 text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10">
                        <CheckCircle2 className="w-8 h-8 text-green-500" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-2">Night Review Complete</h3>
                        <p className="text-muted-foreground">
                            You've closed the loop. See you tomorrow morning.
                        </p>
                    </div>
                    {(aiSummary || checkIn.ai_summary) && (
                        <div className="p-4 bg-background rounded-lg text-left space-y-3">
                            <p className="text-sm italic">"{aiSummary || checkIn.ai_summary}"</p>
                            {(aiSuggestion || checkIn.ai_suggestion) && (
                                <div className="pt-2 border-t">
                                    <p className="text-xs font-medium text-muted-foreground mb-1">Tomorrow:</p>
                                    <p className="text-sm">{aiSuggestion || checkIn.ai_suggestion}</p>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-amber-400" />
                    Night Review
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <p className="text-sm text-muted-foreground">
                    Close the loop. Reflect on your day to gain clarity for tomorrow.
                </p>

                <div className="space-y-2">
                    <label className="text-sm font-medium">What went well?</label>
                    <textarea
                        value={whatWentWell}
                        onChange={(e) => setWhatWentWell(e.target.value)}
                        placeholder="Even small wins count..."
                        className="w-full min-h-[80px] p-3 rounded-md border bg-background resize-none"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">What broke?</label>
                    <textarea
                        value={whatBroke}
                        onChange={(e) => setWhatBroke(e.target.value)}
                        placeholder="What got in the way?"
                        className="w-full min-h-[80px] p-3 rounded-md border bg-background resize-none"
                    />
                </div>

                <Button
                    onClick={handleGenerate}
                    disabled={loading || !whatWentWell}
                    className="w-full"
                >
                    {loading ? 'Generating Insights...' : 'Generate AI Summary'}
                </Button>

                {aiSummary && (
                    <div className="p-4 bg-secondary/20 rounded-lg space-y-3 animate-in fade-in duration-500">
                        <p className="text-sm italic">"{aiSummary}"</p>
                        {aiSuggestion && (
                            <div className="pt-2 border-t">
                                <p className="text-xs font-medium text-muted-foreground mb-1">For tomorrow:</p>
                                <p className="text-sm">{aiSuggestion}</p>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
