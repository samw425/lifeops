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

    const { goals } = await req.json()

    if (!goals || goals.length === 0) {
        return Response.json({ refined_goals: [] })
    }

    const prompt = `
You are LifeOps AI, a clarity coach helping users write better goals.

The user has these rough goals:
${goals.map((g: any, i: number) => `${i + 1}. ${g.title}${g.description ? ` (${g.description})` : ''}`).join('\n')}

Task:
Rewrite each goal to be:
- Specific and measurable
- Actionable
- Clear about the desired outcome
- Still authentic to the user's intent

Return the same number of goals but refined. Keep them concise (under 50 words each).

Tone: Direct, encouraging, practical.
`

    const { object } = await generateObject({
        model: google('gemini-1.5-pro-latest'),
        schema: z.object({
            refined_goals: z.array(z.object({
                title: z.string(),
                description: z.string()
            }))
        }),
        prompt: prompt,
    })

    return Response.json(object)
}
