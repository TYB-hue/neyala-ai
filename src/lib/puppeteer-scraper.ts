import { HotelOffer } from './expedia';

export interface PuppeteerHotelData {
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

export interface PuppeteerScraperOptions {
  headless?: boolean;
  useBrightData?: boolean;
  maxHotels?: number;
}

export async function searchHotelsWithPuppeteer(
  location: string,
  options: PuppeteerScraperOptions = {}
): Promise<HotelOffer[]> {
  try {
    console.log(`Searching hotels for ${location} using Puppeteer scraper...`);
    
    // Import the Puppeteer scraper dynamically
    const { exec } = require('child_process');
    const { promisify } = require('util');
    const execAsync = promisify(exec);
    
    const maxHotels = options.maxHotels || 10;
    const headless = options.headless !== false;
    const useBrightData = options.useBrightData !== false;
    
    // Run the Puppeteer scraper
    const command = `node scripts/hotel_scraper_puppeteer.js "${location}" ${maxHotels} ${headless} ${useBrightData}`;
    
    console.log(`Executing: ${command}`);
    
    const { stdout, stderr } = await execAsync(command, {
      timeout: 180000, // 3 minutes timeout (increased from 2 minutes)
      env: {
        ...process.env,
        // Add Bright Data environment variables
        BRIGHT_DATA_API_KEY: process.env.BRIGHT_DATA_API_KEY || 'c599910cc50aa538b352af88a6e04da8eb9275f0f96f86979027e0025f99b67d',
        BRIGHT_DATA_ZONE: process.env.BRIGHT_DATA_ZONE || 'nyala_travel'
      }
    });
    
    if (stderr) {
      console.error('Puppeteer scraper stderr:', stderr);
    }
    
    // Parse the JSON output from the scraper
    const lines = stdout.trim().split('\n');
    const jsonLine = lines[lines.length - 1]; // Last line should be JSON
    
    let hotels: PuppeteerHotelData[];
    try {
      hotels = JSON.parse(jsonLine);
    } catch (error) {
      console.error('Error parsing Puppeteer scraper output:', error);
      console.log('Raw output:', stdout);
      return [];
    }
    
    if (!Array.isArray(hotels)) {
      console.error('Puppeteer scraper did not return an array');
      return [];
    }
    
    // Check if we got real data or fallback data
    const isRealData = hotels.length > 0 && hotels[0].source && !hotels[0].source.includes('Fallback');
    
    if (isRealData) {
      console.log(`Successfully scraped ${hotels.length} hotels with Puppeteer`);
    } else {
      console.log(`Puppeteer returned fallback data (${hotels.length} hotels)`);
    }
    
    // Convert to HotelOffer format
    return hotels.map((hotel: PuppeteerHotelData) => ({
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
    console.error('Error in searchHotelsWithPuppeteer:', error);
    return [];
  }
}

// Fallback function that generates realistic hotel data
export function generateFallbackHotels(location: string, maxHotels: number = 10): HotelOffer[] {
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

    const fallbackImages = [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop&q=80'
    ];

    hotels.push({
      id: `fallback_${i + 1}`,
      name: template.name,
      stars: Math.floor(rating),
      rating: Math.round(rating * 10) / 10,
      price: price,
      currency: 'USD',
      image: fallbackImages[i % fallbackImages.length],
      location: { lat: 0, lng: 0 },
      amenities: ['WiFi', 'Air Conditioning', 'Free Breakfast'],
      description: `Comfortable ${template.type} accommodation in ${location}`,
      bookingUrl: `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(template.name)}`,
      details: {
        name: template.name,
        rating: Math.round(rating * 10) / 10,
        reviewCount: Math.floor(Math.random() * 1000) + 50,
        address: location,
        photos: [fallbackImages[i % fallbackImages.length]],
        website: `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(template.name)}`,
        phone: '',
        bookingUrls: {
          agoda: `https://www.agoda.com/search?q=${encodeURIComponent(template.name)}&aid=1891470`,
          expedia: `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(location)}&aid=1891470`,
          hotels: `https://www.hotels.com/search.do?q-destination=${encodeURIComponent(location)}&aid=1891470`,
          direct: `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(template.name)}`
        }
      }
    });
  }

  return hotels;
}
