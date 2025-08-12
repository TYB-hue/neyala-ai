const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

// Optimized fallback images for better performance
const optimizedFallbacks = {
  destinations: {
    'paris': 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg',
    'london': 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg',
    'rome': 'https://images.pexels.com/photos/1257100/pexels-photo-1257100.jpeg',
    'amsterdam': 'https://images.pexels.com/photos/3601425/pexels-photo-3601425.jpeg',
    'tokyo': 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg',
    'new york': 'https://images.pexels.com/photos/290386/pexels-photo-290386.jpeg',
    'barcelona': 'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg',
    'venice': 'https://images.pexels.com/photos/3601425/pexels-photo-3601425.jpeg',
    'santorini': 'https://images.pexels.com/photos/3601425/pexels-photo-3601425.jpeg',
    'dubai': 'https://images.pexels.com/photos/3601425/pexels-photo-3601425.jpeg'
  },
  airports: {
    'cdg': 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg',
    'lhr': 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg',
    'fco': 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg',
    'ams': 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg',
    'nrt': 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg',
    'jfk': 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg'
  }
};

// Image cache for faster responses
const imageCache = new Map();

async function fetchPexelsImageOptimized(query: string, orientation: 'landscape' | 'portrait' = 'landscape'): Promise<string> {
  // Check cache first
  const cacheKey = `${query}-${orientation}`;
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey);
  }

  // Try optimized fallbacks first
  const normalizedQuery = query.toLowerCase();
  for (const [key, url] of Object.entries(optimizedFallbacks.destinations)) {
    if (normalizedQuery.includes(key)) {
      imageCache.set(cacheKey, url);
      return url;
    }
  }

  if (!PEXELS_API_KEY) {
    const fallback = 'https://images.pexels.com/photos/1502602898657-3e91760cbb34/pexels-photo-1502602898657-3e91760cbb34.jpeg?auto=compress&cs=tinysrgb&w=1200';
    imageCache.set(cacheKey, fallback);
    return fallback;
  }

  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=${orientation}`,
      { 
        headers: { Authorization: PEXELS_API_KEY },
        // Add timeout for faster fallback
        signal: AbortSignal.timeout(3000)
      }
    );
    
    if (!response.ok) {
      throw new Error('Pexels API failed');
    }
    
    const data = await response.json();
    const imageUrl = data.photos?.[0]?.src?.large || 'https://images.pexels.com/photos/1502602898657-3e91760cbb34/pexels-photo-1502602898657-3e91760cbb34.jpeg?auto=compress&cs=tinysrgb&w=1200';
    
    imageCache.set(cacheKey, imageUrl);
    return imageUrl;
  } catch (e) {
    const fallback = 'https://images.pexels.com/photos/1502602898657-3e91760cbb34/pexels-photo-1502602898657-3e91760cbb34.jpeg?auto=compress&cs=tinysrgb&w=1200';
    imageCache.set(cacheKey, fallback);
    return fallback;
  }
}

export async function getDestinationImage(query: string, orientation: 'landscape' | 'portrait' = 'landscape') {
  return await fetchPexelsImageOptimized(query, orientation);
}

export async function getAirportImage(airportName: string): Promise<string> {
  // Check airport-specific fallbacks first
  const normalizedAirport = airportName.toLowerCase();
  for (const [code, url] of Object.entries(optimizedFallbacks.airports)) {
    if (normalizedAirport.includes(code)) {
      return url;
    }
  }

  // Try optimized queries for better airport photos
  const queries = [
    `${airportName} airport terminal`,
    `${airportName} airport building`,
    `${airportName} airport`
  ];
  
  for (const query of queries) {
    const image = await fetchPexelsImageOptimized(query, 'landscape');
    if (image !== 'https://images.pexels.com/photos/1502602898657-3e91760cbb34/pexels-photo-1502602898657-3e91760cbb34.jpeg?auto=compress&cs=tinysrgb&w=1200') {
      return image;
    }
  }
  
  return 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg';
}

export async function getHotelImage(hotelName: string): Promise<string> {
  // Try optimized queries for better hotel photos
  const queries = [
    `${hotelName} hotel exterior`,
    `${hotelName} hotel building`,
    `${hotelName} hotel`
  ];
  
  for (const query of queries) {
    const image = await fetchPexelsImageOptimized(query, 'landscape');
    if (image !== 'https://images.pexels.com/photos/1502602898657-3e91760cbb34/pexels-photo-1502602898657-3e91760cbb34.jpeg?auto=compress&cs=tinysrgb&w=1200') {
      return image;
    }
  }
  
  return 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg';
}

export async function getActivityImage(activityName: string): Promise<string> {
  return await fetchPexelsImageOptimized(activityName, 'landscape');
}

export async function getDestinationHeaderImage(destination: string): Promise<string> {
  return await fetchPexelsImageOptimized(destination, 'landscape');
}

// Generate affiliate links for hotels
export function generateHotelAffiliateLink(hotelName: string, destination: string): string {
  const searchQuery = encodeURIComponent(`${hotelName} ${destination}`);
  return `https://www.booking.com/searchresults.html?ss=${searchQuery}&aid=1234567&label=neyala-ai`;
}

// Generate eSIM affiliate links
export function generateESIMLink(destination: string): string {
  const country = destination.split(',')[1]?.trim() || destination;
  return `https://www.airalo.com/global-esim?ref=neyala-ai&country=${encodeURIComponent(country)}`;
} 