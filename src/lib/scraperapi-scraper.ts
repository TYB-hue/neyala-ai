import { HotelOffer } from '@/types';

export interface ScraperApiScraperOptions {
  useScraperApi?: boolean;
  maxHotels?: number;
  headless?: boolean;
}

export interface ScraperApiHotelData {
  id: string;
  name: string;
  price: number;
  currency: string;
  rating: number;
  reviewCount: number;
  avgReview: string;
  images: string[];
  bookingUrl: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  amenities: string[];
  description: string;
  scrapedAt: string;
  source: string;
}

export async function searchHotelsWithScraperApi(
  location: string,
  options: ScraperApiScraperOptions = {}
): Promise<HotelOffer[]> {
  try {
    console.log(`Searching hotels for ${location} using ScraperAPI scraper...`);
    
    // Import the ScraperAPI scraper dynamically
    const { exec } = require('child_process');
    const { promisify } = require('util');
    const execAsync = promisify(exec);
    
    const maxHotels = options.maxHotels || 10;
    const headless = options.headless !== false;
    const useScraperApi = options.useScraperApi !== false;
    
    // Run the ScraperAPI scraper
    const command = `node scripts/hotel_scraper_scraperapi.js "${location}" ${maxHotels} ${headless} ${useScraperApi}`;
    
    console.log(`Executing: ${command}`);
    
    const { stdout, stderr } = await execAsync(command, {
      timeout: 180000, // 3 minutes timeout
      env: {
        ...process.env,
        // Add ScraperAPI environment variables
        SCRAPER_API_KEY: process.env.SCRAPER_API_KEY || ''
      }
    });
    
    if (stderr) {
      console.error('ScraperAPI scraper stderr:', stderr);
    }
    
    // Parse the JSON output from the scraper
    const lines = stdout.trim().split('\n');
    const jsonLine = lines[lines.length - 1]; // Last line should be JSON
    
    let hotels: ScraperApiHotelData[];
    try {
      hotels = JSON.parse(jsonLine);
    } catch (error) {
      console.error('Error parsing ScraperAPI scraper output:', error);
      console.log('Raw output:', stdout);
      return [];
    }
    
    if (!Array.isArray(hotels)) {
      console.error('ScraperAPI scraper did not return an array');
      return [];
    }
    
    // Check if we got real data or fallback data
    const isRealData = hotels.length > 0 && hotels[0].source && !hotels[0].source.includes('Fallback');
    
    if (isRealData) {
      console.log(`✅ Successfully scraped ${hotels.length} real hotels using ScraperAPI`);
    } else {
      console.log(`⚠️ Using fallback data for ${hotels.length} hotels`);
    }
    
    // Convert to HotelOffer format
    const hotelOffers: HotelOffer[] = hotels.map((hotel, index) => ({
      id: hotel.id,
      name: hotel.name,
      stars: Math.floor(hotel.rating),
      rating: hotel.rating,
      price: hotel.price,
      currency: hotel.currency,
      image: hotel.images[0] || '',
      location: hotel.location,
      amenities: hotel.amenities,
      description: hotel.description,
      bookingUrl: hotel.bookingUrl,
      source: hotel.source,
      details: {
        name: hotel.name,
        rating: hotel.rating,
        reviewCount: hotel.reviewCount,
        address: hotel.address,
        photos: hotel.images,
        website: hotel.bookingUrl,
        phone: '',
        bookingUrls: {
          agoda: `https://www.agoda.com/search?q=${encodeURIComponent(hotel.name)}&aid=1891470`,
          expedia: `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(location)}&aid=1891470`,
          hotels: `https://www.hotels.com/search.do?q-destination=${encodeURIComponent(location)}&aid=1891470`,
          direct: hotel.bookingUrl
        }
      }
    }));
    
    return hotelOffers;
    
  } catch (error) {
    console.error('Error in ScraperAPI scraper:', error);
    return [];
  }
}

// Direct ScraperAPI API call function
export async function callScraperApi(url: string, options: {
  render?: boolean;
  premium?: boolean;
  country_code?: string;
} = {}): Promise<string | null> {
  try {
    const apiKey = process.env.SCRAPER_API_KEY;
    if (!apiKey) {
      console.error('ScraperAPI key not found in environment variables');
      return null;
    }
    
    const params = new URLSearchParams({
      api_key: apiKey,
      url: url,
      render: options.render ? 'true' : 'false',
      premium: options.premium ? 'true' : 'false',
      country_code: options.country_code || 'us'
    });
    
    const response = await fetch(`https://api.scraperapi.com/api/v1/?${params.toString()}`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    
    if (response.ok) {
      const content = await response.text();
      console.log('✅ ScraperAPI request successful');
      return content;
    } else {
      console.error(`❌ ScraperAPI error: ${response.status} - ${response.statusText}`);
      return null;
    }
  } catch (error) {
    console.error('❌ Error calling ScraperAPI:', error);
    return null;
  }
}

// Test function for ScraperAPI
export async function testScraperApi(): Promise<boolean> {
  try {
    const testUrl = 'https://httpbin.org/ip';
    const result = await callScraperApi(testUrl, { render: false });
    
    if (result) {
      console.log('✅ ScraperAPI test successful');
      console.log('Response:', result.substring(0, 200) + '...');
      return true;
    } else {
      console.log('❌ ScraperAPI test failed');
      return false;
    }
  } catch (error) {
    console.error('❌ ScraperAPI test error:', error);
    return false;
  }
}
