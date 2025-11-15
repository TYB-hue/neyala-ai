'use client';

import React from 'react';
import Image from 'next/image';
import { format } from 'date-fns';

interface ItineraryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  itinerary: {
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
    itineraries: Array<{
      day: number;
      date: string;
      title: string;
      morning: {
        activity: string;
        description: string;
        time: string;
      };
      afternoon: {
        activity: string;
        description: string;
        time: string;
      };
      restaurant: {
        name: string;
        cuisine: string;
        description: string;
      };
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
  };
}

export default function ItineraryPanel({ isOpen, onClose, itinerary }: ItineraryPanelProps) {
  if (!itinerary) return null;

  return (
    <div
      className={`fixed inset-y-0 right-0 w-[600px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="relative h-[300px]">
        <Image
          src={itinerary.headerImage}
          alt={itinerary.destination}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 p-6 flex flex-col justify-end">
          <h2 className="text-3xl font-bold text-white mb-2">{itinerary.destination}</h2>
          <p className="text-white">
            {format(new Date(itinerary.dates.start), 'MMM d')} -{' '}
            {format(new Date(itinerary.dates.end), 'MMM d, yyyy')}
          </p>
        </div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-200"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-6 overflow-y-auto" style={{ height: 'calc(100vh - 300px)' }}>
        <div className="space-y-6">
          <section>
            <h3 className="text-xl font-semibold mb-3">About</h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <div>
                <h4 className="font-medium mb-2">History</h4>
                <p className="text-gray-600">{itinerary.overview.history}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Culture</h4>
                <p className="text-gray-600">{itinerary.overview.culture}</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">Arrival</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">{itinerary.airport.name}</h4>
              <p className="text-gray-600">{itinerary.airport.info}</p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">Accommodations</h3>
            <div className="space-y-4">
              {itinerary.hotels.map((hotel, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{hotel.name}</h4>
                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-1">★</span>
                      <span>{hotel.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-600">{`$${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Math.round(hotel.price))}`}/night</p>
                </div>
              ))}
            </div>
          </section>

          <section>
                    <h3 className="text-xl font-semibold mb-3">Daily Itineraries</h3>
        <div className="space-y-6">
          {itinerary.itineraries.map((day, dayIndex) => (
            <div key={dayIndex} className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-3">{day.title}</h4>
              
              <div className="space-y-3">
                <div>
                  <p className="font-medium">🌅 Morning: {day.morning.activity}</p>
                  <p className="text-sm text-gray-600">{day.morning.description}</p>
                  <p className="text-sm text-gray-500">{day.morning.time}</p>
                </div>
                <div>
                  <p className="font-medium">🌞 Afternoon: {day.afternoon.activity}</p>
                  <p className="text-sm text-gray-600">{day.afternoon.description}</p>
                  <p className="text-sm text-gray-500">{day.afternoon.time}</p>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <p className="font-medium">🍽️ Restaurant:</p>
                  <p className="text-sm text-gray-600">{day.restaurant.name} ({day.restaurant.cuisine})</p>
                  <p className="text-sm text-gray-600">{day.restaurant.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">Transportation</h3>
            <div className="space-y-4">
              {itinerary.transportation.map((transport, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">{transport.type}</h4>
                  <p className="text-gray-600">{transport.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">Estimated Costs</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Accommodation</span>
                  <span>${itinerary.estimatedCost.accommodation}</span>
                </div>
                <div className="flex justify-between">
                  <span>Activities</span>
                  <span>${itinerary.estimatedCost.activities}</span>
                </div>
                <div className="flex justify-between">
                  <span>Transportation</span>
                  <span>${itinerary.estimatedCost.transportation}</span>
                </div>
                <div className="flex justify-between">
                  <span>Food</span>
                  <span>${itinerary.estimatedCost.food}</span>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t">
                  <span>Total</span>
                  <span>${itinerary.estimatedCost.total}</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 