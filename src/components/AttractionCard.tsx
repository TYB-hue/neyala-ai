'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ExternalLinkIcon, MessageCircle } from 'lucide-react';
import { getViatorLink } from '@/lib/viator-links';

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
  onReviewClick
}: AttractionCardProps) {
  const [viatorLink, setViatorLink] = useState<string>(getViatorLink(destination, activity));
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string>(image);

  useEffect(() => {
    const savedAttractions = JSON.parse(localStorage.getItem('savedAttractions') || '[]');
    const isAlreadySaved = savedAttractions.some((item: any) => 
      item.attractionData.activity === activity && item.attractionData.destination === destination
    );
    setIsSaved(isAlreadySaved);
  }, [activity, destination]);

  useEffect(() => {
    let isCancelled = false;
    (async () => {
      try {
        const countryGuess = destination.split(',').pop()?.trim();
        const params = new URLSearchParams({ attraction: activity, destination });
        if (countryGuess) params.set('country', countryGuess);
        const res = await fetch(`/api/viator/resolve?${params.toString()}`, { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (!isCancelled && data?.url) setViatorLink(data.url);
      } catch {}
    })();
    return () => { isCancelled = true; };
  }, [activity, destination]);

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
        const city = destination.split(',').map(p => p.trim())[0] || '';
        const img = await fetch(`/api/image?name=${encodeURIComponent(activity)}&city=${encodeURIComponent(city)}&type=place`);
        if (img.ok) {
          const d = await img.json();
          if (!cancelled && d?.url) setPhotoUrl(d.url);
        }
      } catch {}
    })();
    return () => { cancelled = true; };
  }, [activity, destination]);

  const handleOpen = () => {
    window.open(viatorLink, '_blank', 'noopener,noreferrer');
  };

  const handleHeartClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);
    try {
      const attractionId = `${destination}-${activity}`;
      const payload = {
        attractionId,
        attractionData: {
          id: attractionId,
          name: activity,
          type: 'TOUR',
          location: destination,
          description,
          image,
          rating: 0,
          priceRange: '',
          category: 'ATTRACTION'
        }
      };

      const res = await fetch('/api/user/collections', {
        method: isSaved ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: isSaved ? undefined : JSON.stringify(payload)
      });

      if (!res.ok && isSaved) {
        // DELETE requires query param; fallback for remove
        await fetch(`/api/user/collections?attractionId=${encodeURIComponent(attractionId)}`, { method: 'DELETE' });
      }

      setIsSaved(!isSaved);
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  const handleReviewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onReviewClick?.();
  };

  return (
    <div className={`bg-white shadow rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02] ${className}`} title={`Click to explore ${activity} on Viator`}>
      <div className="relative h-72 group">
        <Image src={photoUrl} alt={activity} fill className="object-cover" />
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button onClick={handleHeartClick} disabled={isLoading} className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${isSaved ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'} ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`} title={isSaved ? 'Remove from collections' : 'Add to collections'}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
          </button>
          <button onClick={handleReviewClick} className="w-8 h-8 rounded-full bg-white text-gray-600 hover:bg-gray-100 border border-gray-300 flex items-center justify-center transition-all duration-200 cursor-pointer" title="View and add reviews">
            <MessageCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="p-6" onClick={handleOpen}>
        <div className="flex justify-between items-center mb-2">
          <h5 className="text-lg font-semibold flex items-center"><span className="mr-2">{emoji}</span>{activity}</h5>
          <span className="text-gray-600">{time}</span>
        </div>
        <p className="text-gray-600 mb-3">{description}</p>
        <div className="flex items-center text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
          <ExternalLinkIcon className="w-4 h-4 mr-1" />
          Explore on Viator
        </div>
      </div>
    </div>
  );
}
