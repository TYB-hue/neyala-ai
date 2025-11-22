/**
 * Google Places Photos API client
 * Replaces Foursquare photo fetching with Google Places Photos API
 * Uses the same Google Maps API key (NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)
 */

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

interface GooglePlace {
  place_id: string;
  name?: string;
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
}

interface GooglePlaceDetailsResponse {
  result?: {
    photos?: Array<{
      photo_reference: string;
      height: number;
      width: number;
    }>;
  };
  status: string;
}

interface GooglePlacesSearchResponse {
  results?: Array<{
    place_id: string;
    name?: string;
    photos?: Array<{
      photo_reference: string;
      height: number;
      width: number;
    }>;
  }>;
  status: string;
}

/**
 * Search for a place using Google Places Text Search API
 * Returns the place_id of the first result
 */
async function searchPlaceId(query: string, location?: { lat: number; lng: number }): Promise<string | null> {
  if (!GOOGLE_MAPS_API_KEY) {
    console.warn('[Google Places] API key not configured');
    return null;
  }

  try {
    let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GOOGLE_MAPS_API_KEY}`;
    
    // Add location bias if available (improves relevance)
    if (location) {
      url += `&location=${location.lat},${location.lng}&radius=5000`;
    }

    const response = await fetch(url, {
      cache: 'no-store',
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });

    if (!response.ok) {
      console.error('[Google Places] Search failed:', response.status, response.statusText);
      return null;
    }

    const data: GooglePlacesSearchResponse = await response.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('[Google Places] Search error:', data.status);
      return null;
    }

    if (!data.results || data.results.length === 0) {
      return null;
    }

    return data.results[0].place_id;
  } catch (error) {
    console.error('[Google Places] Error searching place:', error);
    return null;
  }
}

/**
 * Search for a place using Google Places Nearby Search API (better for lat/lng)
 */
async function searchNearbyPlaceId(name: string, location: { lat: number; lng: number }): Promise<string | null> {
  if (!GOOGLE_MAPS_API_KEY) {
    return null;
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=1000&keyword=${encodeURIComponent(name)}&key=${GOOGLE_MAPS_API_KEY}`;

    const response = await fetch(url, {
      cache: 'no-store',
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      return null;
    }

    const data: GooglePlacesSearchResponse = await response.json();

    if (data.status !== 'OK' || !data.results || data.results.length === 0) {
      return null;
    }

    // Find the best match by name similarity
    const bestMatch = data.results.find(result => 
      result.name?.toLowerCase().includes(name.toLowerCase()) ||
      name.toLowerCase().includes(result.name?.toLowerCase() || '')
    ) || data.results[0];

    return bestMatch.place_id;
  } catch (error) {
    console.error('[Google Places] Error in nearby search:', error);
    return null;
  }
}

/**
 * Get place details including photos using place_id
 */
async function getPlaceDetails(placeId: string): Promise<Array<{ photo_reference: string }> | null> {
  if (!GOOGLE_MAPS_API_KEY || !placeId) {
    return null;
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${GOOGLE_MAPS_API_KEY}`;

    const response = await fetch(url, {
      cache: 'no-store',
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      console.error('[Google Places] Details fetch failed:', response.status);
      return null;
    }

    const data: GooglePlaceDetailsResponse = await response.json();

    if (data.status !== 'OK' || !data.result?.photos || data.result.photos.length === 0) {
      return null;
    }

    return data.result.photos.map(photo => ({
      photo_reference: photo.photo_reference,
    }));
  } catch (error) {
    console.error('[Google Places] Error fetching place details:', error);
    return null;
  }
}

/**
 * Construct Google Places Photo URL
 */
function buildPhotoUrl(photoReference: string, maxWidth: number = 800): string {
  if (!GOOGLE_MAPS_API_KEY) {
    return '';
  }
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${GOOGLE_MAPS_API_KEY}`;
}

/**
 * Main function: Get Google Places photo for a location
 * 
 * @param name - Place name
 * @param lat - Latitude (optional, improves search accuracy)
 * @param lng - Longitude (optional, improves search accuracy)
 * @returns Photo URL or null if not found
 */
export async function getGooglePlacePhoto(
  name: string,
  lat?: number,
  lng?: number
): Promise<string | null> {
  if (!GOOGLE_MAPS_API_KEY) {
    console.warn('[Google Places] API key not configured');
    return null;
  }

  if (!name || name.trim().length === 0) {
    return null;
  }

  // Check localStorage cache first (client-side only)
  if (typeof window !== 'undefined') {
    const cacheKey = `google_place_photo_${name}_${lat || ''}_${lng || ''}`;
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const cachedData = JSON.parse(cached);
        // Cache valid for 7 days
        if (Date.now() - cachedData.timestamp < 7 * 24 * 60 * 60 * 1000) {
          return cachedData.url;
        }
      }
    } catch (error) {
      // Ignore cache errors
    }
  }

  try {
    let placeId: string | null = null;

    // If we have coordinates, try Nearby Search first (more accurate)
    if (lat !== undefined && lng !== undefined) {
      placeId = await searchNearbyPlaceId(name, { lat, lng });
    }

    // Fallback to Text Search if Nearby Search failed
    if (!placeId) {
      const location = lat !== undefined && lng !== undefined ? { lat, lng } : undefined;
      placeId = await searchPlaceId(name, location);
    }

    if (!placeId) {
      return null;
    }

    // Get place details with photos
    const photos = await getPlaceDetails(placeId);

    if (!photos || photos.length === 0) {
      return null;
    }

    // Use the first (usually best) photo
    const photoUrl = buildPhotoUrl(photos[0].photo_reference, 800);

    // Cache the result (client-side only)
    if (typeof window !== 'undefined') {
      const cacheKey = `google_place_photo_${name}_${lat || ''}_${lng || ''}`;
      try {
        localStorage.setItem(cacheKey, JSON.stringify({
          url: photoUrl,
          timestamp: Date.now(),
        }));
      } catch (error) {
        // Ignore cache errors (e.g., quota exceeded)
      }
    }

    return photoUrl;
  } catch (error) {
    console.error('[Google Places] Error getting photo:', error);
    return null;
  }
}

/**
 * Get multiple photos for a place (returns array of photo URLs)
 */
export async function getGooglePlacePhotos(
  name: string,
  lat?: number,
  lng?: number,
  limit: number = 3
): Promise<string[]> {
  if (!GOOGLE_MAPS_API_KEY || !name) {
    return [];
  }

  try {
    let placeId: string | null = null;

    // Try Nearby Search first if coordinates available
    if (lat !== undefined && lng !== undefined) {
      placeId = await searchNearbyPlaceId(name, { lat, lng });
    }

    // Fallback to Text Search
    if (!placeId) {
      const location = lat !== undefined && lng !== undefined ? { lat, lng } : undefined;
      placeId = await searchPlaceId(name, location);
    }

    if (!placeId) {
      return [];
    }

    // Get place details with photos
    const photos = await getPlaceDetails(placeId);

    if (!photos || photos.length === 0) {
      return [];
    }

    // Return up to limit photos
    return photos.slice(0, limit).map(photo => buildPhotoUrl(photo.photo_reference, 800));
  } catch (error) {
    console.error('[Google Places] Error getting photos:', error);
    return [];
  }
}

