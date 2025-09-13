'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

// Create a wrapper component with error handling
const MapWithErrorBoundary = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p className="text-gray-600">Loading map...</p>
      </div>
    </div>
  )
});

// Simple map fallback
const SimpleMapFallback = dynamic(() => import('./SimpleMap'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p className="text-gray-600">Loading fallback map...</p>
      </div>
    </div>
  )
});

// Error boundary component
const MapErrorFallback = ({ center, markers }: any) => {
  return (
    <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
      <div className="text-center">
        <div className="text-gray-500 mb-2">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
          </svg>
        </div>
        <p className="text-gray-600 mb-2">Map temporarily unavailable</p>
        <p className="text-sm text-gray-500">Location: {center?.lat?.toFixed(4)}, {center?.lng?.toFixed(4)}</p>
        {markers && markers.length > 0 && (
          <p className="text-sm text-gray-500 mt-1">{markers.length} locations available</p>
        )}
      </div>
    </div>
  );
};

// Main Map component with error handling
const Map = (props: any) => {
  const [hasError, setHasError] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    const handleError = (error: any) => {
      console.error('Map component error:', error);
      if (!useFallback) {
        setUseFallback(true);
      } else {
        setHasError(true);
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, [useFallback]);

  if (hasError) {
    return <MapErrorFallback {...props} />;
  }

  if (useFallback) {
    return <SimpleMapFallback {...props} />;
  }

  return <MapWithErrorBoundary {...props} />;
};

export default Map;