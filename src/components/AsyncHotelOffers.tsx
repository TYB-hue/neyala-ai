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
  totalPrice?: number;
  taxNote?: string;
  scrapedAt?: string;
  images: string[];
  location: { lat: number; lng: number };
  amenities: string[];
  description: string;
  bookingUrl: string;
  source?: string;
  sandbox?: boolean;
  details?: any;
}

interface AsyncHotelOffersProps {
  destination: string;
  startDate: string;
  endDate: string;
  travelGroup: string;
  guestNationality?: string;
}

function HotelResults({ 
  destination, 
  startDate, 
  endDate, 
  travelGroup, guestNationality, adults
}: AsyncHotelOffersProps & { guestNationality: string; adults: number }) {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [sandbox, setSandbox] = useState(false);
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
    setHotels([]);
    
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
        signal: AbortSignal.timeout(30000),
        body: JSON.stringify({
          destination,
          startDate,
          endDate,
          travelGroup, guestNationality, adults,
        }),
      });

      console.log('API Response status:', response.status);
      const data = await response.json();
      console.log('API Response data:', data);

      setSandbox(data.sandbox === true);
      if (data.sandbox === true) throw new Error("Sandbox results are not displayed.");
      if (response.ok && data.success && Array.isArray(data.hotels)) {
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
          setHotels([]);
          setError(null);
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
  }, [destination, startDate, endDate, travelGroup, guestNationality, adults]);

  useEffect(() => {
    // Only load hotels when dependencies change, not on every render
    if (destination && startDate && endDate) {
      loadHotels();
    }
  }, [destination, startDate, endDate, travelGroup, loadHotels]);

  const handleBookNow = (hotel: Hotel) => {
    window.open(hotel.bookingUrl, '_blank', 'noopener,noreferrer');
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
          <a className="block mt-4 text-blue-600 underline" target="_blank" rel="noopener noreferrer"
            href={`https://www.booking.com/searchresults.html?${new URLSearchParams({ ss: destination, checkin: startDate, checkout: endDate, group_adults: String(adults), no_rooms: '1', selected_currency: 'USD' }).toString()}`}>
            Open this search on Booking.com
          </a>
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
            <p className="text-gray-600">Check hotel availability</p>
          </div>
        </div>
        
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Live rates are unavailable here. Search your destination and travel dates directly with Booking.com.</p>
          <a
            href={`https://www.booking.com/searchresults.html?${new URLSearchParams({ ss: destination, checkin: startDate, checkout: endDate }).toString()}`}
            target="_blank" rel="noopener noreferrer"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Search hotels
          </a>
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
            {sandbox ? "Sandbox test rates — no real reservations. " : ""}{hotels.length} hotels for your dates
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
              {hotel.images?.[0] ? <Image
                src={hotel.images[0]} alt={hotel.name} fill sizes="320px" className="object-cover"
                onError={() => setHotels(current => current.map(h => h.id === hotel.id ? { ...h, images: [] } : h))}
              /> : <div className="h-full bg-gray-100 flex items-center justify-center text-gray-500">Photo unavailable</div>}
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
              
              {hotel.rating > 0 && <p className="text-sm text-gray-600 mb-3">Guest rating: {hotel.rating}/10</p>}
              {/* Description */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{hotel.description}</p>
              
              {/* Price */}
              <div className="flex items-center justify-between mb-4">
                <div className="text-xl font-bold text-gray-900">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: (hotel.currency || 'USD').toUpperCase(), maximumFractionDigits: 0 }).format(Math.round(hotel.price))}
                </div>
                <span className="text-sm text-gray-500">total stay</span>
              </div>
              
              {hotel.taxNote && <p className="text-xs text-gray-500 mb-3">{hotel.taxNote}</p>}
              {/* Book Now Button */}
              <button
                disabled
                title="Booking is not yet enabled"
                className="block w-full bg-gray-400 cursor-not-allowed text-white text-center py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                {sandbox ? "Test rate only" : "Booking coming soon"}
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Pro Tip */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          {sandbox ? "These are sandbox prices for testing, not real offers. No reservation or payment can be made." : "Rates are supplied by LiteAPI for the full stay. Prices may change; booking is not yet enabled in Nyala."}
        </p>
      </div>
    </div>
  );
}


export default function AsyncHotelOffers(props: AsyncHotelOffersProps) {
  const adults = props.travelGroup === 'solo' ? 1 : 2;
  return <HotelResults key={`${props.destination}-${props.startDate}-${props.endDate}-${props.travelGroup}`} {...props} guestNationality={props.guestNationality || ''} adults={adults} />;
}
