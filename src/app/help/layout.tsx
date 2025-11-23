import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Help Center — AI Travel Planner Guide | Nyala',
  description: 'Get help with Nyala AI travel planner. Learn how to create travel itineraries, use our AI travel assistant, and make the most of our travel planning app features.',
  keywords: 'ai travel planner help, travel planning guide, ai travel assistant tutorial, travel planning app support',
  openGraph: {
    title: 'Help Center — AI Travel Planner Guide | Nyala',
    description: 'Get help with Nyala AI travel planner. Learn how to create travel itineraries and use our AI travel assistant.',
    url: '/help',
  },
  alternates: {
    canonical: '/help',
  },
};

export default function HelpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

