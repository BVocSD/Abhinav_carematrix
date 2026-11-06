import { NextResponse } from 'next/server';
import { getFallbackAnswer } from '@/lib/chatbot-fallback';

function hasAiProviderKey(): boolean {
  return Boolean(
    process.env.GEMINI_API_KEY ??
      process.env.GOOGLE_API_KEY ??
      process.env.GOOGLE_GENAI_API_KEY
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = typeof body?.message === 'string' ? body.message.trim() : '';

    if (!message) {
      return NextResponse.json({ error: 'A message is required.' }, { status: 400 });
    }

    const history = Array.isArray(body?.history) ? body.history : [];

    if (hasAiProviderKey()) {
      try {
        // Imported lazily so the AI plugin is only loaded when a key is configured.
        const { chatFlow } = await import('@/ai/flows/chatbot');
        const result = await chatFlow({ message, history });

        if (result?.reply) {
          return NextResponse.json(result);
        }
      } catch (error) {
        console.error('Chatbot AI call failed, using fallback answer:', error);
      }
    }

    return NextResponse.json({ reply: getFallbackAnswer(message) });
  } catch (error) {
    console.error('Chatbot error:', error);
    return NextResponse.json(
      { error: 'Sorry, something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
