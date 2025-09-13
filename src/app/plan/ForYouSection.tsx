'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Bookmark, Star, MapPin } from 'lucide-react';
import AsyncHotelOffers from '@/components/AsyncHotelOffers';
import ESimPlansSection from '@/components/ESimPlansSection';
import { usePlanContext } from './PlanContext';

export interface Attraction {
  id: string;
  name: string;
  type: string;
  location: string;
  imageUrl: string;
  externalLinks: {
    tripadvisor: string;
    google: string;
    vator: string;
  };
}

interface ForYouSectionProps {
  destination?: string;
  startDate?: string;
  endDate?: string;
  travelGroup?: string;
}


const ATTRACTIONS = [
  {
    id: '1',
    name: 'Nubian Pyramids',
    type: 'Ancient Monuments',
    location: 'Meroe, Sudan',
    imageUrl: '/images/pyramids.png',
    externalLinks: {
      tripadvisor: 'https://www.tripadvisor.com/Attraction_Review-g293933-d324000-Reviews-Nubian_Pyramids-Khartoum_Khartoum_State.html',
      google: 'https://maps.app.goo.gl/ZFGAH2tveGvqun9z7',
      vator: 'https://www.vator.com/places/nubian-pyramids-meroe-sudan'
    }
  },
  {
    id: '2',
    name: 'Empire State Building',
    type: 'Iconic Landmark',
    location: '20 W 34th St, New York',
    imageUrl: 'https://images.unsplash.com/photo-1555109307-f7d9da25c244?w=640&q=80',
    externalLinks: {
      tripadvisor: 'https://www.tripadvisor.com/Attraction_Review-g60763-d103239-Reviews-Empire_State_Building-New_York_City_New_York.html',
      google: 'https://maps.app.goo.gl/ig5iRh1PSRnrhqa28',
      vator: 'https://www.vator.com/places/empire-state-building-new-york'
    }
  },
  {
    id: '3',
    name: 'Pyramids of Giza',
    type: 'Ancient Wonder',
    location: 'Giza, Egypt',
    imageUrl: 'https://images.unsplash.com/photo-1590133324192-1df305deea6b?w=640&q=80',
    externalLinks: {
      tripadvisor: 'https://www.tripadvisor.com/Attraction_Review-g294202-d308475-Reviews-Pyramids_of_Giza-Giza_Giza_Governorate.html',
      google: 'https://maps.app.goo.gl/6i5bcjC693GeUZku6',
      vator: 'https://www.vator.com/places/pyramids-of-giza-egypt'
    }
  },
  {
    id: '4',
    name: 'Taj Mahal',
    type: 'Historic Monument',
    location: 'Agra, India',
    imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=640&q=80',
    externalLinks: {
      tripadvisor: 'https://www.tripadvisor.com/Attraction_Review-g297683-d317202-Reviews-Taj_Mahal-Agra_Agra_District_Uttar_Pradesh.html',
      google: 'https://maps.app.goo.gl/gE8sBbD6NDPZ4rEj7',
      vator: 'https://www.vator.com/places/taj-mahal-agra-india'
    }
  },
  {
    id: '5',
    name: 'Santorini',
    type: 'Island Paradise',
    location: 'Cyclades, Greece',
    imageUrl: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=640&q=80',
    externalLinks: {
      tripadvisor: 'https://www.tripadvisor.com/Tourism-g189433-Santorini_Cyclades_South_Aegean-Vacations.html',
      google: 'https://maps.app.goo.gl/F4fdDNAP7vo381t58',
      vator: 'https://www.vator.com/places/santorini-greece'
    }
  },
  {
    id: '6',
    name: 'Petra',
    type: 'Ancient City',
    location: "Ma'an Governorate, Jordan",
    imageUrl: 'https://images.unsplash.com/photo-1579606032821-4e6161c81bd3?w=640&q=80',
    externalLinks: {
      tripadvisor: 'https://www.tripadvisor.com/Attraction_Review-g318895-d318899-Reviews-Petra_Wadi_Musa-Ma_an_Governorate.html',
      google: 'https://maps.app.goo.gl/dyYqQpZ1F2UVjPTh9',
      vator: 'https://www.vator.com/places/petra-jordan'
    }
  },
  {
    id: '7',
    name: 'Machu Picchu',
    type: 'Ancient Ruins',
    location: 'Cusco Region, Peru',
    imageUrl: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=640&q=80',
    externalLinks: {
      tripadvisor: 'https://www.tripadvisor.com/Attraction_Review-g294318-d329181-Reviews-Machu_Picchu-Machu_Picchu_Sacred_Valley_Cusco_Region.html',
      google: 'https://maps.app.goo.gl/S8b16Zzmv8s9osNA8',
      vator: 'https://www.vator.com/places/machu-picchu-peru'
    }
  },
  {
    id: '8',
    name: 'Mount Fuji',
    type: 'Natural Wonder',
    location: 'Honshu, Japan',
    imageUrl: 'https://images.unsplash.com/photo-1570459027562-4a916cc6113f?w=640&q=80',
    externalLinks: {
      tripadvisor: 'https://www.tripadvisor.com/Attraction_Review-g298184-d324000-Reviews-Mount_Fuji-Shizuoka_Prefecture_Chubu.html',
      google: 'https://maps.app.goo.gl/2nrAU3x1z95mT2N19',
      vator: 'https://www.vator.com/places/mount-fuji-japan'
    }
  }
];

export default function ForYouSection({ 
  destination, 
  startDate, 
  endDate, 
  travelGroup 
}: ForYouSectionProps) {
  const [attractions] = useState<Attraction[]>(ATTRACTIONS);
  const [imageLoadError, setImageLoadError] = useState<Record<string, boolean>>({});
  const { planData } = usePlanContext();

  // Use context data if available, otherwise use props
  const currentDestination = planData?.destination || destination;
  const currentStartDate = planData?.startDate || startDate;
  const currentEndDate = planData?.endDate || endDate;
  const currentTravelGroup = planData?.travelGroup || travelGroup;

  const handleExplore = (attraction: Attraction) => {
    try {
      // Use Google Maps link for all attractions
      window.open(attraction.externalLinks.google, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error handling explore:', error);
    }
  };

  const handleImageError = (attractionId: string) => {
    try {
      setImageLoadError(prev => ({
        ...prev,
        [attractionId]: true
      }));
    } catch (error) {
      console.error('Error handling image error:', error);
    }
  };

  return (
    <div className="p-8">
      {/* Popular Destinations Section - Hidden on mobile */}
      <div className="mb-8 hidden md:block">
        <div className="flex items-center mb-6">
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-semibold">Popular Destinations</h2>
            <span className="flex items-center space-x-1">
              <span className="text-2xl">🌍</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {attractions.map((attraction) => (
            <div
              key={attraction.id}
              className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 group"
            >
              {/* Save Icon - appears on hover */}
              <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Add save functionality here
                    console.log(`Saved ${attraction.name}`);
                  }}
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors duration-200 shadow-lg"
                  title="Save destination"
                >
                  <Bookmark className="h-5 w-5 text-white stroke-blue-600 stroke-2" />
                </button>
              </div>
              <div className="relative h-64 w-full bg-gray-200">
                {!imageLoadError[attraction.id] && (
                  <Image
                    src={attraction.imageUrl}
                    alt={attraction.name}
                    fill
                    className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={attraction.id === '1'}
                    loading={attraction.id === '1' ? 'eager' : 'lazy'}
                    quality={80}
                    onError={() => handleImageError(attraction.id)}
                  />
                )}
                {imageLoadError[attraction.id] && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                    <span className="text-4xl">🏞️</span>
                  </div>
                )}
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6">
                <h3 className="text-2xl font-semibold text-white mb-1">{attraction.name}</h3>
                <p className="text-sm text-gray-200">{attraction.type}</p>
                <p className="text-xs text-gray-300 mt-1">{attraction.location}</p>
                <button 
                  onClick={() => handleExplore(attraction)}
                  className="mt-3 px-4 py-2 bg-white/20 text-white rounded-lg backdrop-blur-sm hover:bg-white/30 transition-colors text-sm"
                  title="View on Google Maps"
                >
                  Explore
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hotel Recommendations Section - Only show if destination is provided */}
      {currentDestination && currentStartDate && currentEndDate && (
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-semibold">Hotel Recommendations for {currentDestination}</h2>
              <span className="flex items-center space-x-1">
                <span className="text-2xl">🏨</span>
              </span>
            </div>
          </div>
          
          <AsyncHotelOffers 
            destination={currentDestination}
            startDate={currentStartDate}
            endDate={currentEndDate}
            travelGroup={currentTravelGroup || "2 adults"}
          />
        </div>
      )}

      {/* eSIM Section - Show when destination is provided */}
      {currentDestination && (
        <div className="mb-8">
          <ESimPlansSection destination={currentDestination} />
        </div>
      )}

      {/* Preview Section - Show when destination is entered but form not submitted */}
      {currentDestination && (!currentStartDate || !currentEndDate) && (
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-semibold">Ready to explore {currentDestination}?</h2>
              <span className="flex items-center space-x-1">
                <span className="text-2xl">✈️</span>
              </span>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
            <div className="text-center">
              <div className="text-4xl mb-4">🏨</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Hotel recommendations will appear here
              </h3>
              <p className="text-gray-600 mb-4">
                Complete your travel dates and preferences to see personalized hotel options for {currentDestination}
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <span>✅ Real-time pricing</span>
                <span>•</span>
                <span>✅ Verified reviews</span>
                <span>•</span>
                <span>✅ Instant booking</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
