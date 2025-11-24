import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');

export async function POST(request: Request) {
    try {
        const { prompt } = await request.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const systemPrompt = `
      You are the Liquid Engine AI. Your job is to convert a user's natural language request into a strict JSON schema for a micro-app.
      
      The user will say something like: "I need a CRM for my freelance business" or "Track my daily water intake".
      
      You must return ONLY a JSON object matching this TypeScript interface:
      
      interface LiquidSchema {
        appName: string;
        description: string;
        fields: {
          id: string; // Must be unique, e.g., "f1", "f2"
          label: string; // Human readable label
          type: 'text' | 'number' | 'date' | 'select' | 'currency' | 'status' | 'rich-text';
          options?: string[]; // Required ONLY for 'select' or 'status' types
        }[];
        views: {
          id: string; // e.g., "v1"
          name: string;
          type: 'list' | 'kanban' | 'gallery' | 'stats';
          groupBy?: string; // Field ID to group by (required for kanban)
          metric?: string; // Optional metric for stats
        }[];
      }

      Rules:
      1. Always create at least one view.
      2. If the user mentions "status" or "stages", use a 'kanban' view and a 'status' field.
      3. Keep it simple but functional.
      4. Return ONLY raw JSON. No markdown formatting.
    `;

        const result = await model.generateContent([systemPrompt, `User Request: "${prompt}"`]);
        const response = result.response;
        let text = response.text();

        // Clean up markdown code blocks if present
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const schema = JSON.parse(text);

        return NextResponse.json({ schema });
    } catch (error) {
        console.error('Liquid Generation Error:', error);
        return NextResponse.json({ error: 'Failed to generate app schema' }, { status: 500 });
    }
}
