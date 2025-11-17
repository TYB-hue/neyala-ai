import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: You must be signed in to view an itinerary" },
        { status: 401 }
      );
    }

    const itinerary = await prisma.itinerary.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!itinerary) {
      return NextResponse.json(
        { success: false, error: "Itinerary not found" },
        { status: 404 }
      );
    }

    // Ensure user can only access their own itineraries
    if (itinerary.userId !== userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: You can only view your own itineraries" },
        { status: 403 }
      );
    }

    // Parse the itinerary data
    let itineraryData;
    try {
      itineraryData = JSON.parse(itinerary.itineraryData);
    } catch (error) {
      console.error(`Error parsing itinerary ${itinerary.id}:`, error);
      return NextResponse.json(
        { success: false, error: "Invalid itinerary data" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      itinerary: {
        id: itinerary.id,
        title: itinerary.title,
        createdAt: itinerary.createdAt,
        updatedAt: itinerary.updatedAt,
        data: itineraryData,
      },
    });
  } catch (error) {
    console.error("[ITINERARY_GET]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch itinerary" },
      { status: 500 }
    );
  }
}

