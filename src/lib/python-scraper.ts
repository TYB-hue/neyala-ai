import { HotelOffer } from './expedia';
import { searchHotelsWithPuppeteer, generateFallbackHotels } from './puppeteer-scraper';

// Re-export the Puppeteer functions for backward compatibility
export { searchHotelsWithPuppeteer, generateFallbackHotels };

// Main function to search hotels using Puppeteer
export async function searchHotels(params: {
  location: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  rooms: number;
}): Promise<HotelOffer[]> {
  try {
    console.log(`Searching hotels for: ${params.location}`);
    
    // Try Puppeteer scraper first
    const hotels = await searchHotelsWithPuppeteer(params.location, {
      headless: true,
      useBrightData: true,
      maxHotels: 10
    });
    
    if (hotels.length > 0) {
      console.log(`Found ${hotels.length} hotels with Puppeteer scraper`);
      return hotels;
    }
    
    // Fallback to generated hotels
    console.log('Puppeteer scraper returned no results, using fallback hotels');
    return generateFallbackHotels(params.location, 10);
    
  } catch (error) {
    console.error('Error in searchHotels:', error);
    return generateFallbackHotels(params.location, 10);
  }
}

// Convert Python hotel data to HotelOffer format (for backward compatibility)
export function convertPythonToHotelOffer(hotel: any): HotelOffer {
  return {
    id: hotel.id || `hotel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: hotel.name || hotel.hotel || 'Unknown Hotel',
    stars: Math.floor(hotel.rating || hotel.stars || 4),
    rating: hotel.rating || 4.0,
    price: hotel.price || 150,
    currency: hotel.currency || 'USD',
    image: hotel.image || hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
    location: hotel.location || { lat: 0, lng: 0 },
    amenities: hotel.amenities || ['WiFi', 'Air Conditioning', 'Free Breakfast'],
    description: hotel.description || `Comfortable accommodation - ${hotel.name || 'Hotel'}`,
    bookingUrl: hotel.bookingUrl || hotel.booking_url || `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(hotel.name || 'Hotel')}`,
    details: {
      name: hotel.name || hotel.hotel || 'Unknown Hotel',
      rating: hotel.rating || 4.0,
      reviewCount: hotel.reviewCount || hotel.review_count || Math.floor(Math.random() * 1000) + 50,
      address: hotel.address || 'Address not available',
      photos: hotel.images || hotel.photos || ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop'],
      website: hotel.bookingUrl || hotel.booking_url || `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(hotel.name || 'Hotel')}`,
      phone: hotel.phone || '',
      bookingUrls: {
        agoda: `https://www.agoda.com/search?q=${encodeURIComponent(hotel.name || 'Hotel')}&aid=1891470`,
        expedia: `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(hotel.location || 'Unknown')}&aid=1891470`,
        hotels: `https://www.hotels.com/search.do?q-destination=${encodeURIComponent(hotel.location || 'Unknown')}&aid=1891470`,
        direct: hotel.bookingUrl || hotel.booking_url || `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(hotel.name || 'Hotel')}`
      }
    }
  };
}
