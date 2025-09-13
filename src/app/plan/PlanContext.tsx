'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PlanData {
  destination: string;
  startDate: string;
  endDate: string;
  travelGroup: string;
}

interface PlanContextType {
  planData: PlanData | null;
  setPlanData: (data: PlanData | null) => void;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export function PlanProvider({ children }: { children: ReactNode }) {
  const [planData, setPlanData] = useState<PlanData | null>(null);

  return (
    <PlanContext.Provider value={{ planData, setPlanData }}>
      {children}
    </PlanContext.Provider>
  );
}

export function usePlanContext() {
  const context = useContext(PlanContext);
  if (context === undefined) {
    throw new Error('usePlanContext must be used within a PlanProvider');
  }
  return context;
}

