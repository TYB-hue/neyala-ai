'use client';

import type { Hotel } from "@/types";

interface HotelsContentProps {
  hotels: Hotel[];
}

export default function HotelsContent({ hotels }: HotelsContentProps) {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Hotels</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Add New Hotel
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map((hotel) => (
          <div key={hotel.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-48">
              <img
                src={hotel.image}
                alt={hotel.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  hotel.status === 'CONFIRMED' 
                    ? 'bg-green-100 text-green-800'
                    : hotel.status === 'PENDING'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {hotel.status.charAt(0) + hotel.status.slice(1).toLowerCase()}
                </span>
              </div>
            </div>

            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-lg font-semibold">{hotel.name}</h2>
                <div className="flex items-center">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1 text-gray-600">{hotel.rating}</span>
                </div>
              </div>

              <p className="text-gray-600 mb-2">{hotel.location}</p>
              <p className="text-gray-600 mb-4">{hotel.priceRange} per night</p>

              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {hotel.amenities.map((amenity, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Edit Details
                  </button>
                  <button className="text-gray-600 hover:text-gray-700 text-sm font-medium">
                    View Bookings
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 