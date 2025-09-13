'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function GenerateSampleDataPage() {
  const router = useRouter();

  const generateSampleData = () => {
    const sampleItinerary = {
      destination: 'Shanghai',
      dates: {
        start: '2025-09-01',
        end: '2025-09-05'
      },
      headerImage: 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=1200&h=600&fit=crop&q=80',
      overview: {
        history: 'Shanghai is a modern metropolis with a rich history dating back to the 13th century.',
        culture: 'A blend of traditional Chinese culture and modern international influences.'
      },
      airport: {
        name: 'Shanghai Pudong International Airport',
        image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
        info: 'Major international airport serving Shanghai'
      },
      hotels: [],
      activities: [
        {
          name: 'The Bund',
          description: 'Famous waterfront area with colonial architecture',
          image: 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=800&h=600&fit=crop&q=80',
          day: 1,
          time: 'Morning',
          location: { lat: 31.2337, lng: 121.4903 }
        }
      ],
      transportation: [
        {
          type: 'Metro',
          description: 'Efficient subway system covering the city',
          icon: '/icons/metro.svg'
        }
      ],
      estimatedCost: {
        accommodation: 800,
        activities: 300,
        transportation: 100,
        food: 400,
        total: 1600
      }
    };

    // Generate a temporary ID
    const tempId = `temp_${Date.now()}`;
    
    // Store in localStorage
    localStorage.setItem(`itinerary_${tempId}`, JSON.stringify(sampleItinerary));
    
    console.log('Generated sample data with ID:', tempId);
    console.log('Sample data:', sampleItinerary);
    
    // Redirect to the itinerary page
    router.push(`/itinerary/${tempId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Generate Sample Data</h1>
        
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Generate Sample Itinerary</h2>
          <p className="text-gray-600 mb-6">
            This will create a sample itinerary for Shanghai and store it in localStorage.
            You can then test the hotel component with real data.
          </p>
          
          <button 
            onClick={generateSampleData}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Generate Sample Data & Go to Itinerary
          </button>
        </div>
      </div>
    </div>
  );
}
