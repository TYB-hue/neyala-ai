import { prisma } from './prisma';
import type { UserStats, Trip, Hotel, UserPreferences, ActivityType, BookingStatus } from '@/types';
import type { 
  FavoriteDestination,
  Trip as DBTrip,
  Activity as DBActivity,
  HotelBooking as DBHotelBooking,
  Hotel as DBHotel
} from '../../generated/prisma';

export async function getUserStats(userId: string): Promise<UserStats> {
  const [
    tripsCount,
    hotelsCount,
    reviewsCount,
    favoriteDestinations
  ] = await Promise.all([
    prisma.trip.count({ where: { userId } }),
    prisma.hotelBooking.count({ where: { userId } }),
    prisma.review.count({ where: { userId } }),
    prisma.favoriteDestination.findMany({
      where: { userId },
      select: { destination: true }
    })
  ]);

  return {
    tripsPlanned: tripsCount,
    hotelsBooked: hotelsCount,
    reviews: reviewsCount,
    favoriteDestinations: favoriteDestinations.map(fd => fd.destination)
  };
}

export async function getUserTrips(userId: string): Promise<Trip[]> {
  const trips = await prisma.trip.findMany({
    where: { userId },
    include: {
      activities: true
    },
    orderBy: { startDate: 'desc' }
  });

  return trips.map((trip: DBTrip & { activities: DBActivity[] }) => ({
    id: trip.id,
    destination: trip.destination,
    startDate: trip.startDate.toISOString(),
    endDate: trip.endDate.toISOString(),
    status: trip.status,
    budget: trip.budget,
    travelStyle: trip.travelStyle,
    requirements: JSON.parse(trip.requirements),
    activities: trip.activities.map((activity: DBActivity) => ({
      id: activity.id,
      name: activity.name,
      type: activity.type as ActivityType,
      date: activity.date.toISOString(),
      description: activity.description || undefined
    }))
  }));
}

export async function getUserHotels(userId: string): Promise<Hotel[]> {
  const bookings = await prisma.hotelBooking.findMany({
    where: { userId },
    include: {
      hotel: {
        include: {
          reviews: {
            where: { userId }
          }
        }
      }
    },
    orderBy: { checkIn: 'desc' }
  });

  return bookings.map((booking: DBHotelBooking & { hotel: DBHotel }) => ({
    id: booking.hotel.id,
    name: booking.hotel.name,
    image: booking.hotel.image || undefined,
    location: booking.hotel.location,
    rating: booking.hotel.rating,
    status: booking.status as BookingStatus,
    priceRange: `$${booking.hotel.pricePerNight}`,
    amenities: JSON.parse(booking.hotel.amenities)
  }));
}

export async function getUserPreferences(userId: string): Promise<UserPreferences> {
  // For now, return default preferences
  // In a real app, this would be stored in the database
  return {
    notifications: {
      email: true,
      push: true,
      marketing: false
    },
    darkMode: false,
    language: 'en',
    currency: 'USD'
  };
}

export async function updateUserPreferences(
  userId: string,
  preferences: Partial<UserPreferences>
): Promise<UserPreferences> {
  // For now, just return the preferences
  // In a real app, this would update the database
  return {
    notifications: {
      email: true,
      push: true,
      marketing: false,
      ...preferences.notifications
    },
    darkMode: preferences.darkMode ?? false,
    language: preferences.language ?? 'en',
    currency: preferences.currency ?? 'USD'
  };
}

export async function addToFavorites(userId: string, destination: string) {
  return prisma.favoriteDestination.create({
    data: {
      userId,
      destination
    }
  });
}

export async function removeFromFavorites(userId: string, destination: string) {
  return prisma.favoriteDestination.delete({
    where: {
      userId_destination: {
        userId,
        destination
      }
    }
  });
}

export async function bookHotel(
  userId: string,
  hotelId: string,
  checkIn: Date,
  checkOut: Date,
  totalPrice: number
) {
  return prisma.hotelBooking.create({
    data: {
      userId,
      hotelId,
      checkIn,
      checkOut,
      totalPrice,
      status: 'CONFIRMED'
    }
  });
}

export async function addReview(
  userId: string,
  hotelId: string,
  rating: number,
  comment?: string
) {
  return prisma.review.create({
    data: {
      userId,
      hotelId,
      rating,
      comment
    }
  });
}

export async function saveTrip(
  userId: string,
  tripData: {
    destination: string;
    startDate: Date;
    endDate: Date;
    budget: string;
    travelStyle: string;
    activities: Array<{
      name: string;
      type: ActivityType;
      date: Date;
      description?: string;
    }>;
    requirements: string[];
  }
) {
  return prisma.trip.create({
    data: {
      userId,
      destination: tripData.destination,
      startDate: tripData.startDate,
      endDate: tripData.endDate,
      budget: tripData.budget,
      travelStyle: tripData.travelStyle,
      requirements: JSON.stringify(tripData.requirements),
      activities: {
        create: tripData.activities
      }
    },
    include: {
      activities: true
    }
  });
} 