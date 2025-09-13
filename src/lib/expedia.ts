import axios from 'axios';
import { searchHotelsWithExpedia } from './expedia-scraper';
import { generateExpediaFallbackHotels } from './expedia-scraper';

interface HotelSearchParams {
  location: string;
  checkIn: string;
  checkOut: string;
  adults?: number;
  children?: number;
  rooms?: number;
}

export interface HotelOffer {
  id: string;
  name: string;
  stars: number;
  rating: number;
  price: number;
  currency: string;
  image: string;
  location: {
    lat: number;
    lng: number;
  };
  amenities: string[];
  description: string;
  bookingUrl: string;
  link?: string; // Add link field for compatibility
  source?: string; // Add source field for tracking data origin
  details?: {
    name: string;
    rating: number;
    reviewCount: number;
    address: string;
    photos: string[];
    website?: string;
    phone?: string;
    bookingUrls: {
      agoda: string;
      expedia: string;
      hotels: string;
      direct: string | null;
    };
  };
}

// Helper function to get coordinates from location string
function getLocationCoordinates(location: string): { lat: number; lng: number } {
  const coordinates: { [key: string]: { lat: number; lng: number } } = {
    'tokyo': { lat: 35.6762, lng: 139.6503 },
    'singapore': { lat: 1.3521, lng: 103.8198 },
    'new york': { lat: 40.7128, lng: -74.0060 },
    'london': { lat: 51.5074, lng: -0.1278 },
    'paris': { lat: 48.8566, lng: 2.3522 },
    'dubai': { lat: 25.2048, lng: 55.2708 },
    'bangkok': { lat: 13.7563, lng: 100.5018 },
    'bali': { lat: -8.3405, lng: 115.0920 }
  };
  
  const locationKey = location.toLowerCase().split(',')[0].trim();
  return coordinates[locationKey] || { lat: 35.6762, lng: 139.6503 };
}

export async function searchHotels(params: HotelSearchParams): Promise<HotelOffer[]> {
  try {
    console.log('Searching hotels for:', params.location);
    
    // Use Expedia scraper with Puppeteer
    const hotels = await searchHotelsWithExpedia(params.location, {
      maxHotels: 10,
      headless: true,
      useBrightData: true
    });
    
    if (hotels.length > 0) {
      console.log(`Found ${hotels.length} hotels using Expedia scraper`);
      return hotels;
    }
    
    // Fallback: Generate mock hotels if scraper fails
    console.log('Expedia scraper returned no hotels, using fallback hotels');
    return generateExpediaFallbackHotels(params.location, 10);
    
  } catch (error) {
    console.error('Error searching hotels:', error);
    console.log('Using fallback hotels due to error');
    return generateExpediaFallbackHotels(params.location, 10);
  }
}

// Generate consistent pricing based on hotel name, rating, and location
function generateConsistentPrice(hotelName: string, rating: number, location: string): number {
  // Create a deterministic hash from hotel name and location
  const hash = hotelName.toLowerCase().split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const locationHash = location.toLowerCase().split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  // Base price on rating and location
  let basePrice = 50;
  if (rating >= 4.5) basePrice = 200;
  else if (rating >= 4.0) basePrice = 150;
  else if (rating >= 3.5) basePrice = 100;
  else basePrice = 75;
  
  // Adjust for location (some cities are more expensive)
  const expensiveCities = ['new york', 'london', 'paris', 'tokyo', 'singapore', 'dubai'];
  const locationKey = location.toLowerCase().split(',')[0].trim();
  if (expensiveCities.includes(locationKey)) {
    basePrice *= 1.5;
  }
  
  // Add some variation based on hotel name hash
  const variation = (hash % 50) - 25;
  
  return Math.max(30, Math.round(basePrice + variation));
}

// Generate consistent rating based on hotel name and location
function generateConsistentRating(hotelName: string, location: string): number {
  const hash = hotelName.toLowerCase().split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  // Base rating between 3.5 and 4.8
  const baseRating = 3.5 + (Math.abs(hash) % 13) / 10;
  
  // Luxury hotels get higher ratings
  const luxuryKeywords = ['luxury', 'grand', 'royal', 'palace', 'resort', 'boutique'];
  const hasLuxuryKeyword = luxuryKeywords.some(keyword => 
    hotelName.toLowerCase().includes(keyword)
  );
  
  if (hasLuxuryKeyword) {
    return Math.min(4.8, baseRating + 0.3);
  }
  
  return baseRating;
}

// Generate consistent stars based on hotel name and rating
function generateConsistentStars(hotelName: string, rating: number): number {
  const luxuryKeywords = ['luxury', 'grand', 'royal', 'palace', 'resort'];
  const budgetKeywords = ['hostel', 'inn', 'lodge', 'motel'];
  
  const hasLuxuryKeyword = luxuryKeywords.some(keyword => 
    hotelName.toLowerCase().includes(keyword)
  );
  const hasBudgetKeyword = budgetKeywords.some(keyword => 
    hotelName.toLowerCase().includes(keyword)
  );
  
  if (hasLuxuryKeyword) return 5;
  if (hasBudgetKeyword) return 3;
  
  // Base stars on rating
  if (rating >= 4.5) return 5;
  if (rating >= 4.0) return 4;
  if (rating >= 3.5) return 3;
  return 2;
}

// Generate consistent amenities based on hotel type
function generateConsistentAmenities(hotelName: string, rating: number): string[] {
  const baseAmenities = ['WiFi'];
  const luxuryKeywords = ['luxury', 'grand', 'royal', 'palace', 'resort', 'boutique'];
  const budgetKeywords = ['hostel', 'inn', 'lodge', 'motel'];
  
  const hasLuxuryKeyword = luxuryKeywords.some(keyword => 
    hotelName.toLowerCase().includes(keyword)
  );
  const hasBudgetKeyword = budgetKeywords.some(keyword => 
    hotelName.toLowerCase().includes(keyword)
  );
  
  if (hasLuxuryKeyword) {
    return [...baseAmenities, 'Spa', 'Restaurant', 'Pool', 'Gym', 'Room Service', 'Concierge'];
  } else if (hasBudgetKeyword) {
    return [...baseAmenities, 'Kitchen', 'Common Room', 'Laundry'];
  } else {
    return [...baseAmenities, 'Air Conditioning', 'Breakfast', 'Parking', 'Business Center'];
  }
}

// Generate consistent description based on hotel type and location
function generateConsistentDescription(hotelName: string, location: string, rating: number): string {
  const luxuryKeywords = ['luxury', 'grand', 'royal', 'palace', 'resort'];
  const budgetKeywords = ['hostel', 'inn', 'lodge', 'motel'];
  
  const hasLuxuryKeyword = luxuryKeywords.some(keyword => 
    hotelName.toLowerCase().includes(keyword)
  );
  const hasBudgetKeyword = budgetKeywords.some(keyword => 
    hotelName.toLowerCase().includes(keyword)
  );
  
  if (hasLuxuryKeyword) {
    return `Premium luxury accommodation in ${location} with world-class amenities and exceptional service. Perfect for discerning travelers seeking the finest experience.`;
  } else if (hasBudgetKeyword) {
    return `Affordable accommodation in ${location} perfect for budget-conscious travelers. Clean, comfortable rooms with essential amenities.`;
  } else {
    return `Comfortable accommodation in ${location} offering great value and modern amenities. Ideal for both business and leisure travelers.`;
  }
}

// Generate consistent image based on hotel type
function generateConsistentImage(hotelName: string, rating: number): string {
  const luxuryKeywords = ['luxury', 'grand', 'royal', 'palace', 'resort'];
  const budgetKeywords = ['hostel', 'inn', 'lodge', 'motel'];
  
  const hasLuxuryKeyword = luxuryKeywords.some(keyword => 
    hotelName.toLowerCase().includes(keyword)
  );
  const hasBudgetKeyword = budgetKeywords.some(keyword => 
    hotelName.toLowerCase().includes(keyword)
  );
  
  if (hasLuxuryKeyword) {
    return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop&q=80';
  } else if (hasBudgetKeyword) {
    return 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop&q=80';
  } else {
    return 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop&q=80';
  }
}

// Add affiliate parameters to the booking URL
function addAffiliateParams(url: string): string {
  const urlObj = new URL(url);
  urlObj.searchParams.set('aid', '1891470'); // Your Expedia affiliate ID
  urlObj.searchParams.set('utm_source', 'neyalaAI');
  urlObj.searchParams.set('utm_medium', 'travel_planner');
  urlObj.searchParams.set('utm_campaign', 'hotel_booking');
  return urlObj.toString();
}

// Generate Expedia search URL with affiliate parameters
function generateExpediaSearchUrl(searchQuery: string): string {
  const baseUrl = `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(searchQuery)}`;
  return addAffiliateParams(baseUrl);
}

// Get hotel details from external API (GOMAPS.PRO)
export async function getHotelDetails(hotelName: string, destination: string): Promise<any> {
  try {
    console.log(`Getting details for ${hotelName} in ${destination}`);
    
    // Use GOMAPS.PRO API to get hotel details
    const searchQuery = `${hotelName} ${destination}`;
    const apiUrl = `https://api.gomaps.pro/v1/places/search?query=${encodeURIComponent(searchQuery)}&type=lodging&limit=1`;
    
    const response = await axios.get(apiUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.GOMAPS_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.data.results || response.data.results.length === 0) {
      console.log('No hotel details found from GOMAPS.PRO');
      return null;
    }
    
    const hotel = response.data.results[0];
    
    // Get photos for the hotel
    let photos: string[] = [];
    if (hotel.photos && hotel.photos.length > 0) {
      photos = hotel.photos.slice(0, 5).map((photo: any) => photo.photo_reference);
    }
    
    // Generate booking URLs
    const bookingUrls = generateBookingUrls(hotel.name, destination);
    
    return {
      name: hotel.name,
      rating: hotel.rating || 0,
      reviewCount: hotel.user_ratings_total || 0,
      address: hotel.formatted_address,
      location: hotel.geometry?.location,
      photos: photos,
      website: hotel.website,
      phone: hotel.formatted_phone_number,
      priceLevel: hotel.price_level,
      openingHours: hotel.opening_hours?.weekday_text,
      reviews: hotel.reviews?.slice(0, 3) || [],
      bookingUrls: bookingUrls
    };

  } catch (error) {
    console.error('Error getting hotel details from GOMAPS.PRO:', error);
    return null;
  }
}

function generateBookingUrls(hotelName: string, destination: string) {
  const searchQuery = encodeURIComponent(`${hotelName} ${destination}`);
  
  return {
    agoda: `https://www.agoda.com/search?q=${searchQuery}&aid=1891470&utm_source=neyalaAI&utm_medium=travel_planner&utm_campaign=hotel_booking`,
    expedia: `https://www.expedia.com/Hotel-Search?destination=${searchQuery}&aid=1891470&utm_source=neyalaAI&utm_medium=travel_planner&utm_campaign=hotel_booking`,
    hotels: `https://www.hotels.com/search.do?q-destination=${searchQuery}&aid=1891470&utm_source=neyalaAI&utm_medium=travel_planner&utm_campaign=hotel_booking`,
    direct: null // Will be set if hotel has website
  };
}

// Generate mock hotels when all other methods fail
export function generateMockHotels(location: string): HotelOffer[] {
  const locationKey = location.toLowerCase().split(',')[0].trim();
  const coordinates = getLocationCoordinates(location);
  
  const mockHotels = [
    {
      id: 'mock_1',
      name: `Luxury Hotel ${locationKey}`,
      stars: 5,
      rating: 4.8,
      price: 250,
      currency: 'USD',
      image: `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop&q=80`,
      location: coordinates,
      amenities: ['WiFi', 'Spa', 'Restaurant', 'Pool', 'Gym', 'Room Service'],
      description: `Premium luxury accommodation in ${location} with world-class amenities and service.`,
      bookingUrl: `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(`Luxury Hotel ${locationKey}`)}&aid=1891470&utm_source=neyalaAI&utm_medium=travel_planner&utm_campaign=hotel_booking`,
      link: `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(`Luxury Hotel ${locationKey}`)}&aid=1891470&utm_source=neyalaAI&utm_medium=travel_planner&utm_campaign=hotel_booking`,
      source: 'Expedia Mock'
    },
    {
      id: 'mock_2',
      name: `Comfort Inn ${locationKey}`,
      stars: 4,
      rating: 4.2,
      price: 120,
      currency: 'USD',
      image: `https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop&q=80`,
      location: coordinates,
      amenities: ['WiFi', 'Breakfast', 'Parking', 'Business Center'],
      description: `Comfortable mid-range hotel in ${location} with modern amenities and great value.`,
      bookingUrl: `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(`Comfort Inn ${locationKey}`)}&aid=1891470&utm_source=neyalaAI&utm_medium=travel_planner&utm_campaign=hotel_booking`,
      link: `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(`Comfort Inn ${locationKey}`)}&aid=1891470&utm_source=neyalaAI&utm_medium=travel_planner&utm_campaign=hotel_booking`,
      source: 'Expedia Mock'
    },
    {
      id: 'mock_3',
      name: `Budget Hostel ${locationKey}`,
      stars: 3,
      rating: 3.8,
      price: 45,
      currency: 'USD',
      image: `https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop&q=80`,
      location: coordinates,
      amenities: ['WiFi', 'Kitchen', 'Common Room', 'Laundry'],
      description: `Affordable hostel accommodation in ${location} perfect for budget travelers.`,
      bookingUrl: `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(`Hostel ${locationKey}`)}&aid=1891470&utm_source=neyalaAI&utm_medium=travel_planner&utm_campaign=hotel_booking`,
      link: `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(`Hostel ${locationKey}`)}&aid=1891470&utm_source=neyalaAI&utm_medium=travel_planner&utm_campaign=hotel_booking`,
      source: 'Expedia Mock'
    },
    {
      id: 'mock_4',
      name: `Boutique Hotel ${locationKey}`,
      stars: 4,
      rating: 4.5,
      price: 180,
      currency: 'USD',
      image: `https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop&q=80`,
      location: coordinates,
      amenities: ['WiFi', 'Restaurant', 'Bar', 'Concierge', 'Spa'],
      description: `Charming boutique hotel in ${location} offering personalized service and unique character.`,
      bookingUrl: `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(`Boutique Hotel ${locationKey}`)}&aid=1891470&utm_source=neyalaAI&utm_medium=travel_planner&utm_campaign=hotel_booking`,
      link: `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(`Boutique Hotel ${locationKey}`)}&aid=1891470&utm_source=neyalaAI&utm_medium=travel_planner&utm_campaign=hotel_booking`,
      source: 'Expedia Mock'
    }
  ];
  
  return mockHotels;
}
