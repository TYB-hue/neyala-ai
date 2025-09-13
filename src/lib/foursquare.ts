// Foursquare Places API client for fetching airport photos
// Requires FOURSQUARE_API_KEY environment variable

const FOURSQUARE_API_KEY = process.env.FOURSQUARE_API_KEY;
const API_BASE = 'https://places-api.foursquare.com';

interface FoursquarePlace {
  fsq_place_id?: string; // new Places API
  fsq_id?: string;       // classic field used in docs/some responses
  name: string;
  location: {
    address?: string;
    country?: string;
    region?: string;
    locality?: string;
  };
  categories?: Array<{
    name: string;
    icon: {
      prefix: string;
      suffix: string;
    };
  }>;
}

interface FoursquarePhoto {
  id: string;
  created_at: string;
  prefix: string;
  suffix: string;
  width: number;
  height: number;
}

interface FoursquareSearchResponse {
  results: FoursquarePlace[];
}

// Photos endpoint may return a bare array or be wrapped in an object depending on
// API surface. Handle both to be resilient.
type FoursquarePhotosResponse = FoursquarePhoto[] | { results: FoursquarePhoto[] };

export async function searchAirport(
  airportName: string, 
  city?: string, 
  country?: string
): Promise<FoursquarePlace | null> {
  if (!FOURSQUARE_API_KEY) {
    console.warn('FOURSQUARE_API_KEY not configured');
    return null;
  }

  console.log('Searching airport:', { airportName, city, country });

  try {
    // Try multiple search strategies
    const searchQueries = [
      // Strategy 1: Full airport name with location
      `${airportName} ${city || ''} ${country || ''}`.trim(),
      // Strategy 2: Just airport name
      airportName,
      // Strategy 3: Simplified airport name (remove "International", "Airport", etc.)
      airportName.replace(/\s+(International|Airport|Airfield|Field)\s*/gi, ' ').trim(),
      // Strategy 4: Airport name with just city
      `${airportName} ${city || ''}`.trim()
    ];

    for (const query of searchQueries) {
      if (!query) continue;
      
      // Build search URL with airport category bias
      const airportCategoryIds = [
        '4bf58dd8d48988d1ed931735', // Airport
        '4bf58dd8d48988d1eb931735', // Airport Terminal
        '4bf58dd8d48988d1f0931735'  // Airport Gate
      ].join(',');
      let searchUrl = `${API_BASE}/places/search?query=${encodeURIComponent(query)}&limit=10&categories=${airportCategoryIds}`;
      if (city && country) {
        searchUrl += `&near=${encodeURIComponent(`${city}, ${country}`)}`;
      }
      
      const response = await fetch(searchUrl, {
        headers: {
          'Authorization': `Bearer ${FOURSQUARE_API_KEY}`,
          'Accept': 'application/json',
          'X-Places-Api-Version': '2025-06-17'
        },
        cache: 'no-store'
      });

      if (!response.ok) {
        console.error('Foursquare search failed:', response.status, response.statusText);
        continue;
      }

      const data: FoursquareSearchResponse = await response.json();
      
      if (!data.results || data.results.length === 0) {
        continue;
      }

      // Find the best match - prefer airports and exact name matches
      const normalizedAirportName = airportName.toLowerCase();
      const normalizedCountry = country?.toLowerCase();
      
      // First, try to find exact name match
      let bestMatch = data.results.find(place => 
        place.name.toLowerCase().includes(normalizedAirportName) ||
        normalizedAirportName.includes(place.name.toLowerCase())
      );

      // If no exact match, try to find by category (airport/transportation)
      if (!bestMatch) {
        bestMatch = data.results.find(place => 
          place.categories?.some(cat => 
            cat.name.toLowerCase().includes('airport') ||
            cat.name.toLowerCase().includes('transportation') ||
            cat.name.toLowerCase().includes('airline')
          )
        );
      }

      // If still no match, try country filtering
      if (!bestMatch && normalizedCountry) {
        bestMatch = data.results.find(place => 
          place.location.country?.toLowerCase() === normalizedCountry ||
          place.location.country?.toLowerCase() === normalizedCountry.substring(0, 2)
        );
      }

      // If we found a good match, return it (keep both possible id fields)
      if (bestMatch) {
        console.log(`Found airport match: ${bestMatch.name} for query: ${query}`);
        return bestMatch;
      }
    }

    console.log(`No airport found for: ${airportName}`);
    return null;

  } catch (error) {
    console.error('Error searching airport on Foursquare:', error);
    return null;
  }
}

export async function getAirportPhotos(
  fsqPlaceId: string, 
  limit: number = 5
): Promise<string[]> {
  if (!FOURSQUARE_API_KEY) {
    console.warn('FOURSQUARE_API_KEY not configured');
    return [];
  }

  try {
    const photosUrl = `${API_BASE}/places/${fsqPlaceId}/photos?limit=${limit}`;
    
    const response = await fetch(photosUrl, {
      headers: {
        'Authorization': `Bearer ${FOURSQUARE_API_KEY}`,
        'Accept': 'application/json',
        'X-Places-Api-Version': '2025-06-17'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error('Foursquare photos failed:', response.status, response.statusText);
      return [];
    }

    const data: FoursquarePhotosResponse = await response.json();

    const photosArray: FoursquarePhoto[] = Array.isArray(data)
      ? data as FoursquarePhoto[]
      : (data as { results: FoursquarePhoto[] }).results || [];

    if (!photosArray || photosArray.length === 0) {
      return [];
    }

    // Assemble photo URLs with sensible landscape size
    return photosArray.map(photo => {
      const width = Math.min(1200, photo.width || 1200);
      const height = Math.round(width * ((photo.height || 800) / (photo.width || 1200)));
      return `${photo.prefix}${width}x${height}${photo.suffix}`;
    });

  } catch (error) {
    console.error('Error fetching airport photos from Foursquare:', error);
    return [];
  }
}

export async function getAirportWithPhotos(
  airportName: string,
  city?: string,
  country?: string
): Promise<{
  place: FoursquarePlace | null;
  photos: string[];
} | null> {
  try {
    const place = await searchAirport(airportName, city, country);
    
    if (!place) {
      return null;
    }

    const placeId = (place.fsq_place_id || (place as any).fsq_id || place.fsq_id) as string | undefined;
    if (!placeId) {
      console.warn('No FSQ place id available on place result');
      return {
        place,
        photos: []
      };
    }

    const photos = await getAirportPhotos(placeId);
    
    return {
      place,
      photos
    };

  } catch (error) {
    console.error('Error getting airport with photos:', error);
    return null;
  }
}
