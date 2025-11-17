import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log("[FAVORITES_DELETE] Starting delete favorite request...");
    
    // Get userId from Clerk
    const { userId } = await auth();
    console.log("[FAVORITES_DELETE] UserId:", userId, "FavoriteId:", params.id);
    
    if (!userId) {
      console.error("[FAVORITES_DELETE] No userId found - user not authenticated");
      return NextResponse.json(
        { success: false, error: "Unauthorized: You must be signed in to delete favorites" },
        { status: 401 }
      );
    }

    // Find the favorite and verify ownership
    const favorite = await prisma.favorite.findUnique({
      where: { id: params.id },
      select: { userId: true },
    });

    if (!favorite) {
      console.error("[FAVORITES_DELETE] Favorite not found:", params.id);
      return NextResponse.json(
        { success: false, error: "Favorite not found" },
        { status: 404 }
      );
    }

    // Security: Ensure user owns this favorite
    if (favorite.userId !== userId) {
      console.error("[FAVORITES_DELETE] UserId mismatch:", { favoriteUserId: favorite.userId, sessionUserId: userId });
      return NextResponse.json(
        { success: false, error: "Unauthorized: You can only delete your own favorites" },
        { status: 403 }
      );
    }

    // Delete the favorite
    await prisma.favorite.delete({
      where: { id: params.id },
    });

    console.log("[FAVORITES_DELETE] Successfully deleted favorite:", params.id);

    return NextResponse.json({
      success: true,
      message: "Favorite deleted successfully",
    });
  } catch (error: any) {
    console.error("[FAVORITES_DELETE] Error:", {
      message: error?.message || 'Unknown error',
      stack: error?.stack,
    });
    
    return NextResponse.json(
      { success: false, error: "Failed to delete favorite" },
      { status: 500 }
    );
  }
}

