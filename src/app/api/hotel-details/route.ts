import { NextRequest, NextResponse } from 'next/server';
import { getHotelDetails } from '@/lib/expedia';

export async function POST(request: NextRequest) {
  try {
    const { hotelName, destination } = await request.json();

    if (!hotelName || !destination) {
      return NextResponse.json(
        { error: 'Hotel name and destination are required' },
        { status: 400 }
      );
    }

    const hotelDetails = await getHotelDetails(hotelName, destination);

    if (!hotelDetails) {
      return NextResponse.json(
        { error: 'Hotel not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(hotelDetails);
  } catch (error) {
    console.error('Error in hotel-details API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
