'use client';

import React, { useState, useEffect } from 'react';
import { ExternalLinkIcon, MessageCircle } from 'lucide-react';
import { getViatorLink } from '@/lib/viator-links';
import { useUser } from '@clerk/nextjs';

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
  const [showCopyMessage, setShowCopyMessage] = useState(false);
  const { isSignedIn } = useUser();

  // Check if this restaurant is already saved
  useEffect(() => {
    const checkIfSaved = async () => {
      const itemId = `${destination}-${name}`.toLowerCase().replace(/[^a-z0-9-]/g, '-');
      
      // Check API first if signed in
      if (isSignedIn) {
        try {
          const response = await fetch('/api/favorites');
          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              const existing = data.favorites.find((f: any) => 
                f.itemId === itemId || 
                (f.name === name && f.location === destination)
              );
              if (existing) {
                setIsSaved(true);
                return;
              }
            }
          }
        } catch (apiError) {
          console.log('Error checking favorites from API:', apiError);
        }
      }
      
      // Fallback to localStorage
      const savedFavorites = JSON.parse(localStorage.getItem('savedFavorites') || '[]');
      const isAlreadySaved = savedFavorites.some((item: any) => 
        item.attractionData.name === name && item.attractionData.destination === destination
      );
      setIsSaved(isAlreadySaved);
    };
    
    checkIfSaved();
  }, [name, destination, isSignedIn]);

  const handleRestaurantClick = () => {
    // Open Viator link in new tab
    window.open(viatorLink, '_blank', 'noopener,noreferrer');
  };

  const handleHeartClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the restaurant click
    
    setIsLoading(true);
    
    try {
      // Generate a unique itemId for this restaurant
      const itemId = `${destination}-${name}`.toLowerCase().replace(/[^a-z0-9-]/g, '-');
      
      // Check if already saved (check both API and localStorage)
      let alreadySaved = false;
      let existingFavoriteId: string | null = null;

      if (isSignedIn) {
        try {
          const checkResponse = await fetch('/api/favorites');
          if (checkResponse.ok) {
            const checkData = await checkResponse.json();
            if (checkData.success) {
              const existing = checkData.favorites.find((f: any) => 
                f.itemId === itemId || 
                (f.name === name && f.location === destination)
              );
              if (existing) {
                alreadySaved = true;
                existingFavoriteId = existing.id;
              }
            }
          }
        } catch (checkError) {
          console.log('Error checking existing favorites:', checkError);
        }
      }

      // Also check localStorage as fallback
      const savedFavorites = JSON.parse(localStorage.getItem('savedFavorites') || '[]');
      const localExisting = savedFavorites.findIndex((item: any) => 
        item.attractionData.name === name && item.attractionData.destination === destination
      );
      
      if (alreadySaved || localExisting >= 0) {
        // Remove from favorites
        if (isSignedIn && existingFavoriteId) {
          try {
            await fetch(`/api/favorites/${existingFavoriteId}`, {
              method: 'DELETE'
            });
          } catch (deleteError) {
            console.error('Error deleting favorite:', deleteError);
          }
        }
        
        // Remove from localStorage
        if (localExisting >= 0) {
          savedFavorites.splice(localExisting, 1);
          localStorage.setItem('savedFavorites', JSON.stringify(savedFavorites));
        }
        
        setIsSaved(false);
        window.dispatchEvent(new Event('favoritesUpdated'));
      } else {
        // Add to favorites - restaurants don't have images, use placeholder
        const placeholderImageUrl = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop&q=80';
        
        const payload = {
          itemId,
          name,
          location: destination,
          description: `${cuisine} - ${description}`,
          imageUrl: placeholderImageUrl, // Placeholder for restaurants without images
          meta: {
            type: 'restaurant',
            cuisine,
            source: 'itinerary',
          }
        };

        console.log('[RestaurantCard] Saving favorite:', payload.name);

        // Save to API if signed in
        if (isSignedIn) {
          try {
            const response = await fetch('/api/favorites/add', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
              throw new Error(result.error || 'Failed to save favorite');
            }

            console.log('[RestaurantCard] Successfully saved favorite to API');
          } catch (apiError) {
            console.error('[RestaurantCard] API save failed:', apiError);
            // Continue to localStorage fallback
          }
        }

        // Also save to localStorage as fallback
        const item = {
          attractionId: itemId,
          attractionData: {
            id: itemId,
            name,
            cuisine,
            description,
            image: placeholderImageUrl,
            destination,
            type: 'restaurant',
            emoji: '🍽️'
          },
          savedAt: new Date().toISOString()
        };
        savedFavorites.push(item);
        localStorage.setItem('savedFavorites', JSON.stringify(savedFavorites));
        
        setIsSaved(true);
        window.dispatchEvent(new Event('favoritesUpdated'));
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

  const handleCopyClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the restaurant click and affecting the map
    e.preventDefault(); // Prevent any default behavior
    
    const textToCopy = name; // Only copy the restaurant name
    
    // Try modern clipboard API first (works on HTTPS)
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        setShowCopyMessage(true);
        setTimeout(() => setShowCopyMessage(false), 2000);
      }).catch(() => {
        // Fallback to older method if clipboard API fails
        fallbackCopyText(textToCopy);
      });
    } else {
      // Fallback for HTTP sites (VPS)
      fallbackCopyText(textToCopy);
    }
  };

  // Fallback copy method for HTTP sites
  const fallbackCopyText = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        setShowCopyMessage(true);
        setTimeout(() => setShowCopyMessage(false), 2000);
      } else {
        console.error('Fallback copy failed');
      }
    } catch (err) {
      console.error('Fallback copy error:', err);
    } finally {
      document.body.removeChild(textArea);
    }
  };

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
        <button
          onClick={handleCopyClick}
          className="ml-2 p-1 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          title="Copy title to clipboard"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
        </button>
        {showCopyMessage && (
          <span className="ml-2 text-sm text-green-600">Copied!</span>
        )}
      </h5>
      <div className="space-y-3">
        <div>
          <p className="font-medium text-gray-900">{name}</p>
          <p className="text-sm text-gray-600">{cuisine} - {description}</p>
        </div>
      </div>
    </div>
  );
}
