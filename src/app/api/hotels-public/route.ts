import { NextRequest, NextResponse } from 'next/server';
import { searchHotelsWithBooking } from '@/lib/booking-scraper';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { destination, startDate, endDate, travelGroup } = body;

    if (!destination) {
      return NextResponse.json({ 
        success: false, 
        error: 'Destination is required' 
      }, { status: 400 });
    }

    // Parse travel group to get number of adults
    let adults = 2; // default
    if (travelGroup) {
      const match = travelGroup.match(/(\d+)\s*adults?/i);
      if (match) {
        adults = parseInt(match[1]);
      }
    }

    console.log(`Searching hotels for: ${destination}`);
    console.log(`Adults: ${adults}`);

    try {
      // Use the Booking.com scraper
      console.log('Calling searchHotelsWithBooking...');
      const hotels = await searchHotelsWithBooking({
        destination,
        startDate,
        endDate,
        travelGroup,
        maxHotels: 10,
        useScraperApi: true
      });
      console.log('searchHotelsWithBooking returned:', hotels.length, 'hotels');
      console.log('First hotel source:', hotels[0]?.source);

      if (hotels.length > 0) {
        // Check if the hotels are real data or fallback data
        const isRealData = hotels.length > 0 && hotels[0].name && 
                          !hotels[0].name.toLowerCase().includes('fallback') &&
                          !hotels[0].name.toLowerCase().includes('grand') &&
                          !hotels[0].name.toLowerCase().includes('comfort inn') &&
                          !hotels[0].name.toLowerCase().includes('hostel') &&
                          hotels[0].source && hotels[0].source.includes('Booking.com');
        
        const source = isRealData ? 'Booking.com' : 'Fallback';
        console.log(`Found ${hotels.length} hotels with source: ${source}`);
        
        // Convert BookingHotelData to the format expected by AsyncHotelOffers
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
              expedia: `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(destination)}&aid=1891470`,
              hotels: `https://www.hotels.com/search.do?q-destination=${encodeURIComponent(destination)}&aid=1891470`,
              direct: hotel.bookingUrl
            }
          }
        }));

        return NextResponse.json({
          success: true,
          hotels: convertedHotels,
          count: convertedHotels.length,
          source: source
        });
      } else {
        console.log('ScraperAPI scraper returned no results, using fallback');
        // Generate simple fallback hotels
        const fallbackHotels = Array.from({ length: 5 }, (_, i) => ({
          id: `fallback_${i + 1}`,
          name: `Hotel ${i + 1} ${destination}`,
          stars: 4,
          rating: 4.0 + Math.random() * 0.8,
          price: Math.floor(Math.random() * 200) + 100,
          currency: 'USD',
          images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop&q=80'],
          location: { lat: 0, lng: 0 },
          amenities: ['WiFi', 'Air Conditioning', 'Free Breakfast'],
          description: `Comfortable accommodation in ${destination}`,
          bookingUrl: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(destination)}`,
          source: 'Fallback',
          details: {
            name: `Hotel ${i + 1} ${destination}`,
            rating: 4.0 + Math.random() * 0.8,
            reviewCount: Math.floor(Math.random() * 1000) + 50,
            address: destination,
            photos: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop&q=80'],
            website: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(destination)}`,
            phone: '',
            bookingUrls: {
              agoda: `https://www.agoda.com/search?q=${encodeURIComponent(destination)}&aid=1891470`,
              expedia: `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(destination)}&aid=1891470`,
              hotels: `https://www.hotels.com/search.do?q-destination=${encodeURIComponent(destination)}&aid=1891470`,
              direct: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(destination)}`
            }
          }
        }));

        return NextResponse.json({
          success: true,
          hotels: fallbackHotels,
          count: fallbackHotels.length,
          source: 'Fallback'
        });
      }
    } catch (hotelError) {
      console.error('Error with ScraperAPI scraper:', hotelError);
      
      // Fallback to generated hotels
      const fallbackHotels = Array.from({ length: 5 }, (_, i) => ({
        id: `fallback_${i + 1}`,
        name: `Hotel ${i + 1} ${destination}`,
        stars: 4,
        rating: 4.0 + Math.random() * 0.8,
        price: Math.floor(Math.random() * 200) + 100,
        currency: 'USD',
        images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop&q=80'],
        location: { lat: 0, lng: 0 },
        amenities: ['WiFi', 'Air Conditioning', 'Free Breakfast'],
        description: `Comfortable accommodation in ${destination}`,
        bookingUrl: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(destination)}`,
        source: 'Fallback (Error)',
        details: {
          name: `Hotel ${i + 1} ${destination}`,
          rating: 4.0 + Math.random() * 0.8,
          reviewCount: Math.floor(Math.random() * 1000) + 50,
          address: destination,
          photos: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop&q=80'],
          website: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(destination)}`,
          phone: '',
          bookingUrls: {
            agoda: `https://www.agoda.com/search?q=${encodeURIComponent(destination)}&aid=1891470`,
            expedia: `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(destination)}&aid=1891470`,
            hotels: `https://www.hotels.com/search.do?q-destination=${encodeURIComponent(destination)}&aid=1891470`,
            direct: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(destination)}`
          }
        }
      }));

      return NextResponse.json({
        success: true,
        hotels: fallbackHotels,
        count: fallbackHotels.length,
        source: 'Fallback (Error)'
      });
    }

  } catch (error: any) {
    console.error('Error in hotels-public API:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch hotels',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
