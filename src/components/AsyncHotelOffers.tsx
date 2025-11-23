'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Star, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

interface Hotel {
  id: string;
  name: string;
  stars: number;
  rating: number;
  price: number;
  currency: string;
  images: string[];
  location: { lat: number; lng: number };
  amenities: string[];
  description: string;
  bookingUrl: string;
  source?: string;
  details?: any;
}

interface AsyncHotelOffersProps {
  destination: string;
  startDate: string;
  endDate: string;
  travelGroup: string;
}

export default function AsyncHotelOffers({ 
  destination, 
  startDate, 
  endDate, 
  travelGroup 
}: AsyncHotelOffersProps) {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scrollContainerRef, setScrollContainerRef] = useState<HTMLDivElement | null>(null);
  const isLoadingRef = useRef(false);

  const loadHotels = useCallback(async () => {
    if (isLoadingRef.current) {
      return; // Prevent multiple simultaneous requests
    }
    isLoadingRef.current = true;
    setLoading(true);
    setError(null);
    
    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (isLoadingRef.current) {
        setLoading(false);
        setError('Request timeout. Please try again.');
        isLoadingRef.current = false;
      }
    }, 30000); // 30 second timeout
    
    try {
      console.log('Fetching hotels for:', { destination, startDate, endDate, travelGroup });
      const response = await fetch('/api/hotels-real', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destination,
          startDate,
          endDate,
          travelGroup,
        }),
      });

      console.log('API Response status:', response.status);
      const data = await response.json();
      console.log('API Response data:', data);

      if (data.success) {
        // Filter out hotels with no valid data
        const validHotels = data.hotels.filter((hotel: any) => 
          hotel.name && 
          hotel.name !== 'Hotel Name Not Found' && 
          hotel.price > 0
        );
        
        if (validHotels.length > 0) {
          console.log('Valid hotels received:', validHotels.map((h: any) => ({ name: h.name, images: h.images, source: h.source })));
          setHotels(validHotels);
        } else {
          console.log('No valid hotels found in response');
          setError('No valid hotel data found. Please try again.');
        }
      } else {
        setError(data.error || 'Failed to load hotels');
      }
    } catch (err) {
      console.error('Error loading hotels:', err);
      setError('Failed to load hotels. Please try again.');
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [destination, startDate, endDate, travelGroup]);

  useEffect(() => {
    // Only load hotels when dependencies change, not on every render
    if (destination && startDate && endDate) {
      loadHotels();
    }
  }, [destination, startDate, endDate, travelGroup, loadHotels]);

  const handleBookNow = (hotel: Hotel) => {
    window.open(hotel.bookingUrl, '_blank');
  };

  const scrollToPrevious = () => {
    if (scrollContainerRef) {
      scrollContainerRef.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollToNext = () => {
    if (scrollContainerRef) {
      scrollContainerRef.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Lodging Recommendations</h3>
            <p className="text-gray-600">Finding the best hotels for your trip...</p>
          </div>
        </div>
        
        {/* Loading skeleton */}
        <div className="flex space-x-4 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-shrink-0 w-80 bg-gray-100 rounded-lg overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-center">
          <div className="inline-flex items-center space-x-2 text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm">Loading hotels...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Lodging Recommendations</h3>
            <p className="text-red-600">Failed to load hotels</p>
          </div>
        </div>
        
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadHotels}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (hotels.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Lodging Recommendations</h3>
            <p className="text-gray-600">No hotels found</p>
          </div>
        </div>
        
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">No hotels available for this destination.</p>
          <button
            onClick={loadHotels}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Lodging Recommendations</h3>
          <p className="text-gray-600">
            {hotels.length} Hotels found based on your interests
          </p>
        </div>
        
        {/* Navigation Arrows */}
        <div className="flex space-x-2">
          <button
            onClick={scrollToPrevious}
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
          <button
            onClick={loadHotels}
            className="w-10 h-10 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center transition-colors"
            aria-label="Refresh hotels"
            title="Refresh hotels"
          >
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Horizontal Scrolling Container */}
      <div 
        ref={setScrollContainerRef}
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
                src={hotel.images && hotel.images.length > 0 ? hotel.images[0] : 'https://cf.bstatic.com/xdata/images/hotel/square600/510565710.webp?k=dff438e940e280b0b5740485b7a0a6b9bd9adfa97f59a835c7f98536bc137080&o='}
                alt={`${hotel.name} hotel - AI travel planner accommodation recommendation`}
                fill
                className="object-cover"
                sizes="320px"
                onError={(e) => {
                  // Fallback to high-quality Booking.com placeholder if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://cf.bstatic.com/xdata/images/hotel/square600/510565710.webp?k=dff438e940e280b0b5740485b7a0a6b9bd9adfa97f59a835c7f98536bc137080&o=';
                }}
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
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: (hotel.currency || 'USD').toUpperCase(), maximumFractionDigits: 0 }).format(Math.round(hotel.price))}
                </div>
                <span className="text-sm text-gray-500">/4 nights</span>
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
    </div>
  );
}
