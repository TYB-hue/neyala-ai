import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    console.log("[FAVORITES_ADD] Starting add favorite request...");
    
    // Get userId from Clerk
    const { userId } = await auth();
    console.log("[FAVORITES_ADD] UserId:", userId);
    
    if (!userId) {
      console.error("[FAVORITES_ADD] No userId found - user not authenticated");
      return NextResponse.json(
        { success: false, error: "Unauthorized: You must be signed in to save favorites" },
        { status: 401 }
      );
    }

    // Parse request body
    let body;
    try {
      body = await req.json();
      console.log("[FAVORITES_ADD] Request body received, keys:", Object.keys(body));
    } catch (parseError) {
      console.error("[FAVORITES_ADD] Error parsing request body:", parseError);
      return NextResponse.json(
        { success: false, error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { itemId, name, location, description, imageUrl, meta } = body;

    // Validate required fields
    if (!name || !location || !imageUrl) {
      console.error("[FAVORITES_ADD] Missing required fields:", { name: !!name, location: !!location, imageUrl: !!imageUrl });
      return NextResponse.json(
        { success: false, error: "Missing required fields: name, location, and imageUrl are required" },
        { status: 400 }
      );
    }

    // Validate imageUrl format (must be a valid URL, not a blob/data URL)
    if (imageUrl.startsWith('blob:') || imageUrl.startsWith('data:')) {
      console.error("[FAVORITES_ADD] Invalid imageUrl format (blob/data URL):", imageUrl.substring(0, 50));
      return NextResponse.json(
        { success: false, error: "Image URL must be a publicly accessible URL, not a blob or data URL" },
        { status: 400 }
      );
    }

    // Validate string lengths
    if (name.length > 200 || location.length > 200 || (description && description.length > 2000)) {
      return NextResponse.json(
        { success: false, error: "Field length exceeds maximum allowed" },
        { status: 400 }
      );
    }

    // Validate userId matches session (security check)
    // Note: body.userId is optional - we use session userId
    if (body.userId && body.userId !== userId) {
      console.error("[FAVORITES_ADD] UserId mismatch:", { bodyUserId: body.userId, sessionUserId: userId });
      return NextResponse.json(
        { success: false, error: "Unauthorized: User ID mismatch" },
        { status: 403 }
      );
    }

    // Check if user exists in database (required for foreign key)
    try {
      const userExists = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true },
      });

      if (!userExists) {
        console.log("[FAVORITES_ADD] User not found, creating user:", userId);
        await prisma.user.create({
          data: {
            id: userId,
            email: `user-${userId}@temp.com`,
          },
        });
      }
    } catch (userError) {
      console.error("[FAVORITES_ADD] Error checking/creating user:", userError);
    }

    // Check for duplicate if itemId is provided
    if (itemId) {
      const existing = await prisma.favorite.findFirst({
        where: {
          userId,
          itemId,
        },
      });

      if (existing) {
        console.log("[FAVORITES_ADD] Favorite already exists, returning existing:", existing.id);
        return NextResponse.json({
          success: true,
          favorite: {
            id: existing.id,
            itemId: existing.itemId,
            name: existing.name,
            location: existing.location,
            description: existing.description,
            imageUrl: existing.imageUrl,
            meta: existing.meta ? JSON.parse(existing.meta) : null,
            createdAt: existing.createdAt,
          },
          message: "Favorite already exists",
        });
      }
    }

    // Prepare meta data
    let metaString: string | null = null;
    if (meta) {
      try {
        metaString = JSON.stringify(meta);
      } catch (metaError) {
        console.error("[FAVORITES_ADD] Error stringifying meta:", metaError);
        metaString = JSON.stringify({});
      }
    }

    console.log("[FAVORITES_ADD] Saving favorite:", {
      userId,
      itemId,
      name,
      location,
      imageUrl: imageUrl.substring(0, 50) + '...',
    });

    // Save the favorite with exact imageUrl
    const favorite = await prisma.favorite.create({
      data: {
        userId,
        itemId: itemId || null,
        name,
        location,
        description: description || null,
        imageUrl, // Exact URL captured at like time
        meta: metaString,
      },
    });

    console.log("[FAVORITES_ADD] Successfully saved favorite:", favorite.id);

    return NextResponse.json({
      success: true,
      favorite: {
        id: favorite.id,
        itemId: favorite.itemId,
        name: favorite.name,
        location: favorite.location,
        description: favorite.description,
        imageUrl: favorite.imageUrl,
        meta: favorite.meta ? JSON.parse(favorite.meta) : null,
        createdAt: favorite.createdAt,
      },
    });
  } catch (error: any) {
    console.error("[FAVORITES_ADD] FAVORITES SAVE ERROR:", {
      message: error?.message || 'Unknown error',
      name: error?.name,
      stack: error?.stack,
      code: error?.code,
      meta: error?.meta,
    });
    
    // Handle Prisma unique constraint errors
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: "This favorite already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: error?.message || "Failed to save favorite",
        details: process.env.NODE_ENV === 'development' ? error?.stack : undefined
      },
      { status: 500 }
    );
  }
}

