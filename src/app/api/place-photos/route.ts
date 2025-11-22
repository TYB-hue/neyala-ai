import { NextRequest, NextResponse } from 'next/server';
import { getGooglePlacePhoto, getGooglePlacePhotos } from '@/lib/google-places-photos';

const FOURSQUARE_API_KEY = process.env.FOURSQUARE_API_KEY;
const API_BASE = 'https://places-api.foursquare.com';

// Foursquare fallback functions (keeping for fallback)
async function searchPlace(query: string, city?: string, country?: string) {
  if (!FOURSQUARE_API_KEY) return null;
  try {
    const categories = [
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
    const lat = searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : undefined;
    const lng = searchParams.get('lng') ? parseFloat(searchParams.get('lng')!) : undefined;

    if (!name) {
      return NextResponse.json({ error: 'Missing name' }, { status: 400 });
    }

    // Step 1: Try Google Places Photos API first
    try {
      if (lat !== undefined && lng !== undefined) {
        // Get photos with coordinates (more accurate)
        const photos = await getGooglePlacePhotos(name, lat, lng, 3);
        if (photos && photos.length > 0) {
          return NextResponse.json({ 
            photos, 
            place: { name, source: 'google' },
            source: 'google' 
          }, { status: 200 });
        }
      } else {
        // Try without coordinates
        const photoUrl = await getGooglePlacePhoto(name);
        if (photoUrl) {
          return NextResponse.json({ 
            photos: [photoUrl], 
            place: { name, source: 'google' },
            source: 'google' 
          }, { status: 200 });
        }
      }
    } catch (error) {
      console.error('[Place Photos API] Google Places error:', error);
      // Continue to fallback
    }

    // Step 2: Fallback to Foursquare if Google returns no photos
    const parts = destination.split(',').map(p => p.trim()).filter(Boolean);
    const city = parts[0];
    const country = parts[parts.length - 1];

    const place = await searchPlace(name, city, country);
    if (!place) {
      return NextResponse.json({ 
        photos: [], 
        place: null,
        source: 'none' 
      }, { status: 200 });
    }

    const fsqId = place.fsq_place_id || place.fsq_id;
    if (!fsqId) {
      return NextResponse.json({ 
        photos: [], 
        place,
        source: 'none' 
      }, { status: 200 });
    }

    const photos = await getPhotos(fsqId);
    
    return NextResponse.json({ 
      photos, 
      place: { ...place, source: 'foursquare' },
      source: photos.length > 0 ? 'foursquare' : 'none' 
    }, { status: 200 });

  } catch (error) {
    console.error('[Place Photos API] Error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch place photos',
      photos: [],
      source: 'error' 
    }, { status: 500 });
  }
}
