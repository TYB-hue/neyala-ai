'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

interface MapPlace {
  name: string;
  lat: number;
  lng: number;
  type: string;
  photoUrl?: string; // Optional Google Place photo URL
}

interface MapProps {
  center: {
    lat: number;
    lng: number;
  };
  places: MapPlace[];
}

declare global {
  interface Window {
    initMap: () => void;
    google: any;
  }
}

const MapComponent: React.FC<MapProps> = ({ center, places }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const infoWindowsRef = useRef<any[]>([]);
  const isInitializedRef = useRef(false);
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Custom marker icon (Flaticon pin)
  const markerIcon = 'https://cdn-icons-png.flaticon.com/512/2776/2776067.png';

  // Initialize/Update markers without changing map center or zoom
  const updateMarkers = useCallback((map: any) => {
    if (!window.google?.maps || !map) return;

    // Clear existing markers and info windows
    markersRef.current.forEach((marker) => marker.setMap(null));
    infoWindowsRef.current.forEach((infoWindow) => infoWindow.close());
    markersRef.current = [];
    infoWindowsRef.current = [];

    if (places.length === 0) return;

    let openInfoWindow: any = null;

    places.forEach((place) => {
      const position = { lat: place.lat, lng: place.lng };

      // Create marker with custom Flaticon pin icon
      const marker = new window.google.maps.Marker({
        position,
        map,
        title: place.name,
        icon: {
          url: markerIcon,
          scaledSize: new window.google.maps.Size(34, 34),
          anchor: new window.google.maps.Point(17, 34),
        },
        animation: window.google.maps.Animation.DROP,
      });

      // Format place type for display
      const typeDisplay = place.type.charAt(0).toUpperCase() + place.type.slice(1);
      
      // Create Google Maps search link
      const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`;

      // Get photo URL with fallback (use data URI for placeholder to avoid external dependencies)
      const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjYwIiBoZWlnaHQ9IjE2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjYwIiBoZWlnaHQ9IjE2MCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';
      const photoUrl = place.photoUrl || placeholderImage;

      // Create info window with larger image and improved styling
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; width: 260px; padding: 0; margin: 0; overflow: hidden; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <!-- Large Image Section - Takes up more space -->
            <img src="${photoUrl}" 
                 style="width: 100%; height: 160px; object-fit: cover; display: block; margin: 0; padding: 0;" 
                 alt="${place.name}"
                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjYwIiBoZWlnaHQ9IjE2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjYwIiBoZWlnaHQ9IjE2MCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4='" />
            
            <!-- Content Section with improved spacing -->
            <div style="padding: 14px; background: white;">
              <!-- Title and Type -->
              <div style="margin-bottom: 10px;">
                <strong style="font-size: 17px; font-weight: 600; color: #202124; line-height: 1.4; display: block; margin-bottom: 5px;">
                  ${place.name}
                </strong>
                <span style="font-size: 13px; color: #5f6368; text-transform: capitalize; font-weight: 500;">
                  ${typeDisplay}
                </span>
              </div>
              
              <!-- Google Maps Link with icon -->
              <a href="${googleMapsLink}" 
                 target="_blank" 
                 style="display: inline-flex; align-items: center; color: #1a73e8; text-decoration: none; font-size: 13px; font-weight: 500; padding-top: 10px; margin-top: 8px; border-top: 1px solid #e8eaed; transition: color 0.2s;"
                 onmouseover="this.style.color='#1557b0'"
                 onmouseout="this.style.color='#1a73e8'">
                <svg style="width: 16px; height: 16px; margin-right: 6px; flex-shrink: 0;" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <span>View on Google Maps</span>
              </a>
            </div>
          </div>
        `,
      });

      // Add click listener to marker - opens InfoWindow
      marker.addListener('click', () => {
        // Close previously opened info window
        if (openInfoWindow) {
          openInfoWindow.close();
        }
        infoWindow.open(map, marker);
        openInfoWindow = infoWindow;
      });

      markersRef.current.push(marker);
      infoWindowsRef.current.push(infoWindow);
    });

    // Fit bounds ONLY on initial load, not on subsequent updates
    // This prevents map from snapping back when user has panned/zoomed
    if (places.length > 0 && !isInitializedRef.current) {
      const bounds = new window.google.maps.LatLngBounds();
      places.forEach((place) => {
        bounds.extend({ lat: place.lat, lng: place.lng });
      });
      
      // Include center point if provided
      if (center.lat && center.lng) {
        bounds.extend({ lat: center.lat, lng: center.lng });
      }
      
      // Fit bounds with padding only once
      // Use setTimeout to ensure map is fully rendered
      setTimeout(() => {
        if (!isInitializedRef.current) {
          map.fitBounds(bounds, { padding: 50 });
          isInitializedRef.current = true;
        }
      }, 100);
    }
  }, [places, center]);

  // Initialize the map - only runs once
  const initializeMap = useCallback(() => {
    if (!mapRef.current || !window.google?.maps?.Map || isInitializedRef.current) {
      return false;
    }

    try {
      // Set center only once during initialization (never changes after this)
      const initialCenter = { lat: center.lat, lng: center.lng };
      
      const map = new window.google.maps.Map(mapRef.current, {
        center: initialCenter,
        zoom: 12, // Default zoom, user can change it freely
        // Flexible zoom and pan settings
        gestureHandling: 'auto', // Allows pan/zoom on all devices
        zoomControl: true, // Show zoom controls
        scrollwheel: true, // Allow mouse wheel zooming
        draggable: true, // Allow dragging to pan
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        disableDefaultUI: false,
      });

      mapInstanceRef.current = map;
      setIsLoaded(true);
      setError(null);

      // Update markers after map is ready
      // Wait a moment for map to be fully initialized
      setTimeout(() => {
        if (!isInitializedRef.current) {
          updateMarkersRef.current(map);
        }
      }, 300);

      return true;
    } catch (err) {
      console.error('Error initializing map:', err);
      setError(`Failed to initialize map: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return false;
    }
  }, [center.lat, center.lng]); // Only depend on center coordinates for initial setup
  
  // Store updateMarkers reference to use in initializeMap
  const updateMarkersRef = useRef(updateMarkers);
  updateMarkersRef.current = updateMarkers;

  // Load Google Maps script and initialize
  useEffect(() => {
    if (!googleMapsApiKey) {
      setError('Google Maps API key not configured');
      return;
    }

    // Prevent multiple initializations
    if (isInitializedRef.current) return;

    // Check if API is already loaded
    if (window.google?.maps?.Map) {
      // Wait for ref to be ready
      const checkReady = setInterval(() => {
        if (mapRef.current && !isInitializedRef.current) {
          clearInterval(checkReady);
          initializeMap();
        }
      }, 50);

      const timeout = setTimeout(() => {
        clearInterval(checkReady);
        if (!mapRef.current) {
          setError('Map container not ready');
        }
      }, 2000);

      return () => {
        clearInterval(checkReady);
        clearTimeout(timeout);
      };
    }

    // Check if script is already loading/exists
    const existingScript = document.getElementById('google-maps-script');
    if (existingScript) {
      // Script exists, wait for it to load
      const checkApi = setInterval(() => {
        if (window.google?.maps?.Map && mapRef.current && !isInitializedRef.current) {
          clearInterval(checkApi);
          initializeMap();
        }
      }, 100);

      const timeout = setTimeout(() => {
        clearInterval(checkApi);
        if (!window.google?.maps) {
          setError('Google Maps API failed to load');
        }
      }, 5000);

      // Set up callback in case it hasn't fired yet
      window.initMap = () => {
        setTimeout(() => {
          if (mapRef.current && !isInitializedRef.current) {
            initializeMap();
          }
        }, 100);
      };

      return () => {
        clearInterval(checkApi);
        clearTimeout(timeout);
      };
    }

    // Load the script
    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&loading=async&callback=initMap`;
    script.async = true;
    script.defer = true;

    script.onerror = () => {
      setError('Failed to load Google Maps. Please check your API key and ensure the Maps JavaScript API is enabled.');
    };

    window.initMap = () => {
      setTimeout(() => {
        if (mapRef.current && !isInitializedRef.current) {
          initializeMap();
        }
      }, 100);
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup on unmount
      markersRef.current.forEach((marker) => marker.setMap(null));
      infoWindowsRef.current.forEach((infoWindow) => infoWindow.close());
    };
  }, [googleMapsApiKey, initializeMap]);

  // Update markers when places change (without resetting map center/zoom)
  useEffect(() => {
    if (mapInstanceRef.current && isLoaded && isInitializedRef.current) {
      // Only update markers, don't change center or zoom
      updateMarkers(mapInstanceRef.current);
    }
  }, [places, updateMarkers, isLoaded]);

  if (!googleMapsApiKey) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
        <div className="text-center p-4">
          <p className="text-gray-600 font-semibold mb-2">Google Maps API key not configured</p>
          <p className="text-sm text-gray-500">Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your environment variables</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden" style={{ minHeight: '600px' }}>
      {/* Map container - always rendered */}
      <div
        ref={mapRef}
        id="map"
        className="w-full h-full"
        style={{
          width: '100%',
          height: '100%',
          minHeight: '600px',
        }}
      />

      {/* Loading overlay */}
      {!isLoaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-90 rounded-lg z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading Google Maps...</p>
          </div>
        </div>
      )}

      {/* Error overlay */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-90 rounded-lg z-10">
          <div className="text-center p-4">
            <p className="text-red-600 font-semibold mb-2">Error loading map</p>
            <p className="text-sm text-gray-600">{error}</p>
          </div>
        </div>
      )}
            </div>
  );
};

export default MapComponent; 
