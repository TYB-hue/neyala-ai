import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: You must be signed in to view your itinerary history" },
        { status: 401 }
      );
    }

    // Fetch all itineraries for this user, sorted by newest first
    const itineraries = await prisma.itinerary.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
        itineraryData: true, // We'll parse this to get preview info
      },
    });

    // Parse itinerary data to extract preview information
    const itinerariesWithPreview = itineraries.map((itinerary) => {
      try {
        const data = JSON.parse(itinerary.itineraryData);
        return {
          id: itinerary.id,
          title: itinerary.title,
          createdAt: itinerary.createdAt,
          updatedAt: itinerary.updatedAt,
          preview: {
            destination: data.destination || 'Unknown Destination',
            startDate: data.dates?.start || null,
            endDate: data.dates?.end || null,
            headerImage: data.headerImage || null,
            estimatedCost: data.estimatedCost?.total || null,
            daysCount: data.itineraries?.length || 0,
          },
        };
      } catch (error) {
        console.error(`Error parsing itinerary ${itinerary.id}:`, error);
        return {
          id: itinerary.id,
          title: itinerary.title,
          createdAt: itinerary.createdAt,
          updatedAt: itinerary.updatedAt,
          preview: {
            destination: 'Unknown Destination',
            startDate: null,
            endDate: null,
            headerImage: null,
            estimatedCost: null,
            daysCount: 0,
          },
        };
      }
    });

    return NextResponse.json({
      success: true,
      itineraries: itinerariesWithPreview,
    });
  } catch (error) {
    console.error("[ITINERARY_HISTORY]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch itinerary history" },
      { status: 500 }
    );
  }
}

