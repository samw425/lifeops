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

    const { mood, energy, brain_dump, what_went_well, what_broke, priorities, focus_blocks } = await req.json()

    const completedPriorities = priorities.filter((p: any) => p.is_completed)
    const completionRate = priorities.length > 0 ? `${completedPriorities.length}/${priorities.length}` : '0/0'

    const focusBreakdown = focus_blocks.reduce((acc: any, block: any) => {
        acc[block.mode] = (acc[block.mode] || 0) + 1
        return acc
    }, {})

    const prompt = `
You are LifeOps AI. Your job is to help the user reflect on their day with clarity and compassion.

Today's Data:
- Morning Mood: ${mood}/5
- Morning Energy: ${energy}/5
- Morning Thoughts: "${brain_dump}"
- Priorities Completed: ${completionRate}
- Focus Blocks: ${JSON.stringify(focusBreakdown)}

Reflection:
- What went well: "${what_went_well || 'Not specified'}"
- What broke: "${what_broke || 'Not specified'}"

Task:
1. Write a 5-6 sentence narrative summary of their day. Make it personal, insightful, and grounded in their actual data.
2. Give ONE specific, actionable suggestion for tomorrow based on patterns you notice.

Tone: Warm, wise, concise. Like a coach who knows them well.
`

    const { object } = await generateObject({
        model: google('gemini-1.5-pro-latest'),
        schema: z.object({
            summary: z.string(),
            suggestion: z.string(),
        }),
        prompt: prompt,
    })

    return Response.json(object)
}
