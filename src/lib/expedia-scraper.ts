import { HotelOffer } from './expedia';
import { getHotelImage } from '@/lib/unsplash';

export interface ExpediaHotelData {
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
  location: { lat: number; lng: number };
  amenities: string[];
  description: string;
  scrapedAt: string;
  source: string;
}

export interface ExpediaScraperOptions {
  headless?: boolean;
  useBrightData?: boolean;
  maxHotels?: number;
}

export async function searchHotelsWithExpedia(
  location: string,
  options: ExpediaScraperOptions = {}
): Promise<HotelOffer[]> {
  try {
    console.log(`Searching hotels for ${location} using Expedia scraper...`);
    
    // Import the Expedia scraper dynamically
    const { exec } = require('child_process');
    const { promisify } = require('util');
    const execAsync = promisify(exec);
    
    const maxHotels = options.maxHotels || 10;
    const headless = options.headless !== false;
    const useBrightData = options.useBrightData !== false;
    
    // Run the improved Expedia stealth scraper
    const command = `node scripts/hotel_scraper_stealth_improved.js "${location}" ${maxHotels} ${headless} ${useBrightData}`;
    
    console.log(`Executing: ${command}`);
    
    const { stdout, stderr } = await execAsync(command, {
      timeout: 180000, // 3 minutes timeout
      env: {
        ...process.env,
        // Add Bright Data environment variables
        BRIGHT_DATA_API_KEY: process.env.BRIGHT_DATA_API_KEY || 'c599910cc50aa538b352af88a6e04da8eb9275f0f96f86979027e0025f99b67d',
        BRIGHT_DATA_ZONE: process.env.BRIGHT_DATA_ZONE || 'nyala_travel'
      }
    });
    
    if (stderr) {
      console.error('Expedia scraper stderr:', stderr);
    }
    
    // Parse the JSON output from the scraper
    const lines = stdout.trim().split('\n');
    const jsonLine = lines[lines.length - 1]; // Last line should be JSON
    
    let hotels: ExpediaHotelData[];
    try {
      hotels = JSON.parse(jsonLine);
    } catch (error) {
      console.error('Error parsing Expedia scraper output:', error);
      console.log('Raw output:', stdout);
      return [];
    }
    
    if (!Array.isArray(hotels)) {
      console.error('Expedia scraper did not return an array');
      return [];
    }
    
    // Check if we got real data or fallback data
    const isRealData = hotels.length > 0 && hotels[0].source && !hotels[0].source.includes('Fallback');
    
    if (isRealData) {
      console.log(`Successfully scraped ${hotels.length} hotels with Expedia`);
    } else {
      console.log(`Expedia returned fallback data (${hotels.length} hotels)`);
    }
    
    // Convert to HotelOffer format
    return hotels.map((hotel: ExpediaHotelData) => ({
      id: hotel.id,
      name: hotel.name,
      stars: Math.floor(hotel.rating),
      rating: hotel.rating,
      price: hotel.price,
      currency: hotel.currency,
      image: hotel.images[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
      location: hotel.location,
      amenities: hotel.amenities,
      description: hotel.description,
      bookingUrl: hotel.bookingUrl,
      source: hotel.source || 'Expedia (Improved Stealth)',
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
    
  } catch (error) {
    console.error('Error in searchHotelsWithExpedia:', error);
    return [];
  }
}

// Fallback function that generates realistic hotel data
export async function generateExpediaFallbackHotels(location: string, maxHotels: number = 10): Promise<HotelOffer[]> {
  console.log(`Generating ${maxHotels} fallback hotels for ${location}`);
  
  const locationKey = location.toLowerCase().split(',')[0].trim();
  
  const templates = [
    { name: `Grand ${locationKey} Hotel`, type: 'luxury' },
    { name: `${locationKey} Comfort Inn`, type: 'mid' },
    { name: `${locationKey} Hostel`, type: 'budget' },
    { name: `${locationKey} Plaza Hotel`, type: 'luxury' },
    { name: `${locationKey} Express Inn`, type: 'mid' },
    { name: `${locationKey} Marriott`, type: 'luxury' },
    { name: `${locationKey} Hilton`, type: 'luxury' },
    { name: `${locationKey} Hyatt`, type: 'luxury' }
  ];

  const hotels: HotelOffer[] = [];
  
  for (let i = 0; i < Math.min(templates.length, maxHotels); i++) {
    const template = templates[i];
    let price: number, rating: number;

    if (template.type === 'luxury') {
      price = Math.floor(Math.random() * 500) + 300;
      rating = 4.5 + (Math.random() * 0.5);
    } else if (template.type === 'mid') {
      price = Math.floor(Math.random() * 200) + 150;
      rating = 4.0 + (Math.random() * 0.8);
    } else {
      price = Math.floor(Math.random() * 100) + 50;
      rating = 3.5 + (Math.random() * 0.5);
    }

    // Get hotel image using the improved image fetching
    let hotelImage = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop&q=80';
    try {
      hotelImage = await getHotelImage(template.name, location);
    } catch (error) {
      console.error(`Error fetching image for ${template.name}:`, error);
    }

    hotels.push({
      id: `fallback_${i + 1}`,
      name: template.name,
      stars: Math.floor(rating),
      rating: Math.round(rating * 10) / 10,
      price: price,
      currency: 'USD',
      image: hotelImage,
      location: { lat: 0, lng: 0 },
      amenities: ['WiFi', 'Air Conditioning', 'Free Breakfast'],
      description: `Comfortable ${template.type} accommodation in ${location}`,
      bookingUrl: `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(location)}`,
      source: 'Expedia Fallback',
      details: {
        name: template.name,
        rating: Math.round(rating * 10) / 10,
        reviewCount: Math.floor(Math.random() * 1000) + 50,
        address: location,
        photos: [hotelImage],
        website: `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(location)}`,
        phone: '',
        bookingUrls: {
          agoda: `https://www.agoda.com/search?q=${encodeURIComponent(template.name)}&aid=1891470`,
          expedia: `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(location)}&aid=1891470`,
          hotels: `https://www.hotels.com/search.do?q-destination=${encodeURIComponent(location)}&aid=1891470`,
          direct: `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(location)}`
        }
      }
    });
  }

  return hotels;
}

