'use client';

import React, { Suspense, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import PlanForm from './PlanForm';
import ForYouSection from './ForYouSection';
import { PlanProvider } from './PlanContext';

// Loading component for Suspense fallback
function PlanLoading() {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <div className="w-full lg:w-1/2 border-r-0 lg:border-r border-gray-200 overflow-y-auto p-8 bg-white">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded mb-4 w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
          <div className="h-4 bg-gray-200 rounded mb-8 w-2/3"></div>
          <div className="h-14 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="h-14 bg-gray-200 rounded"></div>
            <div className="h-14 bg-gray-200 rounded"></div>
          </div>
          <div className="h-14 bg-gray-200 rounded mb-6"></div>
          <div className="h-14 bg-gray-200 rounded mb-6"></div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 overflow-y-auto p-8 bg-gray-50">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded mb-4 w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PlanPage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Only redirect once Clerk has loaded the user state
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

  // Show loading state while checking authentication
  if (!isLoaded) {
    return <PlanLoading />;
  }

  // Don't render the page if user is not signed in (will redirect)
  if (!isSignedIn) {
    return <PlanLoading />;
  }

  return (
    <PlanProvider>
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
        {/* Left side - Plan Form */}
        <div className="w-full lg:w-1/2 border-r-0 lg:border-r border-gray-200 overflow-y-auto bg-white">
          <Suspense fallback={<PlanLoading />}>
            <PlanForm />
          </Suspense>
        </div>

        {/* Right side - For You Section */}
        <div className="w-full lg:w-1/2 overflow-y-auto bg-gray-50">
          <Suspense fallback={<PlanLoading />}>
            <ForYouSection />
          </Suspense>
        </div>
      </div>
    </PlanProvider>
  );
} 