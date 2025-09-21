import { NextRequest, NextResponse } from 'next/server';
import { searchHotelsWithBooking } from '@/lib/booking-scraper';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location') || 'Tokyo, Japan';
    
    console.log(`API: Searching hotels for location: ${location}`);
    console.log('Using Booking.com scraper for hotel search');
    
    // Use the Booking.com scraper
    const hotels = await searchHotelsWithBooking({
      destination: location,
      maxHotels: 10,
      useScraperApi: true
    });
    
    // Convert BookingHotelData to the format expected by frontend
    const convertedHotels = hotels.map(hotel => ({
      id: hotel.id,
      name: hotel.name,
      stars: hotel.stars,
      rating: hotel.rating,
      price: hotel.price,
      currency: hotel.currency,
      images: hotel.images,
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
    
    return NextResponse.json({
      success: true,
      location,
      hotels: convertedHotels,
      count: convertedHotels.length,
      message: `Found ${convertedHotels.length} hotels for ${location}`
    });
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch hotels',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { location, checkInDate, checkOutDate } = body;
    
    if (!location) {
      return NextResponse.json(
        { success: false, error: 'Location is required' },
        { status: 400 }
      );
    }
    
    console.log(`API: Searching hotels for location: ${location}`);
    console.log('Using Booking.com scraper for hotel search');
    
    // Use the Booking.com scraper
    const hotels = await searchHotelsWithBooking({
      destination: location,
      maxHotels: 10,
      useScraperApi: true
    });
    
    // Convert BookingHotelData to the format expected by frontend
    const convertedHotels = hotels.map(hotel => ({
      id: hotel.id,
      name: hotel.name,
      stars: hotel.stars,
      rating: hotel.rating,
      price: hotel.price,
      currency: hotel.currency,
      images: hotel.images,
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
    
    return NextResponse.json({
      success: true,
      location,
      hotels: convertedHotels,
      count: convertedHotels.length,
      message: `Found ${convertedHotels.length} hotels for ${location}`
    });
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch hotels',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
