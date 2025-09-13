import { NextRequest, NextResponse } from 'next/server';

const FOURSQUARE_API_KEY = process.env.FOURSQUARE_API_KEY;
const API_BASE = 'https://places-api.foursquare.com';

async function searchPlace(query: string, city?: string, country?: string) {
  if (!FOURSQUARE_API_KEY) return null;
  try {
    const categories = [
      // common attraction/landmark categories (broad)
      '4bf58dd8d48988d12d941735', // Monument / Landmark
      '4deefb944765f83613cdba6e', // Historic Site
      '4bf58dd8d48988d181941735', // Park
      '4bf58dd8d48988d165941735', // Museum
    ].join(',');
    let url = `${API_BASE}/places/search?query=${encodeURIComponent(query)}&limit=5&categories=${categories}`;
    if (city && country) url += `&near=${encodeURIComponent(`${city}, ${country}`)}`;
    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${FOURSQUARE_API_KEY}`,
        'Accept': 'application/json',
        'X-Places-Api-Version': '2025-06-17'
      },
      cache: 'no-store'
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.results?.[0] || null;
  } catch {
    return null;
  }
}

async function getPhotos(fsqId: string, limit = 3): Promise<string[]> {
  if (!FOURSQUARE_API_KEY) return [];
  try {
    const res = await fetch(`${API_BASE}/places/${fsqId}/photos?limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${FOURSQUARE_API_KEY}`,
        'Accept': 'application/json',
        'X-Places-Api-Version': '2025-06-17'
      },
      cache: 'no-store'
    });
    if (!res.ok) return [];
    const data = await res.json();
    const arr = Array.isArray(data) ? data : (data?.results || []);
    return arr.map((p: any) => `${p.prefix}${Math.min(1200, p.width || 1200)}x${Math.min(900, p.height || 900)}${p.suffix}`);
  } catch {
    return [];
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const name = (searchParams.get('name') || '').trim();
    const destination = (searchParams.get('destination') || '').trim();
    if (!name) return NextResponse.json({ error: 'Missing name' }, { status: 400 });
    const parts = destination.split(',').map(p => p.trim()).filter(Boolean);
    const city = parts[0];
    const country = parts[parts.length - 1];

    const place = await searchPlace(name, city, country);
    if (!place) return NextResponse.json({ photos: [], place: null }, { status: 200 });
    const fsqId = place.fsq_place_id || place.fsq_id;
    if (!fsqId) return NextResponse.json({ photos: [], place }, { status: 200 });
    const photos = await getPhotos(fsqId);
    return NextResponse.json({ photos, place }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch place photos' }, { status: 500 });
  }
}



