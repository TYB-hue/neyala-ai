import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get user's saved attractions/collections
    const collections = await prisma.savedAttraction.findMany({
      where: { userId },
      include: {
        attraction: {
          select: {
            id: true,
            name: true,
            type: true,
            location: true,
            description: true,
            image: true,
            rating: true,
            priceRange: true,
            category: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(collections);
  } catch (error) {
    console.error("[USER_COLLECTIONS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { attractionId, attractionData } = body;

    // Check if already saved
    const existing = await prisma.savedAttraction.findFirst({
      where: { userId, attractionId }
    });

    if (existing) {
      return NextResponse.json({ message: "Already in collections" }, { status: 400 });
    }

    // First, create or find the attraction
    let attraction = await prisma.attraction.findUnique({
      where: { id: attractionId }
    });

    if (!attraction) {
      // Create the attraction if it doesn't exist
      attraction = await prisma.attraction.create({
        data: {
          id: attractionId,
          name: attractionData.name,
          type: attractionData.type,
          location: attractionData.location,
          description: attractionData.description,
          image: attractionData.image,
          rating: attractionData.rating,
          priceRange: attractionData.priceRange,
          category: attractionData.category
        }
      });
    }

    // Now save to collections
    const saved = await prisma.savedAttraction.create({
      data: {
        userId,
        attractionId: attraction.id
      },
      include: {
        attraction: true
      }
    });

    return NextResponse.json(saved);
  } catch (error) {
    console.error("[USER_COLLECTIONS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const attractionId = searchParams.get('attractionId');

    if (!attractionId) {
      return new NextResponse("Attraction ID required", { status: 400 });
    }

    // Remove from collections
    await prisma.savedAttraction.deleteMany({
      where: { userId, attractionId }
    });

    return NextResponse.json({ message: "Removed from collections" });
  } catch (error) {
    console.error("[USER_COLLECTIONS_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
