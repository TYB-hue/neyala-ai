'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Dynamically import the map component to prevent SSR issues
const Map = dynamic(() => import('@/components/Map'), { ssr: false });

// Import HotelOffers component
import HotelOffers from '@/components/HotelOffers';

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

interface Activity {
  name: string;
  description: string;
  image: string;
  day: number;
  time: string;
  location: {
    lat: number;
    lng: number;
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
    info: string;
  };
  hotels: Hotel[];
  activities: Activity[];
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
            setItineraryData(parsedData);
            setLoading(false);
            return;
          } catch (parseError) {
            console.error('Error parsing localStorage data:', parseError);
            localStorage.removeItem(localStorageKey);
          }
        }
        
        // If not in localStorage, try to fetch from API
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
        const requiredFields = ['destination', 'headerImage', 'overview', 'airport', 'hotels', 'activities', 'transportation', 'estimatedCost'];
        const missingFields = requiredFields.filter(field => !data[field]);
        
        if (missingFields.length > 0) {
          console.error('Missing fields in data:', data);
          throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }

        setItineraryData(data);
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
    return <div>Loading...</div>;
  }

  if (!itineraryData) {
    return <div>Itinerary not found</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Panel - Scrollable Content */}
      <div className="w-1/2 overflow-y-auto p-6">
        {/* Header Image with Destination */}
        <div className="relative h-64 rounded-xl overflow-hidden mb-8">
          <Image
            src={itineraryData.headerImage}
            alt={itineraryData.destination}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl font-bold mb-2">{itineraryData.destination}</h1>
              <p className="text-xl">
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
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="relative h-48">
              <Image
                src={itineraryData.airport.image}
                alt={itineraryData.airport.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{itineraryData.airport.name}</h3>
              <p>{itineraryData.airport.info}</p>
            </div>
          </div>
        </section>

        {/* Hotels Section */}
        <section className="mb-8">
          <HotelOffers 
            hotels={itineraryData.hotels.map(hotel => ({
              id: hotel.name,
              name: hotel.name,
              stars: Math.floor(hotel.rating),
              rating: hotel.rating,
              price: Math.round(hotel.price),
              currency: 'USD',
              image: hotel.image,
              location: hotel.location,
              amenities: ['WiFi', 'Air Conditioning', 'Free Breakfast'],
              description: `Comfortable accommodation in ${itineraryData.destination}`,
              bookingUrl: hotel.link
            }))}
            destination={itineraryData.destination}
          />
        </section>

        {/* Daily Itinerary */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Your Itinerary</h2>
          {itineraryData.activities.reduce((acc: any[], activity) => {
            const dayGroup = acc.find(group => group.day === activity.day);
            if (dayGroup) {
              dayGroup.activities.push(activity);
            } else {
              acc.push({ day: activity.day, activities: [activity] });
            }
            return acc;
          }, []).map((day, index) => (
            <div key={index} className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Day {day.day}</h3>
              <div className="space-y-4">
                {day.activities.map((activity: Activity, actIndex: number) => (
                  <div key={actIndex} className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="relative h-48">
                      <Image
                        src={activity.image}
                        alt={activity.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-lg font-semibold">{activity.name}</h4>
                        <span className="text-gray-600">{activity.time}</span>
                      </div>
                      <p className="text-gray-600">{activity.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Transportation Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Getting Around</h2>
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
        </section>

        {/* eSIM Section */}
        {itineraryData.eSIM && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Stay Connected</h2>
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{itineraryData.eSIM.provider} eSIM</h3>
                  <p className="text-gray-600 mb-2">{itineraryData.eSIM.description}</p>
                  <p className="text-sm text-gray-500">Starting from {itineraryData.eSIM.price}</p>
                </div>
                <Link 
                  href={itineraryData.eSIM.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Get eSIM
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Estimated Costs */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Estimated Costs (USD)</h2>
          <div className="bg-white shadow rounded-lg p-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Accommodation</span>
                <span>${itineraryData.estimatedCost.accommodation}</span>
              </div>
              <div className="flex justify-between">
                <span>Activities</span>
                <span>${itineraryData.estimatedCost.activities}</span>
              </div>
              <div className="flex justify-between">
                <span>Transportation</span>
                <span>${itineraryData.estimatedCost.transportation}</span>
              </div>
              <div className="flex justify-between">
                <span>Food</span>
                <span>${itineraryData.estimatedCost.food}</span>
              </div>
              <div className="border-t pt-4 flex justify-between font-bold">
                <span>Total</span>
                <span>${itineraryData.estimatedCost.total}</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Right Panel - Map */}
      <div className="w-1/2 relative">
        <div className="absolute inset-0">
          <Map
            center={itineraryData.activities[0]?.location}
            markers={[
              ...itineraryData.activities.map(activity => ({
                position: activity.location,
                title: activity.name,
                type: 'activity' as const
              })),
              ...itineraryData.hotels.map(hotel => ({
                position: hotel.location,
                title: hotel.name,
                type: 'hotel' as const
              }))
            ]}
          />
        </div>
      </div>
    </div>
  );
} 