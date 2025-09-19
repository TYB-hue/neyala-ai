'use client';

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, MapPinIcon, CreditCardIcon, UserIcon } from 'lucide-react';
import type { Trip } from '@/types';

interface TripsContentProps {
  userId: string;
}

export default function TripsContent({ userId }: TripsContentProps) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/user/trips');
        if (!response.ok) {
          throw new Error('Failed to fetch trips');
        }
        const data = await response.json();
        setTrips(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch trips');
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <div className="text-center p-8">
        <div className="text-6xl mb-4">🧳</div>
        <h3 className="text-xl font-semibold mb-2">No trips planned yet</h3>
        <p className="text-gray-600 mb-4">Start planning your next adventure!</p>
        <a 
          href="/plan" 
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Plan Your First Trip
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Trips</h2>
        <a 
          href="/plan" 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Plan New Trip
        </a>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.map((trip) => (
          <div key={trip.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {trip.image && (
              <div className="h-48 relative">
                <img 
                  src={trip.image} 
                  alt={trip.destination}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    trip.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                    trip.status === 'ONGOING' ? 'bg-blue-100 text-blue-800' :
                    trip.status === 'PLANNED' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {trip.status}
                  </span>
                </div>
              </div>
            )}
            
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3 flex items-center">
                <MapPinIcon className="w-5 h-5 text-blue-600 mr-2" />
                {trip.destination}
              </h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-gray-600">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  <span>
                    {format(new Date(trip.startDate), 'MMM dd')} - {format(new Date(trip.endDate), 'MMM dd, yyyy')}
                  </span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <CreditCardIcon className="w-4 h-4 mr-2" />
                  <span>Budget: {trip.budget}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <UserIcon className="w-4 h-4 mr-2" />
                  <span>Style: {trip.travelStyle}</span>
                </div>
              </div>
              
              {trip.activities.length > 0 && (
                <div className="border-t pt-3">
                  <h4 className="font-medium mb-2">Activities ({trip.activities.length})</h4>
                  <div className="flex flex-wrap gap-1">
                    {trip.activities.slice(0, 3).map((activity) => (
                      <span 
                        key={activity.id}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                      >
                        {activity.name}
                      </span>
                    ))}
                    {trip.activities.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        +{trip.activities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}







