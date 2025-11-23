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

    // Fetch user's recent check-ins to analyze patterns
    const { data: recentCheckIns } = await supabase
        .from('daily_checkins')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(14) // Last 2 weeks

    if (!recentCheckIns || recentCheckIns.length < 5) {
        return Response.json({
            suggested_areas: [
                { name: "Health & Fitness", rationale: "Physical wellbeing" },
                { name: "Career Growth", rationale: "Professional development" },
                { name: "Relationships", rationale: "Social connections" }
            ]
        })
    }

    // Analyze common themes in brain dumps
    const brainDumps = recentCheckIns
        .map(c => c.brain_dump)
        .filter(Boolean)
        .join(' ')

    const prompt = `
You are LifeOps AI analyzing a user's life patterns.

Recent brain dumps (last 2 weeks):
"${brainDumps.substring(0, 1000)}"

Task:
Identify 3 focus areas this person should track based on what they're actually thinking about and working on.

Each focus area should:
- Represent a meaningful life domain
- Be grounded in their actual concerns (not generic)
- Help them organize their daily priorities

Return 3 focus areas with short rationales (why this matters for them specifically).
`

    const { object } = await generateObject({
        model: google('gemini-1.5-pro-latest'),
        schema: z.object({
            suggested_areas: z.array(z.object({
                name: z.string(),
                rationale: z.string()
            })).length(3)
        }),
        prompt: prompt,
    })

    return Response.json(object)
}
