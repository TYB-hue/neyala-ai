export default function ItineraryLoading() {
  return (
    <div className="min-h-screen">
      <div className="flex h-[calc(100vh-64px)]">
        {/* Left Panel - Loading Content */}
        <div className="w-1/2 h-[calc(100vh-64px)] overflow-y-auto p-6 pt-4">
          <div className="animate-pulse">
            {/* Header Image Skeleton */}
            <div className="h-64 bg-gray-200 rounded-xl mb-8"></div>
            
            {/* Overview Section Skeleton */}
            <div className="mb-8">
              <div className="h-8 bg-gray-200 rounded mb-4 w-1/3"></div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="h-6 bg-gray-200 rounded mb-2 w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded mb-4 w-full"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2 w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>

            {/* Airport Section Skeleton */}
            <div className="mb-8">
              <div className="h-8 bg-gray-200 rounded mb-4 w-1/4"></div>
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-2 w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            </div>

            {/* Hotels Section Skeleton */}
            <div className="mb-8">
              <div className="h-8 bg-gray-200 rounded mb-4 w-1/3"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-6">
                      <div className="h-6 bg-gray-200 rounded mb-2 w-2/3"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Map Loading */}
        <div className="w-1/2 h-[calc(100vh-64px)] sticky top-16">
          <div className="h-full w-full bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading map...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
