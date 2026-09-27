'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Star, MapPin } from 'lucide-react';


interface HotelOffer {
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

interface HotelOffersProps {
  hotels: HotelOffer[];
  destination: string;
}

export default function HotelOffers({ hotels, destination }: HotelOffersProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);


  if (!hotels || hotels.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Lodging Recommendation</h3>
        <p className="text-gray-600">Loading hotel options...</p>
      </div>
    );
  }

  const scrollToNext = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = container.querySelector('.hotel-card')?.clientWidth || 320;
      const scrollAmount = cardWidth + 16; // 16px for gap
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollToPrev = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = container.querySelector('.hotel-card')?.clientWidth || 320;
      const scrollAmount = cardWidth + 16; // 16px for gap
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };



  const handleBookNow = async (hotel: HotelOffer) => {
    // Create a professional booking URL that goes directly to the hotel
    const createProfessionalBookingUrl = (hotelName: string, location: string) => {
      // Clean the hotel name and create a professional search
      const cleanHotelName = hotelName.replace(new RegExp(`\\s*${location}\\s*$`, 'i'), '').trim();
      const searchQuery = `${cleanHotelName} ${location}`;
      
      // Create a direct Expedia search with professional parameters
      return `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(searchQuery)}&aid=1891470&utm_source=neyalaAI&utm_medium=travel_planner&utm_campaign=hotel_booking&startDate=2024-11-16&endDate=2024-11-20&adults=2&rooms=1`;
    };

    // Use the booking URL from the data if it exists and looks professional
    if (hotel.bookingUrl && hotel.bookingUrl.includes('expedia.com')) {
      console.log('Opening professional booking URL:', hotel.bookingUrl);
      window.open(hotel.bookingUrl, '_blank');
    } else {
      // Create a professional fallback URL
      const professionalUrl = createProfessionalBookingUrl(hotel.name, hotel.location?.lat ? 'Unknown Location' : 'Hotel');
      console.log('Opening professional fallback URL:', professionalUrl);
      window.open(professionalUrl, '_blank');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">Lodging Recommendation</h3>
          <p className="text-gray-600">{hotels.length} Hotels found based on your interests</p>
        </div>
        
        {/* Navigation Arrows */}
        <div className="flex space-x-2">
          <button
            onClick={scrollToPrev}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            aria-label="Previous hotels"
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
          <button
            onClick={scrollToNext}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            aria-label="Next hotels"
          >
            <ChevronRight size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrolling Container */}
      <div 
        ref={scrollContainerRef}
        className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {hotels.map((hotel) => (
          <div 
            key={hotel.id} 
            className="hotel-card flex-shrink-0 w-80 bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Hotel Image */}
            <div className="relative h-48">
              <Image
                src={hotel.image}
                alt={hotel.name}
                fill
                className="object-cover"
                sizes="320px"
              />
              {/* Rating Badge */}
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center">
                <Star size={14} className="text-yellow-400 fill-current" />
                <span className="ml-1 text-sm font-semibold text-gray-800">{Math.round(hotel.rating * 10) / 10}</span>
              </div>
            </div>
            
            {/* Hotel Info */}
            <div className="p-4">
              {/* Location */}
              <div className="flex items-center text-sm text-gray-500 mb-1">
                <MapPin size={14} className="mr-1" />
                <span>{destination}</span>
              </div>
              
              {/* Hotel Name */}
              <h4 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-1">{hotel.name}</h4>
              
              {/* Stars */}
              <div className="flex items-center mb-3">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={14} 
                      className={i < hotel.stars ? 'text-yellow-400 fill-current' : 'text-gray-300'} 
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">({Math.round(hotel.rating * 10) / 10})</span>
              </div>
              
              {/* Description */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{hotel.description}</p>
              
              {/* Price */}
              <div className="flex items-center justify-between mb-4">
                <div className="text-xl font-bold text-gray-900">
                  {hotel.currency} {Math.round(hotel.price)}
                </div>
                <span className="text-sm text-gray-500">/night</span>
              </div>
              
              {/* Book Now Button */}
              <button
                onClick={() => handleBookNow(hotel)}
                className="block w-full bg-blue-600 text-white text-center py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Pro Tip */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          💡 <strong>Pro Tip:</strong> These are real-time hotel offers with actual availability and pricing. 
          Click "Book Now" to secure your reservation with our trusted partners.
        </p>
      </div>

      {/* Direct booking - no modal needed */}
    </div>
  );
} 