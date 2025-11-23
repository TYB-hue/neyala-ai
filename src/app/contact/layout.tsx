import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us — AI Travel Planner Support | Nyala',
  description: 'Contact Nyala AI travel planner support team. Get help with your travel planning, ask questions about our AI travel assistant, or provide feedback on our travel planning app.',
  keywords: 'contact ai travel planner, travel planning support, ai travel assistant help',
  openGraph: {
    title: 'Contact Us — AI Travel Planner Support | Nyala',
    description: 'Contact Nyala AI travel planner support team. Get help with your travel planning.',
    url: '/contact',
  },
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

