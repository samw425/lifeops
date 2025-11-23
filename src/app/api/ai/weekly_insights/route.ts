import { createClient } from '@/utils/supabase/server'
import { google } from '@ai-sdk/google'
import { generateObject } from 'ai'
import { z } from 'zod'

export async function POST(req: Request) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return new Response('Unauthorized', { status: 401 })
    }

    const { weekStart, weekEnd } = await req.json()

    // Fetch week's check-ins
    const { data: checkIns } = await supabase
        .from('daily_checkins')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', weekStart)
        .lte('date', weekEnd)
        .order('date')

    if (!checkIns || checkIns.length === 0) {
        return Response.json({
            patterns: ["Not enough data yet. Complete at least 3 check-ins to see patterns."],
            experiments: []
        })
    }

    // Aggregate stats
    const avgMood = checkIns.reduce((sum, c) => sum + (c.mood || 0), 0) / checkIns.length
    const avgEnergy = checkIns.reduce((sum, c) => sum + (c.energy || 0), 0) / checkIns.length

    // Fetch priorities for completion rate
    const checkInIds = checkIns.map(c => c.id)
    const { data: priorities } = await supabase
        .from('daily_priorities')
        .select('*')
        .in('checkin_id', checkInIds)

    const completionRate = priorities && priorities.length > 0
        ? (priorities.filter(p => p.is_completed).length / priorities.length) * 100
        : 0

    // Fetch focus blocks
    const { data: focusBlocks } = await supabase
        .from('focus_blocks')
        .select('*')
        .in('checkin_id', checkInIds)

    const focusDistribution = (focusBlocks || []).reduce((acc: any, block) => {
        acc[block.mode] = (acc[block.mode] || 0) + 1
        return acc
    }, {})

    const prompt = `
You are LifeOps AI, analyzing a user's week to help them improve their life operating system.

Week's Data:
- Number of check-ins: ${checkIns.length}/7
- Average mood: ${avgMood.toFixed(1)}/5
- Average energy: ${avgEnergy.toFixed(1)}/5
- Priority completion rate: ${completionRate.toFixed(0)}%
- Focus modes used: ${JSON.stringify(focusDistribution)}
- Obstacles noted: ${checkIns.map(c => c.what_broke).filter(Boolean).join('; ')}
- Wins: ${checkIns.map(c => c.what_went_well).filter(Boolean).join('; ')}

Task:
1. Identify 3 meaningful patterns from this week's data. Be specific and grounded in the actual numbers.
2. Propose 2 small, realistic experiments for next week that could improve their clarity or consistency.

Tone: Insightful, actionable, encouraging. Connect the dots between data and lived experience.
`

    const { object } = await generateObject({
        model: google('gemini-1.5-pro-latest'),
        schema: z.object({
            patterns: z.array(z.string()).length(3),
            experiments: z.array(z.string()).length(2),
        }),
        prompt: prompt,
    })

    return Response.json(object)
}
