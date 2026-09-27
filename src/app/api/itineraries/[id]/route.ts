import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  try {
    const itinerary = await prisma.itinerary.findFirst({ where: { id: params.id, userId } });
    if (!itinerary) return NextResponse.json({ success: false, error: 'Itinerary not found' }, { status: 404 });
    return NextResponse.json(JSON.parse(itinerary.itineraryData));
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch itinerary' }, { status: 500 });
  }
}
