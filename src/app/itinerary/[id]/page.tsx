'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import Link from 'next/link';
// Dynamically import the map component to prevent SSR issues
const Map = dynamic(() => import('@/components/Map'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p className="text-gray-600">Loading map...</p>
      </div>
    </div>
  )
});

// Fallback map component in case of loading errors
const MapFallback = () => (
  <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
    <div className="text-center">
      <div className="text-gray-500 mb-2">
        <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
        </svg>
      </div>
      <p className="text-gray-600">Map temporarily unavailable</p>
      <p className="text-sm text-gray-500">Interactive map will be available soon</p>
    </div>
  </div>
);

// Import AsyncHotelOffers component
import AsyncHotelOffers from '@/components/AsyncHotelOffers';
import PhotoCarousel from '@/components/PhotoCarousel';
import ESimPlansSection from '@/components/ESimPlansSection';
import AttractionCard from '@/components/AttractionCard';
import RestaurantCard from '@/components/RestaurantCard';
import ReviewSlidePanel from '@/components/ReviewSlidePanel';
import { generatePlaceId, getAddressFromLocation, getPlaceType } from '@/lib/reviews';

interface Hotel {
  name: string;
  image: string;
  rating: number;
  price: number;
  link: string;
  location: {
    lat: number;
    lng: number;
  };
}

interface ItineraryDay {
  day: number;
  date: string;
  title: string;
  morning: {
    activity: string;
    description: string;
    image: string;
    time: string;
    location: {
      lat: number;
      lng: number;
    };
  };
  afternoon: {
    activity: string;
    description: string;
    image: string;
    time: string;
    location: {
      lat: number;
      lng: number;
    };
  };
  restaurant: {
    name: string;
    cuisine: string;
    description: string;
    location: {
      lat: number;
      lng: number;
    };
  };
}

interface ItineraryData {
  destination: string;
  dates: {
    start: string;
    end: string;
  };
  headerImage: string;
  overview: {
    history: string;
    culture: string;
  };
  airport: {
    name: string;
    image: string;
    photos?: string[];
    info: string;
  };
  hotels: Hotel[];
  itineraries: ItineraryDay[];
  transportation: {
    type: string;
    description: string;
    icon: string;
  }[];
  eSIM?: {
    provider: string;
    description: string;
    link: string;
    price: string;
  };
  estimatedCost: {
    accommodation: number;
    activities: number;
    transportation: number;
    food: number;
    total: number;
  };
}

export default function ItineraryPage({ params }: { params: { id: string } }) {
  const [itineraryData, setItineraryData] = useState<ItineraryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [headerImageError, setHeaderImageError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  
  // Review panel state
  const [isReviewPanelOpen, setIsReviewPanelOpen] = useState(false);
  const [reviewPlaceData, setReviewPlaceData] = useState<{
    placeId: string;
    placeName: string;
    placeType: string;
    address: string;
  } | null>(null);

  // Mobile view switcher state
  const [mobileView, setMobileView] = useState<'details' | 'map'>('details');
  
  // Airport photos state
  const [airportPhotos, setAirportPhotos] = useState<string[]>([]);
  const [airportLoading, setAirportLoading] = useState(false);

  // Fetch airport photos strictly from Foursquare (no stock fallback)
  const fetchAirportPhotos = async (airportName: string, destination: string) => {
    if (!airportName || airportLoading) return;
    setAirportLoading(true);
    try {
      const parts = destination.split(',').map(p => p.trim());
      const city = parts[0];
      const country = parts[parts.length - 1];
      console.log('Fetching airport photos for:', { airportName, city, country });

      try {
        // 0) Resolve ICAO automatically via Groq
        let icao: string | null = null;
        try {
          const icaoRes = await fetch(`/api/icao?airport=${encodeURIComponent(airportName)}&city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}`);
          if (icaoRes.ok) {
            const icaoData = await icaoRes.json();
            if (icaoData?.icao) icao = icaoData.icao;
          }
        } catch {}

        // 1) Wikipedia via AirportDB (if we found ICAO)
        if (icao) {
          const wp = await fetch(`/api/airport-photos?airport=${encodeURIComponent(airportName)}&city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&icao=${encodeURIComponent(icao)}`);
          if (wp.ok) {
            const d = await wp.json();
            if (Array.isArray(d.photos) && d.photos.length > 0) {
              setAirportPhotos(d.photos);
              return;
            }
          }
        }

        // 2) Wikimedia commons (category-based) as a secondary
        const wm = await fetch(`/api/airport-photos-wikimedia?name=${encodeURIComponent(airportName)}&limit=6`);
        if (wm.ok) {
          const data = await wm.json();
          if (Array.isArray(data.photos) && data.photos.length > 0) {
            setAirportPhotos(data.photos);
            return;
          }
        }

        // 3) Foursquare place photos pipeline
        const response = await fetch(`/api/place-photos?name=${encodeURIComponent(airportName)}&destination=${encodeURIComponent(destination)}`);
        console.log('Airport place-photos API response status:', response.status);
        if (response.ok) {
          const data = await response.json();
          console.log('Airport place-photos API response data:', data);
          if (data.photos && data.photos.length > 0) {
            setAirportPhotos(data.photos);
          } else {
            setAirportPhotos([]);
          }
        } else {
          console.error('Airport place-photos API failed:', response.status, response.statusText);
          setAirportPhotos([]);
        }
      } catch (err) {
        console.error('Error fetching airport photos:', err);
        setAirportPhotos([]);
      }
    } finally {
      setAirportLoading(false);
    }
  };

  // Fallback function to get airport photos from Unsplash
  const fetchAirportPhotosFromUnsplash = async (airportName: string, city?: string) => {
    try {
      const response = await fetch(`/api/image?name=${encodeURIComponent(airportName)}&city=${encodeURIComponent(city || '')}&type=airport`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.url) {
          console.log('Setting Unsplash airport photo:', data.url);
          setAirportPhotos([data.url]);
        }
      }
    } catch (error) {
      console.error('Error fetching Unsplash airport photos:', error);
    }
  };

  // Handle review click
  const handleReviewClick = (placeName: string, location: { lat: number; lng: number }, placeType: 'morning' | 'afternoon' | 'restaurant') => {
    const placeId = generatePlaceId(placeName, getAddressFromLocation(location));
    const address = getAddressFromLocation(location);
    const type = getPlaceType(placeType);
    
    setReviewPlaceData({
      placeId,
      placeName,
      placeType: type,
      address
    });
    setIsReviewPanelOpen(true);
  };

  // Debug logging for header image and reset error state
  useEffect(() => {
    if (itineraryData?.headerImage) {
      console.log('Header image URL in component:', itineraryData.headerImage);
      setHeaderImageError(false); // Reset error state when new image is loaded
    }
  }, [itineraryData?.headerImage]);

  // Add keyboard shortcut for printing (Ctrl+P / Cmd+P)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
        event.preventDefault();
        try {
          if (typeof window.print === 'function') {
            window.print();
          }
        } catch (error) {
          console.error('Error printing itinerary:', error);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // First, try to get from localStorage (for immediate display)
        const localStorageKey = `itinerary_${params.id}`;
        const localData = localStorage.getItem(localStorageKey);
        
        if (localData) {
          try {
            const parsedData = JSON.parse(localData);
            console.log('Loaded itinerary data from localStorage:', parsedData);
            console.log('Header image URL:', parsedData.headerImage);
            setItineraryData(parsedData);
            // Ensure airport photos are fetched even when using cached itinerary
            if (parsedData?.airport?.name && parsedData?.destination) {
              fetchAirportPhotos(parsedData.airport.name, parsedData.destination);
            }
            setLoading(false);
            return;
          } catch (parseError) {
            console.error('Error parsing localStorage data:', parseError);
            localStorage.removeItem(localStorageKey);
          }
        }
        
        // If not in localStorage, check if it's a saved itinerary (not starting with "temp_")
        // or try to fetch from the saved itineraries API
        if (!params.id.startsWith('temp_')) {
          try {
            const savedResponse = await fetch(`/api/itinerary/${params.id}`);
            if (savedResponse.ok) {
              const savedData = await savedResponse.json();
              if (savedData.success && savedData.itinerary?.data) {
                // This is a saved itinerary from the database
                const savedItinerary = savedData.itinerary.data;
                setItineraryData(savedItinerary);
                if (savedItinerary.airport?.name && savedItinerary.destination) {
                  fetchAirportPhotos(savedItinerary.airport.name, savedItinerary.destination);
                }
                setLoading(false);
                return;
              }
            }
          } catch (savedError) {
            console.log('Not a saved itinerary, trying other sources...', savedError);
          }
        }

        // Try to fetch from the old API endpoint (for backward compatibility)
        const response = await fetch(`/api/itineraries/${params.id}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch itinerary');
        }
        const data = await response.json();
        
        // Validate the required data structure
        if (!data || !data.dates || !data.dates.start || !data.dates.end) {
          console.error('Invalid data structure:', data);
          throw new Error('Invalid itinerary data format');
        }

        // Validate other required fields
        const requiredFields = ['destination', 'headerImage', 'overview', 'airport', 'hotels', 'itineraries', 'transportation', 'estimatedCost'];
        const missingFields = requiredFields.filter(field => !data[field]);
        
        if (missingFields.length > 0) {
          console.error('Missing fields in data:', data);
          throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }

        setItineraryData(data);
        
        // Fetch airport photos after itinerary data is loaded
        if (data.airport?.name && data.destination) {
          fetchAirportPhotos(data.airport.name, data.destination);
        }
      } catch (error) {
        console.error('Error fetching itinerary:', error);
        setError(error instanceof Error ? error.message : 'An error occurred while fetching the itinerary');
      } finally {
        setLoading(false);
      }
    };

    fetchItinerary();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="flex h-[calc(100vh-64px)]">
          {/* Left Panel - Loading Content */}
          <div className="w-1/2 h-[calc(100vh-64px)] overflow-y-auto p-6 pt-4">
            <div className="animate-pulse">
              {/* Header Image Skeleton */}
              <div className="h-64 bg-gray-200 rounded-xl mb-8"></div>
              
              {/* Overview Section Skeleton */}
              <div className="mb-8">
                <div className="h-8 bg-gray-200 rounded mb-4 w-1/3"></div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="h-6 bg-gray-200 rounded mb-2 w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4 w-full"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2 w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Map Loading */}
          <div className="w-full md:w-1/2 h-[calc(100vh-64px)] md:h-[calc(100vh-64px)] sticky top-16">
            <div className="h-full w-full bg-gray-100 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading map...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-6">
          <div className="text-center max-w-md">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Oops! Something went wrong
            </h2>
            <p className="text-gray-600 mb-6">
              {error}
            </p>
            <div className="space-y-4">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Try Again
              </button>
              <Link
                href="/plan"
                className="block w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Plan New Trip
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!itineraryData) {
    return (
      <div className="min-h-screen">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-6">
          <div className="text-center max-w-md">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Itinerary Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The itinerary you&apos;re looking for doesn&apos;t exist or may have been removed.
            </p>
            <Link
              href="/plan"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Create New Itinerary
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Print title - only visible when printing */}
      <div className="print-title hidden">
        {itineraryData.destination}
        {itineraryData.dates.start} - {itineraryData.dates.end}
      </div>
      
      {/* Mobile View Switcher - Only visible on mobile, always at top */}
      <div className="md:hidden bg-white border-b border-gray-200">
        <div className="flex justify-start p-1">
          <button
            onClick={() => setMobileView('details')}
            className={`py-1.5 px-3 text-center font-medium transition-all duration-200 rounded-full mr-2 ${
              mobileView === 'details'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center space-x-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-xs">Details</span>
            </div>
          </button>
          <button
            onClick={() => setMobileView('map')}
            className={`py-1.5 px-3 text-center font-medium transition-all duration-200 rounded-full ${
              mobileView === 'map'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center space-x-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <span className="text-xs">Map</span>
            </div>
          </button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-64px-48px)] md:h-[calc(100vh-64px)]">
        {/* Left Panel - Scrollable Content */}
        <div className={`w-full md:w-1/2 h-[calc(100vh-64px-48px)] md:h-[calc(100vh-64px)] overflow-y-auto p-6 pt-4 print-content ${
          mobileView === 'details' ? 'block' : 'hidden md:block'
        }`}>
          {/* Header Image with Destination */}
          <div className="relative h-96 -mx-6 -mt-4 overflow-hidden mb-8 md:-mx-6 md:-mt-4">
            <img
              src={headerImageError 
                ? 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                : itineraryData.headerImage
              }
              alt={itineraryData.destination}
              className="w-full h-full object-cover"
              onLoad={() => {
                console.log('Header image loaded successfully');
                setHeaderImageError(false);
              }}
              onError={(e) => {
                console.error('Header image failed to load:', itineraryData.headerImage);
                if (!headerImageError) {
                  setHeaderImageError(true);
                }
              }}
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-5xl md:text-6xl font-bold mb-2">{itineraryData.destination}</h1>
                <p className="text-2xl md:text-3xl">
                  {itineraryData.dates.start} - {itineraryData.dates.end}
                </p>
              </div>
            </div>
          </div>

        {/* Overview Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Overview</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">History</h3>
            <p className="mb-4">{itineraryData.overview.history}</p>
            <h3 className="text-xl font-semibold mb-2">Culture</h3>
            <p>{itineraryData.overview.culture}</p>
          </div>
        </section>

        {/* Airport Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Arrival</h2>
          <div className="relative h-72 rounded-xl overflow-hidden shadow">
            {airportLoading ? (
              <div className="flex items-center justify-center h-full bg-gray-100">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-gray-600 text-sm">Loading airport photos...</p>
                </div>
              </div>
            ) : airportPhotos.length > 1 ? (
              <PhotoCarousel
                photos={airportPhotos}
                alt={itineraryData.airport.name}
                className="h-full"
              />
            ) : airportPhotos.length === 1 ? (
              <Image
                src={airportPhotos[0]}
                alt={itineraryData.airport.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-100">
                <div className="text-center text-gray-500 text-sm">
                  No airport photos available
                </div>
              </div>
            )}

            {/* Bottom-half gradient overlay with text */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-black/70 via-black/50 to-transparent rounded-xl">
              <div className="p-6 text-white">
                <h3 className="text-2xl font-semibold mb-2">{itineraryData.airport.name}</h3>
                <p className="text-lg leading-snug opacity-95">{itineraryData.airport.info}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Hotels Section - Loaded Asynchronously */}
        <section className="mb-8">
          {itineraryData && (
            <AsyncHotelOffers 
              destination={itineraryData.destination}
              startDate={itineraryData.dates.start}
              endDate={itineraryData.dates.end}
              travelGroup="2 adults"
            />
          )}
        </section>

        {/* Daily Itinerary */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Your Itinerary</h2>
          {itineraryData && itineraryData.itineraries && itineraryData.itineraries.length > 0 ? (
            itineraryData.itineraries.map((day, dayIndex) => (
              <div key={dayIndex} className="mb-10">
                <h3 className="text-xl font-semibold mb-4">{`Day ${day.day} – ${day.date}`}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Morning */}
                  <AttractionCard
                    activity={day.morning.activity}
                    description={day.morning.description}
                    image={day.morning.image}
                    time={day.morning.time}
                    destination={itineraryData.destination}
                    emoji="🌅"
                    location={day.morning.location}
                    onReviewClick={() => handleReviewClick(day.morning.activity, day.morning.location, 'morning')}
                  />
                  {/* Afternoon */}
                  <AttractionCard
                    activity={day.afternoon.activity}
                    description={day.afternoon.description}
                    image={day.afternoon.image}
                    time={day.afternoon.time}
                    destination={itineraryData.destination}
                    emoji="🌞"
                    location={day.afternoon.location}
                    onReviewClick={() => handleReviewClick(day.afternoon.activity, day.afternoon.location, 'afternoon')}
                  />
                </div>
                {/* Restaurant */}
                <div className="mt-6">
                  <RestaurantCard
                    name={day.restaurant.name}
                    cuisine={day.restaurant.cuisine}
                    description={day.restaurant.description}
                    destination={itineraryData.destination}
                    location={day.restaurant.location}
                    onReviewClick={() => handleReviewClick(day.restaurant.name, day.restaurant.location, 'restaurant')}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-500 mb-4">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No Itinerary Available</h3>
              <p className="text-gray-500 mb-4">The itinerary data is still being processed or is unavailable.</p>
              <div className="text-sm text-gray-400">
                <p>Debug Info:</p>
                <p>• Data exists: {itineraryData ? 'Yes' : 'No'}</p>
                <p>• Itineraries array: {itineraryData?.itineraries ? 'Yes' : 'No'}</p>
                <p>• Itinerary count: {itineraryData?.itineraries?.length || 0}</p>
              </div>
            </div>
          )}
        </section>

        {/* Transportation Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Getting Around</h2>
          {itineraryData && itineraryData.transportation && itineraryData.transportation.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {itineraryData.transportation.map((transport, index) => (
              <div key={index} className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center mb-2">
                  <img
                    src={transport.icon}
                    alt={transport.type}
                    className="w-6 h-6 mr-2"
                  />
                  <h3 className="text-lg font-semibold">{transport.type}</h3>
                </div>
                <p className="text-gray-600">{transport.description}</p>
              </div>
            ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500">Transportation information not available</p>
            </div>
          )}
        </section>

        {/* eSIM Section */}
        <ESimPlansSection destination={itineraryData.destination} />

        {/* Debug Info - Only visible in development */}
        {process.env.NODE_ENV === 'development' && (
          <section className="mb-8 p-4 bg-yellow-100 border border-yellow-400 rounded">
            <h3 className="font-bold mb-2">Debug Info:</h3>
            <p>Destination: {itineraryData.destination}</p>
            <p>Estimated Cost Object: {JSON.stringify(itineraryData.estimatedCost)}</p>
            <p>Has Overview: {!!itineraryData.overview}</p>
            <p>Has Airport: {!!itineraryData.airport}</p>
            <p>Has Hotels: {!!itineraryData.hotels}</p>
            <p>Has Itineraries: {!!itineraryData.itineraries}</p>
            <p>Itinerary Count: {itineraryData.itineraries?.length || 0}</p>
          </section>
        )}

        {/* Print-Only Clean Content */}
        <div className="hidden print:block">
          {/* Professional Header */}
          <div className="print-header">
            <div className="company-logo">
              <div className="logo-icon">🌍</div>
              <div className="company-name">Nyala</div>
            </div>
            <div className="company-tagline">Your AI-powered travel companion</div>
          </div>
          
          <div className="print-title">
            <h1>{itineraryData.destination}</h1>
            <p>Travel Itinerary: {itineraryData.dates.start} - {itineraryData.dates.end}</p>
          </div>
          
          <section className="no-break">
            <h2>Destination Overview</h2>
            <div>
              <h3>History</h3>
              <p>{itineraryData.overview.history}</p>
              <h3>Culture</h3>
              <p>{itineraryData.overview.culture}</p>
            </div>
          </section>
          
          <section className="no-break">
            <h2>Arrival Information</h2>
            <p><strong>Airport:</strong> {itineraryData.airport.name}</p>
            <p>{itineraryData.airport.info}</p>
          </section>
          
          <section className="no-break">
            <h2>Lodging Recommendations</h2>
            <ul>
              {itineraryData.hotels.map((hotel, index) => (
                <li key={index}>
                  <strong>{hotel.name}</strong> - Rating: {hotel.rating}/5 - ${hotel.price}/night
                </li>
              ))}
            </ul>
          </section>
          
          <section className="no-break">
            <h2>Daily Itinerary</h2>
            {itineraryData.itineraries.map((day, index) => (
              <div key={index} className="no-break">
                <h3>{day.title}</h3>
                <div>
                  <p><strong>Morning (9:00):</strong> {day.morning.activity}</p>
                  <p>{day.morning.description}</p>
                </div>
                <div>
                  <p><strong>Afternoon (14:00):</strong> {day.afternoon.activity}</p>
                  <p>{day.afternoon.description}</p>
                </div>
                <div>
                  <p><strong>Restaurant:</strong> {day.restaurant.name} ({day.restaurant.cuisine})</p>
                  <p>{day.restaurant.description}</p>
                </div>
              </div>
            ))}
          </section>
          
          <section className="no-break">
            <h2>Transportation</h2>
            {itineraryData.transportation.map((transport, index) => (
              <div key={index}>
                <p><strong>{transport.type}:</strong> {transport.description}</p>
              </div>
            ))}
          </section>
          
          <section className="no-break">
            <h2>Estimated Costs (USD)</h2>
            <ul>
              <li>Accommodation: ${itineraryData.estimatedCost?.accommodation || 'N/A'}</li>
              <li>Activities: ${itineraryData.estimatedCost?.activities || 'N/A'}</li>
              <li>Transportation: ${itineraryData.estimatedCost?.transportation || 'N/A'}</li>
              <li>Food: ${itineraryData.estimatedCost?.food || 'N/A'}</li>
              <li><strong>Total: ${itineraryData.estimatedCost?.total || 'N/A'}</strong></li>
            </ul>
          </section>
          
          <section className="no-break">
            <h2>Additional Information</h2>
            <p><strong>eSIM:</strong> For seamless connectivity, visit https://breezesim.com/</p>
            <p><strong>Generated on:</strong> {new Date().toLocaleDateString()}</p>
          </section>
          
        </div>

        {/* Estimated Costs */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Estimated Costs (USD)</h2>
          <div className="bg-white shadow rounded-lg p-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Accommodation</span>
                <span>${itineraryData.estimatedCost?.accommodation || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span>Activities</span>
                <span>${itineraryData.estimatedCost?.activities || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span>Transportation</span>
                <span>${itineraryData.estimatedCost?.transportation || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span>Food</span>
                <span>${itineraryData.estimatedCost?.food || 'N/A'}</span>
              </div>
              <div className="border-t pt-4 flex justify-between font-bold">
                <span>Total</span>
                <span>${itineraryData.estimatedCost?.total || 'N/A'}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Save, Share & Download Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Save, Share & Download</h2>
          <div className="bg-white shadow rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Save Button */}
              <button
                onClick={async () => {
                  if (saving || saved) return;
                  
                  setSaving(true);
                  setSaved(false);
                  
                  try {
                    const itineraryToSave = {
                      id: params.id,
                      destination: itineraryData.destination,
                      dates: itineraryData.dates,
                      headerImage: itineraryData.headerImage,
                      overview: itineraryData.overview,
                      airport: itineraryData.airport,
                      hotels: itineraryData.hotels,
                      itineraries: itineraryData.itineraries,
                      transportation: itineraryData.transportation,
                      estimatedCost: itineraryData.estimatedCost,
                      createdAt: new Date().toISOString(),
                      savedAt: new Date().toISOString()
                    };

                    // Save to database via API
                    const res = await fetch('/api/itinerary/save', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        itineraryData: itineraryToSave,
                        title: `${itineraryData.destination} - ${itineraryData.dates.start} to ${itineraryData.dates.end}`
                      })
                    });

                    let result;
                    try {
                      result = await res.json();
                    } catch (jsonError) {
                      console.error('Error parsing response JSON:', jsonError);
                      throw new Error(`Server error (${res.status}): Failed to parse response`);
                    }

                    if (!res.ok || !result.success) {
                      const errorMessage = result.error || result.message || `Failed to save itinerary (${res.status})`;
                      console.error('Save failed:', {
                        status: res.status,
                        error: errorMessage,
                        details: result.details
                      });
                      throw new Error(errorMessage);
                    }

                    // Also save locally as fallback
                    const savedItineraries = JSON.parse(localStorage.getItem('savedItineraries') || '[]');
                    const existingIndex = savedItineraries.findIndex((item: any) => item.id === params.id);
                    if (existingIndex >= 0) {
                      savedItineraries[existingIndex] = itineraryToSave;
                    } else {
                      savedItineraries.push(itineraryToSave);
                    }
                    localStorage.setItem('savedItineraries', JSON.stringify(savedItineraries));

                    setSaved(true);
                    setTimeout(() => setSaved(false), 3000); // Reset after 3 seconds
                  } catch (error) {
                    console.error('Error saving itinerary:', error);
                    alert('❌ Failed to save itinerary. Please try again.');
                  } finally {
                    setSaving(false);
                  }
                }}
                disabled={saving || saved}
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-colors font-medium ${
                  saved
                    ? 'bg-green-500 text-white cursor-default'
                    : saving
                    ? 'bg-green-400 text-white cursor-wait'
                    : 'bg-green-600 text-white hover:bg-green-700 cursor-pointer'
                }`}
              >
                {saving ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : saved ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Saved!
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Itinerary
                  </>
                )}
              </button>

              {/* Share Button */}
              <button
                onClick={() => {
                  try {
                    // Create shareable content
                    const shareText = `🌍 Check out my amazing ${itineraryData.destination} itinerary! 
                    
🗓️ ${itineraryData.dates.start} - ${itineraryData.dates.end}
💰 Total estimated cost: $${itineraryData.estimatedCost.total}
🏨 ${itineraryData.hotels.length} hotel options
🎯 ${itineraryData.itineraries.length} days of activities

Plan your own trip at: ${window.location.origin}/plan`;

                    // Try to use native sharing if available
                    if (navigator.share) {
                      navigator.share({
                        title: `${itineraryData.destination} Travel Itinerary`,
                        text: shareText,
                        url: window.location.href
                      }).catch((error) => {
                        console.log('Error sharing:', error);
                        // Fallback to clipboard
                        navigator.clipboard.writeText(shareText + '\n\n' + window.location.href);
                        alert('📋 Itinerary link copied to clipboard!');
                      });
                    } else {
                      // Fallback to clipboard
                      navigator.clipboard.writeText(shareText + '\n\n' + window.location.href);
                      alert('📋 Itinerary link copied to clipboard!');
                    }
                  } catch (error) {
                    console.error('Error sharing itinerary:', error);
                    alert('❌ Failed to share itinerary. Please try again.');
                  }
                }}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                Share Itinerary
              </button>

              {/* Download/Print Button */}
              <button
                onClick={() => {
                  try {
                    // Check if print is supported
                    if (typeof window.print === 'function') {
                      // Simple print call - let the CSS handle the layout
                      window.print();
                    } else {
                      // Fallback: open in new window for printing
                      const printWindow = window.open(window.location.href, '_blank');
                      if (printWindow) {
                        printWindow.onload = () => {
                          printWindow.print();
                        };
                      } else {
                        alert('❌ Pop-up blocked. Please allow pop-ups and try again.');
                      }
                    }
                  } catch (error) {
                    console.error('Error printing itinerary:', error);
                    alert('❌ Failed to open print dialog. Please try again.');
                  }
                }}
                className="flex items-center justify-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PDF
              </button>
            </div>
            
            {/* Additional Info */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                💡 <strong>Save:</strong> Store this itinerary locally to access it later without internet connection.
              </p>
              <p className="text-sm text-gray-600 mt-1">
                💡 <strong>Share:</strong> Share your itinerary with friends and family via social media or messaging apps.
              </p>
              <p className="text-sm text-gray-600 mt-1">
                💡 <strong>Download:</strong> Print or save as PDF to have a physical copy of your itinerary. (Or press Ctrl+P / Cmd+P)
              </p>
            </div>
          </div>
        </section>
        </div>

        {/* Right Panel - Map */}
        <div className={`w-full md:w-1/2 h-[calc(100vh-64px-48px)] md:h-[calc(100vh-64px)] sticky top-16 ${
          mobileView === 'map' ? 'block' : 'hidden md:block'
        }`}>
          <div className="h-full w-full">
            {itineraryData.itineraries && itineraryData.itineraries.length > 0 ? (
              <React.Suspense fallback={<MapFallback />}>
                <Map
                  center={itineraryData.itineraries[0]?.morning?.location || { lat: 48.8566, lng: 2.3522 }}
                  markers={[
                    ...itineraryData.itineraries.flatMap(day => [
                      {
                        position: day.morning.location,
                        title: day.morning.activity,
                        type: 'activity' as const
                      },
                      {
                        position: day.afternoon.location,
                        title: day.afternoon.activity,
                        type: 'activity' as const
                      }
                    ]),
                    ...itineraryData.hotels.map(hotel => ({
                      position: hotel.location,
                      title: hotel.name,
                      type: 'hotel' as const
                    }))
                  ]}
                />
              </React.Suspense>
            ) : (
              <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-4">🗺️</div>
                  <p className="text-gray-600">Interactive Map</p>
                  <p className="text-sm text-gray-500">Loading map data...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Review Slide Panel */}
      {reviewPlaceData && (
        <ReviewSlidePanel
          isOpen={isReviewPanelOpen}
          onClose={() => setIsReviewPanelOpen(false)}
          placeId={reviewPlaceData.placeId}
          placeName={reviewPlaceData.placeName}
          placeType={reviewPlaceData.placeType}
          address={reviewPlaceData.address}
        />
      )}
    </div>
  );
}

