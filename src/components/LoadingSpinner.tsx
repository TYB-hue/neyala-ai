'use client';

import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800">Generating Your Perfect Itinerary</h2>
        <p className="text-gray-600 mt-2">Please wait while we craft your personalized travel plan...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner; 
 