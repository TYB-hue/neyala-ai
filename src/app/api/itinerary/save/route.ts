import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    console.log("[ITINERARY_SAVE] Starting save request...");
    
    // Get userId from Clerk
    const { userId } = await auth();
    console.log("[ITINERARY_SAVE] UserId:", userId);
    
    if (!userId) {
      console.error("[ITINERARY_SAVE] No userId found - user not authenticated");
      return NextResponse.json(
        { success: false, error: "Unauthorized: You must be signed in to save an itinerary" },
        { status: 401 }
      );
    }

    // Parse request body
    let body;
    try {
      body = await req.json();
      console.log("[ITINERARY_SAVE] Request body received, keys:", Object.keys(body));
    } catch (parseError) {
      console.error("[ITINERARY_SAVE] Error parsing request body:", parseError);
      return NextResponse.json(
        { success: false, error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { itineraryData, title } = body;

    if (!itineraryData) {
      console.error("[ITINERARY_SAVE] Missing itineraryData in request body");
      return NextResponse.json(
        { success: false, error: "Missing itinerary data" },
        { status: 400 }
      );
    }

    // Generate a title if not provided
    const itineraryTitle = title || 
      `${itineraryData.destination || 'Trip'} - ${itineraryData.dates?.start || new Date().toLocaleDateString()}`;

    console.log("[ITINERARY_SAVE] Saving itinerary with title:", itineraryTitle);
    console.log("[ITINERARY_SAVE] Itinerary data keys:", Object.keys(itineraryData));

    // Stringify itinerary data
    let itineraryDataString;
    try {
      itineraryDataString = JSON.stringify(itineraryData);
      console.log("[ITINERARY_SAVE] Itinerary data stringified, length:", itineraryDataString.length);
    } catch (stringifyError) {
      console.error("[ITINERARY_SAVE] Error stringifying itinerary data:", stringifyError);
      return NextResponse.json(
        { success: false, error: "Failed to serialize itinerary data" },
        { status: 400 }
      );
    }

    // Check if user exists in database (required for foreign key)
    try {
      const userExists = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true },
      });

      if (!userExists) {
        console.error("[ITINERARY_SAVE] User not found in database:", userId);
        // Create user if it doesn't exist (Clerk user but not in our DB)
        await prisma.user.create({
          data: {
            id: userId,
            email: `user-${userId}@temp.com`, // Temporary email, should be updated
          },
        });
        console.log("[ITINERARY_SAVE] Created user in database:", userId);
      }
    } catch (userError) {
      console.error("[ITINERARY_SAVE] Error checking/creating user:", userError);
      // Continue anyway - might be a race condition
    }

    // Save the entire itinerary as JSON
    let savedItinerary;
    try {
      savedItinerary = await prisma.itinerary.create({
        data: {
          userId,
          title: itineraryTitle,
          itineraryData: itineraryDataString,
        },
      });
      console.log("[ITINERARY_SAVE] Successfully saved itinerary:", savedItinerary.id);
    } catch (dbError: any) {
      console.error("[ITINERARY_SAVE] Database error details:", {
        message: dbError.message,
        code: dbError.code,
        meta: dbError.meta,
        stack: dbError.stack,
      });
      
      // Provide more specific error messages
      if (dbError.code === 'P2002') {
        return NextResponse.json(
          { success: false, error: "Itinerary with this ID already exists" },
          { status: 409 }
        );
      }
      if (dbError.code === 'P2003') {
        return NextResponse.json(
          { success: false, error: "User not found in database" },
          { status: 400 }
        );
      }
      
      throw dbError; // Re-throw to be caught by outer catch
    }

    return NextResponse.json({
      success: true,
      itinerary: {
        id: savedItinerary.id,
        title: savedItinerary.title,
        createdAt: savedItinerary.createdAt,
      },
    });
  } catch (error: any) {
    console.error("[ITINERARY_SAVE] SAVE ERROR:", {
      message: error?.message || 'Unknown error',
      name: error?.name,
      stack: error?.stack,
      code: error?.code,
      meta: error?.meta,
    });
    
    return NextResponse.json(
      { 
        success: false, 
        error: error?.message || "Failed to save itinerary",
        details: process.env.NODE_ENV === 'development' ? error?.stack : undefined
      },
      { status: 500 }
    );
  }
}

