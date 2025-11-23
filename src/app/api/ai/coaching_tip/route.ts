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

    const { current_priorities, mood, energy, time_of_day } = await req.json()

    const prompt = `
You are LifeOps AI. It's ${time_of_day} and the user is checking in.

Current state:
- Mood: ${mood}/5
- Energy: ${energy}/5
- Current priorities: ${current_priorities.map((p: any) => p.title).join(', ')}

Task:
Give ONE short, actionable coaching tip based on their current state. Make it specific to their situation.

Examples:
- Low energy + afternoon: "Your energy is low. Take a 10-minute walk before tackling admin tasks."
- High mood + morning: "Ride this momentum. Tackle your hardest priority first."
- Multiple incomplete priorities: "Focus beats multitasking. Pick one and finish it."

Keep it under 15 words. Be direct and helpful.
`

    const { object } = await generateObject({
        model: google('gemini-1.5-pro-latest'),
        schema: z.object({
            tip: z.string()
        }),
        prompt: prompt,
    })

    return Response.json(object)
}
