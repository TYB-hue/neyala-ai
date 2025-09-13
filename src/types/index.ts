export interface UserProfile {
  id: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
  emailAddress: string | null;
  phoneNumber: string | null;
  createdAt: Date;
}

export interface UserStats {
  tripsPlanned: number;
  collections: number;
  reviews: number;
  favoriteDestinations: string[];
}

export interface UserPreferences {
  notifications: {
    email: boolean;
    push: boolean;
    marketing: boolean;
  };
  darkMode: boolean;
  language: string;
  currency: string;
}

export interface Trip {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: TripStatus;
  budget: string;
  travelStyle: string;
  activities: Activity[];
  requirements: string[];
  image?: string;
}

export interface Activity {
  id: string;
  name: string;
  type: ActivityType;
  date: string;
  description?: string;
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  image?: string;
  status: BookingStatus;
  priceRange: string;
  amenities: string[];
}

export interface HotelOffer {
  id: string;
  name: string;
  rating: number;
  price: number;
  image?: string;
  location?: {
    lat: number;
    lng: number;
  };
  bookingUrl?: string;
  images?: string[];
  address?: string;
}

export type TripStatus = 'PLANNED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
export type ActivityType = 'FLIGHT' | 'HOTEL' | 'TOUR' | 'RESTAURANT' | 'OTHER';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'; 