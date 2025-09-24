import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    // Sample attractions data
    const sampleAttractions = [
      {
        id: 'demo-eiffel',
        name: 'Eiffel Tower',
        type: 'ATTRACTION',
        location: 'Paris, France',
        description: 'Iconic iron lattice tower on the Champ de Mars in Paris, France.',
        image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800',
        rating: 4.7,
        priceRange: '€26-€45',
        category: 'Landmark'
      },
      {
        id: 'demo-louvre',
        name: 'Louvre Museum',
        type: 'ATTRACTION',
        location: 'Paris, France',
        description: 'World\'s largest art museum and a historic monument in Paris.',
        image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800',
        rating: 4.8,
        priceRange: '€17',
        category: 'Museum'
      },
      {
        id: 'demo-ritz',
        name: 'The Ritz Paris',
        type: 'HOTEL',
        location: 'Paris, France',
        description: 'Luxury hotel in the heart of Paris, known for its elegance and history.',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
        rating: 4.9,
        priceRange: '€800-€2000',
        category: 'Luxury'
      }
    ];

    // Create attractions
    for (const attractionData of sampleAttractions) {
      await prisma.attraction.upsert({
        where: { id: attractionData.id },
        update: attractionData,
        create: attractionData
      });
    }

    return NextResponse.json({ 
      message: 'Sample attractions seeded successfully',
      count: sampleAttractions.length
    });
  } catch (error) {
    console.error('[SEED_COLLECTIONS]', error);
    return NextResponse.json({ error: 'Failed to seed attractions' }, { status: 500 });
  }
}











