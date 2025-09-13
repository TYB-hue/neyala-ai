'use client';

import React from 'react';

interface SimpleMapProps {
  center: {
    lat: number;
    lng: number;
  };
  markers: Array<{
    position: {
      lat: number;
      lng: number;
    };
    title: string;
    type: 'activity' | 'hotel';
  }>;
}

const SimpleMap: React.FC<SimpleMapProps> = ({ center, markers }) => {
  // Create a simple map using Google Maps embed as fallback
  const googleMapsUrl = `https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&center=${center.lat},${center.lng}&zoom=12`;

  return (
    <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
      <iframe
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={googleMapsUrl}
        title="Location Map"
      />
      {markers.length > 0 && (
        <div className="absolute top-2 left-2 bg-white bg-opacity-90 rounded-lg p-2 text-xs">
          <p className="font-semibold">Locations:</p>
          <ul className="mt-1">
            {markers.slice(0, 3).map((marker, index) => (
              <li key={index} className="flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${
                  marker.type === 'hotel' ? 'bg-blue-500' : 'bg-green-500'
                }`}></span>
                {marker.title}
              </li>
            ))}
            {markers.length > 3 && (
              <li className="text-gray-500">+{markers.length - 3} more</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SimpleMap;
