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

    console.log(`Fetching real Booking.com data for: ${destination}`);

    // Parse travel group to get number of adults
    let adults = 2; // default
    if (travelGroup) {
      const match = travelGroup.match(/(\d+)\s*adults?/i);
      if (match) {
        adults = parseInt(match[1]);
      }
    }

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
        useScraperApi: false // Use direct scraping, not ScraperAPI
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
        
        const source = isRealData ? 'Booking.com (Real Data)' : 'Fallback Data';
        console.log(`Found ${hotels.length} hotels with source: ${source}`);
        
        // Convert BookingHotelData to the format expected by AsyncHotelOffers
        const formattedHotels = hotels.map((hotel: any, index: number) => ({
          id: hotel.id || `hotel_${Date.now()}_${index}`,
          name: hotel.name,
          stars: hotel.stars || Math.floor(hotel.rating || 4),
          rating: hotel.rating || 4.0,
          price: hotel.price || 100,
          image: hotel.images && hotel.images.length > 0 ? hotel.images[0] : 'https://cf.bstatic.com/xdata/images/hotel/square600/510565710.webp?k=dff438e940e280b0b5740485b7a0a6b9bd9adfa97f59a835c7f98536bc137080&o=',
          images: hotel.images || ['https://cf.bstatic.com/xdata/images/hotel/square600/510565710.webp?k=dff438e940e280b0b5740485b7a0a6b9bd9adfa97f59a835c7f98536bc137080&o='],
          location: hotel.location || { lat: 0, lng: 0 },
          address: hotel.address || '',
          amenities: hotel.amenities || [],
          description: hotel.description || '',
          bookingUrl: hotel.bookingUrl || '',
          source: hotel.source || 'Booking.com'
        }));

        return NextResponse.json({
          success: true,
          hotels: formattedHotels,
          count: formattedHotels.length,
          source: source
        });
      } else {
        throw new Error('No hotels returned from scraper');
      }
    } catch (scraperError) {
      console.error('Scraper failed, using fallback data:', scraperError);
      
      // Fallback to generating realistic data for any city
      const fallbackData = generateDynamicHotelData(destination);
      
      return NextResponse.json({
        success: true,
        hotels: fallbackData,
        count: fallbackData.length,
        source: 'Fallback Data'
      });
    }

  } catch (error: any) {
    console.error('Error in hotels-real API:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch hotels',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

function generateDynamicHotelData(destination: string) {
  const city = destination.split(',')[0].trim();
  const country = destination.split(',')[1]?.trim() || '';
  
  // Generate realistic hotel names based on the city
  const hotelNames = [
    `${city} Grand Hotel`,
    `The ${city} Plaza`,
    `${city} Marriott`,
    `${city} Hilton`,
    `Grand ${city} Hotel`,
    `${city} Business Hotel`,
    `${city} Central Hotel`,
    `${city} Garden Hotel`,
    `${city} Express Inn`,
    `${city} City Hotel`
  ];
  
  // Real Booking.com images that work
  const realImages = [
    'https://cf.bstatic.com/xdata/images/hotel/square600/510565710.webp?k=dff438e940e280b0b5740485b7a0a6b9bd9adfa97f59a835c7f98536bc137080&o=',
    'https://cf.bstatic.com/xdata/images/hotel/square600/583993655.webp?k=ee897e371b17460203379ef7f5cd2eadff8a1cc5e49adc139c7ef70f1c118b09&o=',
    'https://cf.bstatic.com/xdata/images/hotel/square600/749265489.webp?k=7b8f592ffd657941e29fd267a71249fd888ef5423c0d5dd2a2a8d4b3fb805725&o=',
    'https://cf.bstatic.com/xdata/images/hotel/square600/466342927.webp?k=bc1b367a952139347afddd3217bd15ce43db3c00b2a19fde05d3ca917c4d4f8a&o=',
    'https://cf.bstatic.com/xdata/images/hotel/square600/721372627.webp?k=4469790c9c740c74ff890e2ddc86bce5331a2eda5f0d13e534578cb9d35d53b5&o='
  ];
  
  return hotelNames.map((name, index) => {
    const price = 80 + (index * 30) + Math.floor(Math.random() * 100);
    const rating = 3.5 + (Math.random() * 1.5);
    const stars = Math.floor(rating);
    
    return {
      id: `hotel_${Date.now()}_${index}`,
      name: name,
      stars: stars,
      rating: Math.round(rating * 10) / 10,
      price: price,
      image: realImages[index % realImages.length],
      images: [realImages[index % realImages.length]],
      location: { lat: 0, lng: 0 },
      address: `${city}, ${country}`,
      amenities: ['WiFi', 'Air Conditioning', 'Free Breakfast', 'Pool', 'Gym'],
      description: `Comfortable accommodation in ${destination}`,
      bookingUrl: `https://www.booking.com/hotel/${country.toLowerCase()}/${city.toLowerCase().replace(/\s+/g, '-')}.html`,
      source: 'Fallback Data'
    };
  });
}