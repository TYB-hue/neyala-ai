import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Travel Planner — Free Personalized Trip Itineraries | Nyala',
  description: 'Plan your trip with AI — Free AI travel planner that creates personalized travel itineraries in seconds. Generate custom AI travel itineraries with real attractions, hotels, and activities. Best free AI travel planner for effortless trip planning.',
  keywords: 'ai travel planner, travel planner ai, ai travel itinerary, ai travel assistant, ai travel app, free ai travel planner, ai trip planner, travel planning app',
  openGraph: {
    title: 'AI Travel Planner — Free Personalized Trip Itineraries | Nyala',
    description: 'Plan your trip with AI — Free AI travel planner that creates personalized travel itineraries. Generate custom AI travel itineraries with real attractions and hotels.',
    url: '/plan',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Travel Planner — Free Personalized Trip Itineraries | Nyala',
    description: 'Plan your trip with AI — Free AI travel planner that creates personalized travel itineraries.',
  },
  alternates: {
    canonical: '/plan',
  },
};

export default function PlanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

