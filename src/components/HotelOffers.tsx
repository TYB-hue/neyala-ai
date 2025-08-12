'use client';

import React from 'react';
import Image from 'next/image';

interface HotelOffer {
  id: string;
  name: string;
  stars: number;
  rating: number;
  price: number;
  currency: string;
  image: string;
  location: {
    lat: number;
    lng: number;
  };
  amenities: string[];
  description: string;
  bookingUrl: string;
}

interface HotelOffersProps {
  hotels: HotelOffer[];
  destination: string;
}

export default function HotelOffers({ hotels, destination }: HotelOffersProps) {
  if (!hotels || hotels.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Hotel Options in {destination}</h3>
        <p className="text-gray-600">Loading hotel options...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">Hotel Options in {destination}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hotels.map((hotel) => (
          <div key={hotel.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48">
              <Image
                src={hotel.image}
                alt={hotel.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded text-sm font-semibold">
                {hotel.stars}★
              </div>
            </div>
            
            <div className="p-4">
              <h4 className="font-semibold text-lg mb-2">{hotel.name}</h4>
              
              <div className="flex items-center mb-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < hotel.stars ? 'text-yellow-400' : 'text-gray-300'}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">({hotel.rating})</span>
              </div>
              
              <p className="text-gray-600 text-sm mb-3 truncate">{hotel.description}</p>
              
              <div className="flex items-center justify-between mb-3">
                <div className="text-2xl font-bold text-green-600">
                  {hotel.currency} {Math.round(hotel.price)}
                </div>
                <span className="text-sm text-gray-500">per night</span>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {hotel.amenities.slice(0, 3).map((amenity, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
              
              <a
                href={hotel.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Book Now
              </a>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          💡 <strong>Pro Tip:</strong> These are real-time hotel offers with actual availability and pricing. 
          Click "Book Now" to secure your reservation with our trusted partners.
        </p>
      </div>
    </div>
  );
} 