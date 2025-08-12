'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import ItineraryPanel from './ItineraryPanel';

export interface Attraction {
  id: string;
  name: string;
  type: string;
  location: string;
  imageUrl: string;
}

interface Itinerary {
  id: string;
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
    info: string;
  };
  hotels: Array<{
    name: string;
    rating: number;
    price: number;
  }>;
  activities: Array<{
    name: string;
    description: string;
    day: number;
    time: string;
  }>;
  transportation: Array<{
    type: string;
    description: string;
  }>;
  estimatedCost: {
    accommodation: number;
    activities: number;
    transportation: number;
    food: number;
    total: number;
  };
}

const ATTRACTIONS = [
  {
    id: '1',
    name: 'Nubian Pyramids',
    type: 'Ancient Monuments',
    location: 'Meroe, Sudan',
    imageUrl: '/images/pyramids.png',
  },
  {
    id: '2',
    name: 'Empire State Building',
    type: 'Iconic Landmark',
    location: '20 W 34th St, New York',
    imageUrl: 'https://images.unsplash.com/photo-1555109307-f7d9da25c244?w=640&q=80',
  },
  {
    id: '3',
    name: 'Pyramids of Giza',
    type: 'Ancient Wonder',
    location: 'Giza, Egypt',
    imageUrl: 'https://images.unsplash.com/photo-1590133324192-1df305deea6b?w=640&q=80',
  },
  {
    id: '4',
    name: 'Taj Mahal',
    type: 'Historic Monument',
    location: 'Agra, India',
    imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=640&q=80',
  },
  {
    id: '5',
    name: 'Santorini',
    type: 'Island Paradise',
    location: 'Cyclades, Greece',
    imageUrl: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=640&q=80',
  },
  {
    id: '6',
    name: 'Petra',
    type: 'Ancient City',
    location: "Ma'an Governorate, Jordan",
    imageUrl: 'https://images.unsplash.com/photo-1579606032821-4e6161c81bd3?w=640&q=80',
  },
  {
    id: '7',
    name: 'Machu Picchu',
    type: 'Ancient Ruins',
    location: 'Cusco Region, Peru',
    imageUrl: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=640&q=80',
  },
  {
    id: '8',
    name: 'Mount Fuji',
    type: 'Natural Wonder',
    location: 'Honshu, Japan',
    imageUrl: 'https://images.unsplash.com/photo-1570459027562-4a916cc6113f?w=640&q=80',
  }
];

const DEFAULT_ITINERARY: Itinerary = {
  id: '0',
  destination: '',
  dates: {
    start: new Date().toISOString(),
    end: new Date().toISOString()
  },
  headerImage: '',
  overview: {
    history: '',
    culture: ''
  },
  airport: {
    name: '',
    info: ''
  },
  hotels: [],
  activities: [],
  transportation: [],
  estimatedCost: {
    accommodation: 0,
    activities: 0,
    transportation: 0,
    food: 0,
    total: 0
  }
};

const convertAttractionToItinerary = (attraction: Attraction | null): Itinerary => {
  if (!attraction) return DEFAULT_ITINERARY;
  
  return {
    id: attraction.id,
    destination: attraction.name,
    dates: {
      start: new Date().toISOString(),
      end: new Date().toISOString()
    },
    headerImage: attraction.imageUrl,
    overview: {
      history: `Discover the rich history of ${attraction.name}`,
      culture: `Experience the unique culture of ${attraction.name}`
    },
    airport: {
      name: `${attraction.name} International Airport`,
      info: `Main gateway to ${attraction.name}`
    },
    hotels: [{
      name: "Sample Hotel",
      rating: 4.5,
      price: 150
    }],
    activities: [{
      name: "City Tour",
      description: `Explore the beautiful ${attraction.name}`,
      day: 1,
      time: "09:00 AM"
    }],
    transportation: [{
      type: "Airport Transfer",
      description: "Private transfer from airport to hotel"
    }],
    estimatedCost: {
      accommodation: 150,
      activities: 100,
      transportation: 50,
      food: 100,
      total: 400
    }
  };
};

export default function ForYouSection() {
  const [attractions] = useState<Attraction[]>(ATTRACTIONS);
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [imageLoadError, setImageLoadError] = useState<Record<string, boolean>>({});

  const handleExplore = (attraction: Attraction) => {
    setSelectedAttraction(attraction);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setTimeout(() => setSelectedAttraction(null), 300);
  };

  const handleImageError = (attractionId: string) => {
    setImageLoadError(prev => ({
      ...prev,
      [attractionId]: true
    }));
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <h2 className="text-2xl font-semibold">Popular Destinations</h2>
          <span className="flex items-center space-x-1">
            <span className="text-2xl">🌍</span>
          </span>
        </div>
        <button className="text-sm text-gray-600 hover:text-gray-800">View All</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {attractions.map((attraction) => (
          <div
            key={attraction.id}
            className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 group"
          >
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
              >
                Explore
              </button>
            </div>
          </div>
        ))}
      </div>

      <ItineraryPanel
        itinerary={convertAttractionToItinerary(selectedAttraction)}
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
      />
    </div>
  );
}
