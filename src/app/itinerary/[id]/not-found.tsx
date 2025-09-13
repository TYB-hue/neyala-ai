import Link from 'next/link';

export default function ItineraryNotFound() {
  return (
    <div className="min-h-screen">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-6">
        <div className="text-center max-w-md">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Itinerary Not Found
          </h2>
                      <p className="text-gray-600 mb-6">
              The itinerary you&apos;re looking for doesn&apos;t exist or may have been removed. Itineraries are temporary and may expire after a certain period.
            </p>
          <div className="space-y-4">
            <Link
              href="/plan"
              className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Create New Itinerary
            </Link>
            <Link
              href="/"
              className="block w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
