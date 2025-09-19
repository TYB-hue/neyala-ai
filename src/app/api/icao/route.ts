import { NextRequest, NextResponse } from 'next/server';
import { getGroqChatCompletion } from '@/lib/groq';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const airport = (searchParams.get('airport') || '').trim();
    const city = (searchParams.get('city') || '').trim();
    const country = (searchParams.get('country') || '').trim();

    if (!airport) {
      return NextResponse.json({ error: 'Missing airport' }, { status: 400 });
    }

    const queryString = [airport, city, country].filter(Boolean).join(', ');

    const messages = [
      {
        role: 'system',
        content:
          'You are a precise aviation assistant. When asked for an airport ICAO code, reply with ONLY the 4-letter ICAO code (A-Z), no extra text.'
      },
      {
        role: 'user',
        content: `What is the ICAO code for ${queryString}? Reply ONLY the 4-letter ICAO code.`
      }
    ];

    const completion = await getGroqChatCompletion(messages);
    const text = completion?.choices?.[0]?.message?.content?.trim() || '';
    const match = text.toUpperCase().match(/\b[A-Z]{4}\b/);
    const icao = match ? match[0] : null;

    return NextResponse.json({ icao }, { status: 200 });
  } catch (e) {
    console.error('Error resolving ICAO via Groq:', e);
    return NextResponse.json({ icao: null }, { status: 200 });
  }
}





