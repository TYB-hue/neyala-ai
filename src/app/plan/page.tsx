'use client';

import React from 'react';
import PlanForm from './PlanForm';
import ForYouSection from './ForYouSection';

export default function PlanPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left side - Plan Form */}
      <div className="w-1/2 border-r border-gray-200 overflow-y-auto">
        <PlanForm />
      </div>

      {/* Right side - For You Section */}
      <div className="w-1/2 overflow-y-auto">
        <ForYouSection />
      </div>
    </div>
  );
} 