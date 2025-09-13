'use client';

import React, { useState, useEffect } from 'react';
import { ExternalLinkIcon, MessageCircle } from 'lucide-react';
import { getViatorLink } from '@/lib/viator-links';

interface RestaurantCardProps {
  name: string;
  cuisine: string;
  description: string;
  destination: string;
  className?: string;
  location?: { lat: number; lng: number };
  onReviewClick?: () => void;
}

export default function RestaurantCard({
  name,
  cuisine,
  description,
  destination,
  className = '',
  location,
  onReviewClick
}: RestaurantCardProps) {
  const viatorLink = getViatorLink(destination, name);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if this restaurant is already saved
  useEffect(() => {
    const savedAttractions = JSON.parse(localStorage.getItem('savedAttractions') || '[]');
    const isAlreadySaved = savedAttractions.some((item: any) => 
      item.attractionData.name === name && item.attractionData.destination === destination
    );
    setIsSaved(isAlreadySaved);
  }, [name, destination]);

  const handleRestaurantClick = () => {
    // Open Viator link in new tab
    window.open(viatorLink, '_blank', 'noopener,noreferrer');
  };

  const handleHeartClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the restaurant click
    
    setIsLoading(true);
    
    try {
      const savedAttractions = JSON.parse(localStorage.getItem('savedAttractions') || '[]');
      const restaurantData = {
        id: `${destination}-${name}-${Date.now()}`,
        name,
        cuisine,
        description,
        destination,
        type: 'restaurant',
        emoji: '🍽️'
      };
      
      const existingIndex = savedAttractions.findIndex((item: any) => 
        item.attractionData.name === name && item.attractionData.destination === destination
      );
      
      if (existingIndex >= 0) {
        // Remove from collections
        savedAttractions.splice(existingIndex, 1);
        localStorage.setItem('savedAttractions', JSON.stringify(savedAttractions));
        setIsSaved(false);
      } else {
        // Add to collections
        savedAttractions.push({
          attractionId: restaurantData.id,
          attractionData: restaurantData,
          savedAt: new Date().toISOString()
        });
        localStorage.setItem('savedAttractions', JSON.stringify(savedAttractions));
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Error saving restaurant:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReviewClick = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the restaurant click
    onReviewClick?.();
  }, [onReviewClick]);

  return (
    <div 
      className={`bg-white shadow rounded-lg p-6 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02] relative ${className}`}
      onClick={handleRestaurantClick}
      title={`Click to explore ${name} on Viator`}
    >
      {/* Action Buttons */}
      <div className="absolute top-3 right-3 flex flex-col gap-2">
        {/* Heart Button */}
        <button
          onClick={handleHeartClick}
          disabled={isLoading}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
            isSaved
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          title={isSaved ? 'Remove from collections' : 'Add to collections'}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="w-4 h-4" 
            fill={isSaved ? 'currentColor' : 'none'} 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </button>
        
        {/* Review Button */}
        <button
          onClick={handleReviewClick}
          className="w-8 h-8 rounded-full bg-white text-gray-600 hover:bg-gray-100 border border-gray-300 flex items-center justify-center transition-all duration-200 cursor-pointer"
          title="View and add reviews"
        >
          <MessageCircle className="w-4 h-4" />
        </button>
      </div>

      <h5 className="text-lg font-semibold mb-3 flex items-center">
        <span className="mr-2">🍽️</span>
        Restaurant
      </h5>
      <div className="space-y-3">
        <div>
          <p className="font-medium text-gray-900">{name}</p>
          <p className="text-sm text-gray-600">{cuisine} - {description}</p>
        </div>
        <div className="flex items-center text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
          <ExternalLinkIcon className="w-4 h-4 mr-1" />
          Explore on Viator
        </div>
      </div>
    </div>
  );
}
