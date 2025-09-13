'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ItineraryError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Itinerary error:', error);
  }, [error]);

  return (
    <div className="min-h-screen">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-6">
        <div className="text-center max-w-md">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Oops! Something went wrong
          </h2>
                      <p className="text-gray-600 mb-6">
              We couldn&apos;t load your itinerary. This might be due to a temporary issue or the itinerary may no longer be available.
            </p>
          <div className="space-y-4">
            <button
              onClick={() => reset()}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Try Again
            </button>
            <Link
              href="/plan"
              className="block w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Plan New Trip
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
