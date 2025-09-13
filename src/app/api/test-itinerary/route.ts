import { NextResponse } from 'next/server';
import { searchHotelsWithBooking } from '@/lib/booking-scraper';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const location = searchParams.get('location') || 'Paris, France';
    const checkIn = searchParams.get('checkIn') || '2025-09-17';
    const checkOut = searchParams.get('checkOut') || '2025-09-21';

    // Test hotel scraping
    const hotelSearchParams = {
      location,
      checkIn,
      checkOut,
      adults: 2,
      rooms: 1
    };

    const realHotels = await searchHotelsWithBooking({
      destination: location,
      maxHotels: 10
    });
    
    // Create a simple itinerary structure with real hotel data
    const testItinerary = {
      destination: location,
      dates: {
        start: checkIn,
        end: checkOut
      },
      headerImage: "https://images.unsplash.com/photo-1502602898534-47d3c0c0b0b0?w=800&h=600&fit=crop",
      overview: {
        history: "Test destination with rich history",
        culture: "Diverse cultural heritage"
      },
      airport: {
        name: "Main Airport",
        image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop",
        info: "International airport serving the region"
      },
      hotels: realHotels, // This will contain the real scraped data
      activities: [
        {
          name: "City Tour",
          description: "Explore the main attractions",
          image: "https://images.unsplash.com/photo-1502602898534-47d3c0c0b0b0?w=800&h=600&fit=crop",
          day: 1,
          time: "09:00",
          location: { lat: 48.8566, lng: 2.3522 }
        }
      ],
      transportation: [
        {
          type: "Metro",
          description: "Efficient public transportation",
          icon: "/icons/metro.svg"
        }
      ],
      estimatedCost: {
        accommodation: 500,
        activities: 300,
        transportation: 100,
        food: 200,
        total: 1100
      }
    };

    return NextResponse.json({
      success: true,
      itinerary: testItinerary,
      hotelCount: realHotels.length,
      message: "Test itinerary with real hotel data from Booking.com"
    });

  } catch (error) {
    console.error('Test itinerary error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
