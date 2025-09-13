import { getHeaderImageForDestination, getFallbackHeaderImage } from '@/lib/country-images';

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

// Optimized fallback images for better performance
const optimizedFallbacks = {
  destinations: {
    'paris': 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=1200&h=600&fit=crop&q=80',
    'london': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&h=600&fit=crop&q=80',
    'rome': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&h=600&fit=crop&q=80',
    'amsterdam': 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=1200&h=600&fit=crop&q=80',
    'tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&h=600&fit=crop&q=80',
    'new york': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200&h=600&fit=crop&q=80',
    'barcelona': 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1200&h=600&fit=crop&q=80',
    'venice': 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=1200&h=600&fit=crop&q=80',
    'santorini': 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&h=600&fit=crop&q=80',
    'dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&h=600&fit=crop&q=80',
    'france': 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=1200&h=600&fit=crop&q=80',
    'germany': 'https://images.unsplash.com/photo-1587330979470-3595ac045cb0?w=1200&h=600&fit=crop&q=80',
    'spain': 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1200&h=600&fit=crop&q=80',
    'italy': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&h=600&fit=crop&q=80',
    'japan': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&h=600&fit=crop&q=80',
    'china': 'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?w=1200&h=600&fit=crop&q=80',
    'singapore': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&h=600&fit=crop&q=80',
    'thailand': 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&h=600&fit=crop&q=80',
    'india': 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&h=600&fit=crop&q=80',
    'australia': 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1200&h=600&fit=crop&q=80',
    'canada': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop&q=80',
    'brazil': 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1200&h=600&fit=crop&q=80',
    'mexico': 'https://images.unsplash.com/photo-1518105779142-d975f22f1d04?w=1200&h=600&fit=crop&q=80',
    'egypt': 'https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=1200&h=600&fit=crop&q=80',
    'turkey': 'https://images.unsplash.com/photo-1691446930608-98466a4bdd0f?w=1200&h=600&fit=crop&q=80',
    'greece': 'https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?w=1200&h=600&fit=crop&q=80',
    'portugal': 'https://images.unsplash.com/photo-1612179587665-70b70e8adfbf?w=1200&h=600&fit=crop&q=80',
    'netherlands': 'https://images.unsplash.com/photo-1581460436937-81f19e138de2?w=1200&h=600&fit=crop&q=80',
    'morocco': 'https://images.unsplash.com/photo-1673415819362-c2ca640bfafe?w=1200&h=600&fit=crop&q=80',
    'malaysia': 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1200&h=600&fit=crop&q=80',
    'uae': 'https://images.unsplash.com/photo-1546412414-8035e1776c9a?w=1200&h=600&fit=crop&q=80',
    'usa': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200&h=600&fit=crop&q=80',
    'uk': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&h=600&fit=crop&q=80'
  },
  airports: {
    'cdg': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'lhr': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'fco': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'ams': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'nrt': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'jfk': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'dxb': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'bkk': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'sin': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'hnd': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'icn': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'pvg': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'pek': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'bom': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'del': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'syd': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'yyz': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'gru': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'mex': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'cai': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'ist': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'ath': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'lis': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'cmn': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'kul': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'doh': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'ruh': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'kwi': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'bah': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'mct': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'amm': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'bey': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'bgw': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'ikr': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'kbl': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'khi': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'lhe': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'dac': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'cmb': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'ktm': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'rgn': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'pnh': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'vte': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'uln': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'ala': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'tas': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'fru': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'dus': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'asb': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'kef': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'dub': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'edi': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'gla': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'cwl': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'bhd': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'man': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'bhx': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'lba': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'lpl': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'ncl': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'she': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'bri': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'not': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'lce': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'cov': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'bdf': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'stk': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'wlv': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'ply': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'sou': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'por': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'swa': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'abz': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'dnd': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'inv': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'per': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'sti': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'dfe': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'ayr': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'klm': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'pai': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'ham': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'ekb': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'cnu': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'liv': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'glr': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'fai': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80'
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
  
  // Try country-specific fallbacks from country-images
  const countryImage = getHeaderImageForDestination(query);
  if (countryImage) {
    imageCache.set(cacheKey, countryImage);
    return countryImage;
  }

  if (!PEXELS_API_KEY) {
    const fallback = 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=1200&h=600&fit=crop&q=80';
    imageCache.set(cacheKey, fallback);
    return fallback;
  }

  try {
    // Enhance query with travel-specific terms for better results
    const enhancedQuery = query.includes('travel') || query.includes('landscape') || query.includes('cityscape') 
      ? query 
      : `${query} travel landscape`;
    
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(enhancedQuery)}&per_page=1&orientation=${orientation}`,
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
    const imageUrl = data.photos?.[0]?.src?.large || 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=1200&h=600&fit=crop&q=80';
    
    imageCache.set(cacheKey, imageUrl);
    return imageUrl;
  } catch (e) {
    const fallback = 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=1200&h=600&fit=crop&q=80';
    imageCache.set(cacheKey, fallback);
    return fallback;
  }
}

export async function getDestinationImage(query: string, orientation: 'landscape' | 'portrait' = 'landscape') {
  return await fetchPexelsImageOptimized(query, orientation);
}

export async function getAirportImage(airportName: string, destination?: string): Promise<string> {
  try {
    // Try GOMAPS.PRO API first for real airport image
    const gomapsPhotos = await getGomapsAirportPhotos(airportName, destination);
    if (gomapsPhotos.length > 0) {
      console.log(`Using GOMAPS.PRO photo for ${airportName}`);
      return gomapsPhotos[0]; // Return the first photo
    }
  } catch (error) {
    console.error(`Error fetching GOMAPS.PRO airport image for ${airportName}:`, error);
  }

  // Use optimized fallbacks for airports
  const normalizedAirport = airportName.toLowerCase();
  for (const [key, url] of Object.entries(optimizedFallbacks.airports)) {
    if (normalizedAirport.includes(key)) {
      return url;
    }
  }

  // Fallback to destination image or generic airport image
  if (destination) {
    return await getDestinationImage(destination);
  }

  return 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80';
}

export async function getAirportPhotos(airportName: string, destination?: string): Promise<string[]> {
  try {
    // Try GOMAPS.PRO API first for real airport photos
    const gomapsPhotos = await getGomapsAirportPhotos(airportName, destination);
    if (gomapsPhotos.length > 0) {
      console.log(`Found ${gomapsPhotos.length} GOMAPS.PRO photos for ${airportName}`);
      return gomapsPhotos;
    }
  } catch (error) {
    console.error(`Error fetching GOMAPS.PRO airport photos for ${airportName}:`, error);
  }

  console.log(`Falling back to Pexels API for ${airportName} (GOMAPS.PRO API not available)`);

  // Fallback to Pexels with airport-specific queries
  const airportQueries = [
    airportName, // "Narita International Airport"
    `${airportName} airport`, // "Narita International Airport airport"
    airportName.replace('International', '').replace('Airport', '').trim() + ' airport', // "Narita airport"
  ];

  for (const query of airportQueries) {
    const photos = await fetchPexelsImageOptimized(query, 'landscape');
    if (photos !== 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=1200&h=600&fit=crop&q=80') {
      console.log(`Found Pexels photo for query: ${query}`);
      return [photos];
    }
  }

  // Final fallback to single image
  const singleImage = await getAirportImage(airportName, destination);
  return singleImage ? [singleImage] : [];
}

// Function to get airport photos from GOMAPS.PRO API
async function getGomapsAirportPhotos(airportName: string, destination?: string): Promise<string[]> {
  try {
    if (!process.env.GOMAPS_API_KEY) {
      console.log('GOMAPS_API_KEY not found, skipping GOMAPS.PRO API');
      return [];
    }

    console.log(`Fetching airport photos from GOMAPS.PRO for: ${airportName}`);
    
    // Create search queries for the airport
    const searchQueries = [
      airportName, // "Narita International Airport"
      `${airportName} airport`, // "Narita International Airport airport"
      airportName.replace('International', '').replace('Airport', '').trim() + ' airport', // "Narita airport"
    ];

    // Try each search query
    for (const query of searchQueries) {
      const apiUrl = `https://maps.gomaps.pro/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${process.env.GOMAPS_API_KEY}`;
      
      const response = await fetch(apiUrl);

      if (!response.ok) {
        console.log(`GOMAPS.PRO API request failed for query "${query}": ${response.status}`);
        continue;
      }

      const data = await response.json();
      
      if (data.status === 'REQUEST_DENIED') {
        console.log(`GOMAPS.PRO API access denied for query "${query}": ${data.error_message || 'Unknown error'}`);
        if (data.error_message && data.error_message.includes('expired')) {
          console.log('💡 GOMAPS.PRO plan has expired. Falling back to Pexels API...');
        }
        continue;
      }
      
      if (data.status === 'ZERO_RESULTS') {
        console.log(`No results found for query "${query}"`);
        continue;
      }
      
      if (data.results && data.results.length > 0) {
        const airport = data.results[0];
        
        // Get photos for the airport
        if (airport.photos && airport.photos.length > 0) {
          const photos = airport.photos.slice(0, 5).map((photo: any) => {
            // Convert photo reference to actual image URL using GOMAPS.PRO
            return `https://maps.gomaps.pro/maps/api/place/photo?maxwidth=800&photoreference=${photo.photo_reference}&key=${process.env.GOMAPS_API_KEY}`;
          });
          
          console.log(`Found ${photos.length} photos for ${airport.name}`);
          return photos;
        }
      }
    }

    // If no airport found, try searching with destination
    if (destination) {
      const destinationQuery = `${airportName} ${destination}`;
      const apiUrl = `https://maps.gomaps.pro/maps/api/place/textsearch/json?query=${encodeURIComponent(destinationQuery)}&key=${process.env.GOMAPS_API_KEY}`;
      
      const response = await fetch(apiUrl);

      if (response.ok) {
        const data = await response.json();
        
        if (data.status === 'OK' && data.results && data.results.length > 0) {
          const airport = data.results[0];
          
          if (airport.photos && airport.photos.length > 0) {
            const photos = airport.photos.slice(0, 5).map((photo: any) => {
              return `https://maps.gomaps.pro/maps/api/place/photo?maxwidth=800&photoreference=${photo.photo_reference}&key=${process.env.GOMAPS_API_KEY}`;
            });
            
            console.log(`Found ${photos.length} photos for ${airport.name} with destination search`);
            return photos;
          }
        }
      }
    }

  } catch (error) {
    console.error('Error fetching airport photos from GOMAPS.PRO:', error);
  }
  
  return [];
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
    if (image !== 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=1200&h=600&fit=crop&q=80') {
      return image;
    }
  }
  
  return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop&q=80';
}

export async function getActivityImage(activityName: string, destination?: string): Promise<string> {
  // Use the same method as hotels - Google Places API first
  if (destination) {
    const googlePhoto = await fetchPexelsImageOptimized(activityName, 'landscape');
    if (googlePhoto !== 'https://images.pexels.com/photos/1502602898657-3e91760cbb34/pexels-photo-1502602898657-3e91760cbb34.jpeg?auto=compress&cs=tinysrgb&w=1200') {
      return googlePhoto;
    }
  }

  return await fetchPexelsImageOptimized(activityName, 'landscape');
}

export async function getDestinationHeaderImage(destination: string): Promise<string> {
  console.log('getDestinationHeaderImage called for:', destination);
  // First, check if we have a specific country image
  const countryImage = getHeaderImageForDestination(destination);
  if (countryImage) {
    console.log('Found country image:', countryImage);
    return countryImage;
  }
  
  // Extract country from destination (e.g., "Riyadh, Saudi Arabia" -> "Saudi Arabia")
  const country = destination.split(',').pop()?.trim() || destination;
  
  // Create multiple high-quality search queries for premium travel images
  const searchQueries = [
    `${country} iconic landmarks landscape`,    // "Saudi Arabia iconic landmarks landscape"
    `${country} scenic nature photography`,     // "Saudi Arabia scenic nature photography"
    `${country} famous skyline night`,          // "Saudi Arabia famous skyline night"
    `${country} beautiful travel destination`,  // "Saudi Arabia beautiful travel destination"
    `${country} tourism attractions`,           // "Saudi Arabia tourism attractions"
    `${country} aerial cityscape view`,         // "Saudi Arabia aerial cityscape view"
    `${country} sunset landscape`,              // "Saudi Arabia sunset landscape"
    `${country} cultural heritage site`,        // "Saudi Arabia cultural heritage site"
    `${country} top tourist spots`,             // "Saudi Arabia top tourist spots"
    `${country} 4k travel photography`,         // "Saudi Arabia 4k travel photography"
    `${country} travel photography`,            // "Saudi Arabia travel photography"
    `${country} cityscape`,                     // "Saudi Arabia cityscape"
    `${country} architecture`,                  // "Saudi Arabia architecture"
    `${country} landscape`,                     // "Saudi Arabia landscape"
    `${country}`,                              // "Saudi Arabia" (final fallback)
  ];
  
  // Try each premium query until we get a high-quality travel image
  for (const query of searchQueries) {
    const image = await fetchPexelsImageOptimized(query, 'landscape');
    // Check if we got a real premium image (not the fallback)
    if (image !== 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=1200&h=600&fit=crop&q=80') {
      return image;
    }
  }
  
  // Final fallback to our generic beautiful travel image
  return getFallbackHeaderImage();
}

// Generate affiliate links for hotels
export function generateHotelAffiliateLink(hotelName: string, destination: string): string {
  const searchQuery = encodeURIComponent(`${hotelName} ${destination}`);
  return `https://www.expedia.com/Hotel-Search?destination=${searchQuery}&aid=1234567&label=neyala-ai`;
}

// Generate eSIM affiliate links
export function generateESIMLink(destination: string): string {
  const country = destination.split(',')[1]?.trim() || destination;
  return `https://www.airalo.com/global-esim?ref=neyala-ai&country=${encodeURIComponent(country)}`;
} 