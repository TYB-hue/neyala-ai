'use client';

import { format } from "date-fns";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface ItineraryPreview {
  destination: string;
  startDate: string | null;
  endDate: string | null;
  headerImage: string | null;
  estimatedCost: number | null;
  daysCount: number;
}

interface SavedItinerary {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  preview: ItineraryPreview;
}

interface HistoryContentProps {
  itineraries: SavedItinerary[];
}

export default function HistoryContent({ itineraries }: HistoryContentProps) {
  const router = useRouter();

  const handleItineraryClick = (itineraryId: string) => {
    router.push(`/itinerary/${itineraryId}`);
  };

  if (itineraries.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">Travel History</h1>
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="mb-4">
              <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No saved itineraries yet</h2>
            <p className="text-gray-600 mb-6">Start planning your next adventure and save your itineraries here!</p>
            <button
              onClick={() => router.push('/plan')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Plan Your First Trip
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">Travel History</h1>
        
        <div className="space-y-4">
          {itineraries.map((itinerary) => (
            <div
              key={itinerary.id}
              onClick={() => handleItineraryClick(itinerary.id)}
              className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-all duration-200 active:bg-gray-50"
            >
              <div className="md:flex">
                {/* Image */}
                <div className="md:flex-shrink-0">
                  {itinerary.preview.headerImage ? (
                    <div className="relative h-48 w-full md:w-48">
                      <Image
                        src={itinerary.preview.headerImage}
                        alt={itinerary.preview.destination}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          // Fallback to placeholder if image fails
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="h-48 w-full md:w-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                      <svg className="w-16 h-16 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-900 mb-1">
                        {itinerary.preview.destination}
                      </h2>
                      <p className="text-sm text-gray-500 mb-2">
                        {itinerary.title}
                      </p>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        Saved
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {/* Dates */}
                    {itinerary.preview.startDate && itinerary.preview.endDate && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Dates</p>
                        <p className="text-sm font-medium text-gray-900">
                          {format(new Date(itinerary.preview.startDate), "MMM d")} - {format(new Date(itinerary.preview.endDate), "MMM d, yyyy")}
                        </p>
                      </div>
                    )}

                    {/* Duration */}
                    {itinerary.preview.daysCount > 0 && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Duration</p>
                        <p className="text-sm font-medium text-gray-900">
                          {itinerary.preview.daysCount} {itinerary.preview.daysCount === 1 ? 'day' : 'days'}
                        </p>
                      </div>
                    )}

                    {/* Estimated Cost */}
                    {itinerary.preview.estimatedCost && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Estimated Cost</p>
                        <p className="text-sm font-medium text-gray-900">
                          ${itinerary.preview.estimatedCost.toLocaleString()}
                        </p>
                      </div>
                    )}

                    {/* Created Date */}
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Saved</p>
                      <p className="text-sm font-medium text-gray-900">
                        {format(new Date(itinerary.createdAt), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center text-blue-600 text-sm font-medium">
                    <span>View Details</span>
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
