'use client';

import { format } from "date-fns";
import type { Trip } from "@/types";

interface HistoryContentProps {
  trips: Trip[];
}

export default function HistoryContent({ trips }: HistoryContentProps) {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Travel History</h1>
      
      <div className="space-y-6">
        {trips.map((trip) => (
          <div key={trip.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="md:flex">
              <div className="md:flex-shrink-0">
                <img
                  className="h-48 w-full object-cover md:w-48"
                  src={trip.image}
                  alt={trip.destination}
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {trip.destination}
                  </h2>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    trip.status === 'COMPLETED' 
                      ? 'bg-green-100 text-green-800'
                      : trip.status === 'PLANNED'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {trip.status.charAt(0) + trip.status.slice(1).toLowerCase()}
                  </span>
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-600">
                    {format(new Date(trip.startDate), "MMM d, yyyy")} - {format(new Date(trip.endDate), "MMM d, yyyy")}
                  </p>
                  <p className="text-gray-600">Budget: {trip.budget}</p>
                  <p className="text-gray-600">Travel Style: {trip.travelStyle}</p>
                </div>

                <div className="mb-4">
                  <h3 className="font-medium text-gray-900 mb-2">Activities</h3>
                  <div className="space-y-2">
                    {trip.activities.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-2">
                        <span className={`w-2 h-2 rounded-full ${
                          activity.type === 'FLIGHT' ? 'bg-blue-500' :
                          activity.type === 'HOTEL' ? 'bg-green-500' :
                          activity.type === 'TOUR' ? 'bg-yellow-500' :
                          activity.type === 'RESTAURANT' ? 'bg-red-500' :
                          'bg-gray-500'
                        }`} />
                        <span className="text-sm text-gray-600">
                          {activity.name} - {format(new Date(activity.date), "MMM d")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Requirements</h3>
                  <div className="flex flex-wrap gap-2">
                    {trip.requirements.map((req, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                      >
                        {req}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 