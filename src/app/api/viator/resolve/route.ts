import { NextRequest, NextResponse } from 'next/server';
import { resolveViatorUrl } from '@/lib/viator-links';
import { viatorSearchAttractions, buildViatorAttractionUrl } from '@/lib/viator-api';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const attraction = searchParams.get('attraction') || '';
    const destination = searchParams.get('destination') || undefined;
    const country = searchParams.get('country') || undefined;

    if (!attraction) {
      return NextResponse.json({ error: 'Missing attraction' }, { status: 400 });
    }

    // Prefer official API if key is configured
    const query = [attraction, destination].filter(Boolean).join(' ').trim();
    const apiResults = await viatorSearchAttractions(query);
    if (apiResults && apiResults.length) {
      const normalizedCountry = (country || '').trim().toLowerCase();
      let best = apiResults.find(a => (a.country || '').trim().toLowerCase() === normalizedCountry);
      if (!best) best = apiResults[0];
      const url = best ? buildViatorAttractionUrl(best) : null;
      if (url) return NextResponse.json({ url }, { status: 200 });
    }

    // Fallback to resolver using public endpoints
    const fallbackResolved = await resolveViatorUrl({
      attractionName: attraction,
      destination,
      country
    });

    return NextResponse.json({ url: fallbackResolved }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to resolve' }, { status: 500 });
  }
}


