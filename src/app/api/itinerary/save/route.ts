import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: You must be signed in to save an itinerary" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { itineraryData, title } = body;

    if (!itineraryData) {
      return NextResponse.json(
        { success: false, error: "Missing itinerary data" },
        { status: 400 }
      );
    }

    // Generate a title if not provided
    const itineraryTitle = title || 
      `${itineraryData.destination || 'Trip'} - ${itineraryData.dates?.start || new Date().toLocaleDateString()}`;

    // Save the entire itinerary as JSON
    const savedItinerary = await prisma.itinerary.create({
      data: {
        userId,
        title: itineraryTitle,
        itineraryData: JSON.stringify(itineraryData),
      },
    });

    return NextResponse.json({
      success: true,
      itinerary: {
        id: savedItinerary.id,
        title: savedItinerary.title,
        createdAt: savedItinerary.createdAt,
      },
    });
  } catch (error) {
    console.error("[ITINERARY_SAVE]", error);
    return NextResponse.json(
      { success: false, error: "Failed to save itinerary" },
      { status: 500 }
    );
  }
}

