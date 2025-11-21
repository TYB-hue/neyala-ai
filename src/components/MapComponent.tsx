'use client';

import React, { useEffect, useRef, useState } from 'react';

interface MapProps {
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

declare global {
  interface Window {
    initMap: () => void;
    google: any;
  }
}

const MapComponent: React.FC<MapProps> = ({ center, markers }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [map, setMap] = useState<any>(null);
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!googleMapsApiKey) {
      console.error('Google Maps API key is not configured');
      return;
    }

    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      initializeMap();
      return;
    }

    // Load Google Maps JavaScript API
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&loading=async&callback=initMap`;
    script.async = true;
    script.defer = true;
    script.id = 'google-maps-script';

    // Set up the callback
    window.initMap = () => {
      initializeMap();
    };

    // Check if script already exists
    if (document.getElementById('google-maps-script')) {
      if (window.google && window.google.maps) {
        initializeMap();
      }
      return;
    }

    document.head.appendChild(script);

    return () => {
      // Cleanup: remove the callback
      if (window.initMap) {
        delete window.initMap;
      }
    };
  }, []);

  useEffect(() => {
    if (map && markers.length > 0) {
      updateMarkers();
    }
  }, [map, markers]);

  const initializeMap = () => {
    if (!mapRef.current || !window.google || !window.google.maps) {
      return;
    }

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: { lat: center.lat, lng: center.lng },
      zoom: 12,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
    });

    setMap(mapInstance);
    setIsLoaded(true);

    // Add markers after map is initialized
    updateMarkers(mapInstance);
  };

  const updateMarkers = (mapInstance?: any) => {
    const mapToUse = mapInstance || map;
    if (!mapToUse || !window.google) return;

    // Clear existing markers (you might want to store marker references)
    // For now, we'll just add new ones

    markers.forEach((marker) => {
      const markerInstance = new window.google.maps.Marker({
        position: { lat: marker.position.lat, lng: marker.position.lng },
        map: mapToUse,
        title: marker.title,
        icon: marker.type === 'hotel' 
          ? {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: '#3B82F6', // Blue for hotels
              fillOpacity: 1,
              strokeColor: '#FFFFFF',
              strokeWeight: 2,
            }
          : {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: '#10B981', // Green for activities
              fillOpacity: 1,
              strokeColor: '#FFFFFF',
              strokeWeight: 2,
            },
      });

      // Add info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px;">
            <h3 style="margin: 0 0 4px 0; font-weight: 600; font-size: 14px;">${marker.title}</h3>
            <p style="margin: 0; color: #6B7280; font-size: 12px;">${marker.type === 'hotel' ? 'Hotel' : 'Activity'}</p>
          </div>
        `,
      });

      markerInstance.addListener('click', () => {
        infoWindow.open(mapToUse, markerInstance);
      });
    });

    // Fit bounds to show all markers
    if (markers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      markers.forEach((marker) => {
        bounds.extend({ lat: marker.position.lat, lng: marker.position.lng });
      });
      // Also include center point
      bounds.extend({ lat: center.lat, lng: center.lng });
      mapToUse.fitBounds(bounds);
    }
  };

  if (!googleMapsApiKey) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <div className="text-center">
          <p className="text-gray-600">Google Maps API key not configured</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading Google Maps...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full rounded-lg overflow-hidden"
      style={{ minHeight: '400px' }}
    />
  );
};

export default MapComponent;
