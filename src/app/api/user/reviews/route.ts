import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const reviews = await prisma.review.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("[USER_REVIEWS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}







