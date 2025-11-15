'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ExternalLinkIcon, MessageCircle } from 'lucide-react';
import { getViatorLink } from '@/lib/viator-links';
import { useUser } from '@clerk/nextjs';

interface AttractionCardProps {
  activity: string;
  description: string;
  image: string;
  time: string;
  destination: string;
  emoji: string;
  className?: string;
  location?: { lat: number; lng: number };
  onReviewClick?: () => void;
}

export default function AttractionCard({
  activity,
  description,
  image,
  time,
  destination,
  emoji,
  className = '',
  location,
  onReviewClick
}: AttractionCardProps) {
  const [viatorLink, setViatorLink] = useState<string>(getViatorLink(destination, activity));
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string>(image);
  const [showCopyMessage, setShowCopyMessage] = useState(false);
  const { isSignedIn } = useUser();

  // Check if this attraction is already saved
  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('savedFavorites') || '[]');
    const isAlreadySaved = savedFavorites.some((item: any) => 
      item.attractionData.activity === activity && item.attractionData.destination === destination
    );
    setIsSaved(isAlreadySaved);
  }, [activity, destination]);

  // Resolve precise Viator URL with country matching
  useEffect(() => {
    let isCancelled = false;
    (async () => {
      try {
        const countryGuess = destination.split(',').pop()?.trim();
        const params = new URLSearchParams({
          attraction: activity,
          destination,
        });
        if (countryGuess) params.set('country', countryGuess);
        const res = await fetch(`/api/viator/resolve?${params.toString()}`, { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (!isCancelled && data?.url) setViatorLink(data.url);
      } catch {}
    })();
    return () => { isCancelled = true; };
  }, [activity, destination]);

  // Fetch real place photo (Foursquare first)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/place-photos?name=${encodeURIComponent(activity)}&destination=${encodeURIComponent(destination)}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (!cancelled && data?.photos?.length > 0) {
            setPhotoUrl(data.photos[0]);
            return;
          }
        }
        // fallback to existing image API for better coverage
        const parts = destination.split(',').map(p => p.trim());
        const city = parts[0] || '';
        const img = await fetch(`/api/image?name=${encodeURIComponent(activity)}&city=${encodeURIComponent(city)}&type=place`);
        if (img.ok) {
          const d = await img.json();
          if (!cancelled && d?.url) setPhotoUrl(d.url);
        }
      } catch {}
    })();
    return () => { cancelled = true; };
  }, [activity, destination]);

  const handleAttractionClick = () => {
    // Open Viator link in new tab
    window.open(viatorLink, '_blank', 'noopener,noreferrer');
  };

  const handleHeartClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the attraction click
    
    setIsLoading(true);
    
    try {
      const savedFavorites = JSON.parse(localStorage.getItem('savedFavorites') || '[]');
      const attractionData = {
        id: `${destination}-${activity}-${Date.now()}`,
        activity,
        description,
        image,
        destination,
        type: 'attraction',
        time,
        emoji
      };
      
      const existingIndex = savedFavorites.findIndex((item: any) => 
        item.attractionData.activity === activity && item.attractionData.destination === destination
      );
      
      if (existingIndex >= 0) {
        // Remove from collections
        if (isSignedIn) {
          try {
            await fetch(`/api/user/collections?attractionId=${encodeURIComponent(savedFavorites[existingIndex].attractionId)}`, {
              method: 'DELETE'
            });
          } catch {}
        }
        savedFavorites.splice(existingIndex, 1);
        localStorage.setItem('savedFavorites', JSON.stringify(savedFavorites));
        setIsSaved(false);
        window.dispatchEvent(new Event('favoritesUpdated')); // Dispatch custom event
      } else {
        // Add to collections
        const item = {
          attractionId: attractionData.id,
          attractionData,
          savedAt: new Date().toISOString()
        };
        if (isSignedIn) {
          try {
            await fetch('/api/user/collections', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ attractionId: attractionData.id, attractionData: {
                id: attractionData.id,
                name: attractionData.activity,
                type: attractionData.type,
                location: attractionData.destination,
                description: attractionData.description,
                image: attractionData.image
              } })
            });
          } catch {}
        }
        savedFavorites.push(item);
        localStorage.setItem('savedFavorites', JSON.stringify(savedFavorites));
        setIsSaved(true);
        window.dispatchEvent(new Event('favoritesUpdated')); // Dispatch custom event
      }
    } catch (error) {
      console.error('Error saving attraction:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReviewClick = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the attraction click
    onReviewClick?.();
  }, [onReviewClick]);

  const handleCopyClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the attraction click
    navigator.clipboard.writeText(activity).then(() => {
      setShowCopyMessage(true);
      setTimeout(() => setShowCopyMessage(false), 2000); // Hide after 2 seconds
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  return (
    <div 
      className={`bg-white shadow rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02] ${className}`}
      title={`Click to explore ${activity} on Viator`}
    >
      <div className="relative h-48 group">
        <Image
          src={photoUrl}
          alt={activity}
          fill
          className="object-cover"
        />
        
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
      </div>
      <div className="p-6" onClick={handleAttractionClick}>
        <div className="flex justify-between items-center mb-2">
          <h5 className="text-lg font-semibold flex items-center">
            <span className="mr-2">{emoji}</span>
            {activity}
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
          <span className="text-gray-600">{time}</span>
        </div>
        <p className="text-gray-600 mb-3">{description}</p>
      </div>
    </div>
  );
}




