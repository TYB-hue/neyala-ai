'use client';

import React from 'react';
import AsyncHotelOffers from '@/components/AsyncHotelOffers';

export default function TestItineraryPage() {
  // Sample data for testing
  const sampleData = {
    destination: 'Shanghai',
    startDate: '2025-09-01',
    endDate: '2025-09-05',
    travelGroup: '2 adults'
  };

  console.log('Test page sample data:', sampleData);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Hotel Component Test</h1>
        
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Test Data:</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm mb-6">
            {JSON.stringify(sampleData, null, 2)}
          </pre>
          
          <AsyncHotelOffers 
            destination={sampleData.destination}
            startDate={sampleData.startDate}
            endDate={sampleData.endDate}
            travelGroup={sampleData.travelGroup}
          />
        </div>
      </div>
    </div>
  );
}
