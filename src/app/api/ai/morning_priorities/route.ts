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

    const { brainDump, focusAreas, goals } = await req.json()

    const prompt = `
    You are LifeOps AI, a partner for a busy human.
    
    User Context:
    - Focus Areas: ${focusAreas.map((f: any) => f.name).join(', ')}
    - Active Goals: ${goals.map((g: any) => g.title).join(', ')}
    
    Morning Brain Dump:
    "${brainDump}"
    
    Task:
    Analyze the brain dump and context. Generate exactly 3 clear, realistic, high-impact priorities for today.
    They should be short (under 10 words) and actionable.
    
    Tone: Calm, clear, encouraging but direct.
  `

    const { object } = await generateObject({
        model: google('gemini-1.5-pro-latest'),
        schema: z.object({
            priorities: z.array(z.string()).length(3),
        }),
        prompt: prompt,
    })

    return Response.json(object)
}
