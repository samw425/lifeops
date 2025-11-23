'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Sparkles, TrendingUp } from 'lucide-react'
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns'

export default function WeeklyReviewPage() {
    const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }))
    const [weekData, setWeekData] = useState<any>(null)
    const [insights, setInsights] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [insightsLoading, setInsightsLoading] = useState(false)
    const supabase = createClient()

    const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 })

    useEffect(() => {
        fetchWeekData()
    }, [currentWeekStart])

    const fetchWeekData = async () => {
        setLoading(true)

        const weekStartStr = format(currentWeekStart, 'yyyy-MM-dd')
        const weekEndStr = format(weekEnd, 'yyyy-MM-dd')

        // Fetch check-ins
        const { data: checkIns } = await supabase
            .from('daily_checkins')
            .select('*')
            .gte('date', weekStartStr)
            .lte('date', weekEndStr)
            .order('date')

        if (!checkIns || checkIns.length === 0) {
            setWeekData(null)
            setLoading(false)
            return
        }

        // Fetch priorities
        const checkInIds = checkIns.map(c => c.id)
        const { data: priorities } = await supabase
            .from('daily_priorities')
            .select('*')
            .in('checkin_id', checkInIds)

        // Fetch focus blocks
        const { data: focusBlocks } = await supabase
            .from('focus_blocks')
            .select('*')
            .in('checkin_id', checkInIds)

        // Calculate stats
        const avgMood = checkIns.reduce((sum, c) => sum + (c.mood || 0), 0) / checkIns.length
        const avgEnergy = checkIns.reduce((sum, c) => sum + (c.energy || 0), 0) / checkIns.length
        const completionRate = priorities && priorities.length > 0
            ? (priorities.filter((p: any) => p.is_completed).length / priorities.length) * 100
            : 0

        const focusDistribution = (focusBlocks || []).reduce((acc: any, block) => {
            acc[block.mode] = (acc[block.mode] || 0) + 1
            return acc
        }, {})

        setWeekData({
            checkIns,
            priorities: priorities || [],
            focusBlocks: focusBlocks || [],
            stats: { avgMood, avgEnergy, completionRate, focusDistribution }
        })
        setLoading(false)
    }

    const generateInsights = async () => {
        setInsightsLoading(true)

        const weekStartStr = format(currentWeekStart, 'yyyy-MM-dd')
        const weekEndStr = format(weekEnd, 'yyyy-MM-dd')

        const response = await fetch('/api/ai/weekly_insights', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                weekStart: weekStartStr,
                weekEnd: weekEndStr
            })
        })

        const data = await response.json()
        setInsights(data)
        setInsightsLoading(false)
    }

    if (loading) {
        return <div className="max-w-4xl mx-auto p-8">Loading...</div>
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Week Navigator */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Weekly Review</h1>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setCurrentWeekStart(subWeeks(currentWeekStart, 1))}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium px-4">
                        {format(currentWeekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentWeekStart(addWeeks(currentWeekStart, 1))}
                        disabled={addWeeks(currentWeekStart, 1) > new Date()}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {!weekData ? (
                <Card>
                    <CardContent className="pt-6 text-center text-muted-foreground">
                        No check-ins this week. Complete your daily check-ins to unlock insights.
                    </CardContent>
                </Card>
            ) : (
                <>
                    {/* Stats Cards */}
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium text-muted-foreground">Avg Mood</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{weekData.stats.avgMood.toFixed(1)}/5</div>
                                <div className="h-2 bg-secondary rounded-full mt-2 overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 rounded-full"
                                        style={{ width: `${(weekData.stats.avgMood / 5) * 100}%` }}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium text-muted-foreground">Avg Energy</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{weekData.stats.avgEnergy.toFixed(1)}/5</div>
                                <div className="h-2 bg-secondary rounded-full mt-2 overflow-hidden">
                                    <div
                                        className="h-full bg-amber-500 rounded-full"
                                        style={{ width: `${(weekData.stats.avgEnergy / 5) * 100}%` }}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium text-muted-foreground">Completion Rate</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{weekData.stats.completionRate.toFixed(0)}%</div>
                                <div className="h-2 bg-secondary rounded-full mt-2 overflow-hidden">
                                    <div
                                        className="h-full bg-green-500 rounded-full"
                                        style={{ width: `${weekData.stats.completionRate}%` }}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Focus Distribution */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Focus Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {Object.keys(weekData.stats.focusDistribution).length > 0 ? (
                                <div className="space-y-3">
                                    {Object.entries(weekData.stats.focusDistribution).map(([mode, count]: [string, any]) => (
                                        <div key={mode} className="flex items-center gap-3">
                                            <div className="w-24 text-sm capitalize">{mode}</div>
                                            <div className="flex-1 h-4 bg-secondary rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${mode === 'deep' ? 'bg-blue-500' :
                                                            mode === 'admin' ? 'bg-amber-500' :
                                                                mode === 'recovery' ? 'bg-green-500' :
                                                                    'bg-red-500'
                                                        }`}
                                                    style={{ width: `${(count / weekData.focusBlocks.length) * 100}%` }}
                                                />
                                            </div>
                                            <div className="w-12 text-sm text-right text-muted-foreground">{count}</div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">No focus blocks logged this week.</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* AI Insights */}
                    <Card className="border-2 border-primary/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-amber-400" />
                                AI Weekly Insights
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {!insights ? (
                                <Button onClick={generateInsights} disabled={insightsLoading} className="w-full">
                                    {insightsLoading ? 'Analyzing...' : 'Generate Weekly Insights'}
                                </Button>
                            ) : (
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                                            <TrendingUp className="h-4 w-4" />
                                            Patterns
                                        </h4>
                                        <ul className="space-y-2">
                                            {insights.patterns.map((pattern: string, i: number) => (
                                                <li key={i} className="text-sm pl-4 border-l-2 border-primary/50">
                                                    {pattern}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {insights.experiments && insights.experiments.length > 0 && (
                                        <div>
                                            <h4 className="font-semibold mb-3">Experiments for Next Week</h4>
                                            <div className="space-y-2">
                                                {insights.experiments.map((experiment: string, i: number) => (
                                                    <div key={i} className="p-3 bg-secondary/20 rounded-lg text-sm flex justify-between items-center">
                                                        <span>{experiment}</span>
                                                        <Button variant="outline" size="sm">Accept</Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    )
}
