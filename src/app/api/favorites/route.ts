import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    console.log("[FAVORITES_GET] Starting get favorites request...");
    
    // Get userId from Clerk
    const { userId } = await auth();
    console.log("[FAVORITES_GET] UserId:", userId);
    
    if (!userId) {
      console.error("[FAVORITES_GET] No userId found - user not authenticated");
      return NextResponse.json(
        { success: false, error: "Unauthorized: You must be signed in to view favorites" },
        { status: 401 }
      );
    }

    // Get userId from query params (for validation, but we use session userId)
    const { searchParams } = new URL(req.url);
    const queryUserId = searchParams.get('userId');

    // Security: Ensure query userId matches session userId
    if (queryUserId && queryUserId !== userId) {
      console.error("[FAVORITES_GET] UserId mismatch:", { queryUserId, sessionUserId: userId });
      return NextResponse.json(
        { success: false, error: "Unauthorized: You can only view your own favorites" },
        { status: 403 }
      );
    }

    console.log("[FAVORITES_GET] Fetching favorites for user:", userId);

    // Fetch all favorites for this user, sorted by newest first
    const favorites = await prisma.favorite.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log("[FAVORITES_GET] Found", favorites.length, "favorites");

    // Parse meta JSON for each favorite
    const favoritesWithParsedMeta = favorites.map((favorite) => ({
      id: favorite.id,
      itemId: favorite.itemId,
      name: favorite.name,
      location: favorite.location,
      description: favorite.description,
      imageUrl: favorite.imageUrl, // Exact URL saved at like time
      meta: favorite.meta ? JSON.parse(favorite.meta) : null,
      createdAt: favorite.createdAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      favorites: favoritesWithParsedMeta,
    });
  } catch (error: any) {
    console.error("[FAVORITES_GET] Error:", {
      message: error?.message || 'Unknown error',
      stack: error?.stack,
    });
    
    return NextResponse.json(
      { success: false, error: "Failed to fetch favorites" },
      { status: 500 }
    );
  }
}

