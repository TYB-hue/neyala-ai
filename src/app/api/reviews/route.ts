import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

// Generate placeId from place name and address using SHA256
function generatePlaceId(placeName: string, address?: string): string {
  const input = `${placeName}${address ? `|${address}` : ''}`;
  return crypto.createHash('sha256').update(input).digest('hex');
}

// POST /api/reviews - Add a new review
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { placeName, placeType, rating, comment, address } = body;

    // Validate required fields
    if (!placeName || !placeType || !rating) {
      return NextResponse.json(
        { error: 'Missing required fields: placeName, placeType, rating' },
        { status: 400 }
      );
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Generate placeId
    const placeId = generatePlaceId(placeName, address);

    // Ensure user exists in database (create if not exists)
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email: `${userId}@clerk.dev`, // Placeholder email
        firstName: null,
        lastName: null
      }
    });

    // Check if user already reviewed this place
    const existingReview = await prisma.review.findFirst({
      where: {
        userId,
        placeId
      }
    });

    if (existingReview) {
      // Update existing review
      const updatedReview = await prisma.review.update({
        where: { id: existingReview.id },
        data: {
          rating,
          comment: comment || null,
          updatedAt: new Date()
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          }
        }
      });

      return NextResponse.json({
        message: 'Review updated successfully',
        review: updatedReview
      });
    } else {
      // Create new review
      const newReview = await prisma.review.create({
        data: {
          userId,
          placeId,
          placeName,
          placeType,
          rating,
          comment: comment || null
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          }
        }
      });

      return NextResponse.json({
        message: 'Review created successfully',
        review: newReview
      });
    }
  } catch (error) {
    console.error('Error creating/updating review:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/reviews?placeId=xyz OR ?userId=xyz - Fetch reviews for a place or user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const placeId = searchParams.get('placeId');
    const userId = searchParams.get('userId'); // Optional: get user's specific review

    // Either placeId or userId must be provided
    if (!placeId && !userId) {
      return NextResponse.json(
        { error: 'Either placeId or userId parameter is required' },
        { status: 400 }
      );
    }

    // Build query
    const whereClause: any = {};
    if (placeId) {
      whereClause.placeId = placeId;
    }
    if (userId) {
      whereClause.userId = userId;
    }

    const reviews = await prisma.review.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    }).catch((error) => {
      console.error('Database error:', error);
      return [];
    });

    // Calculate average rating
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0;

    return NextResponse.json({
      reviews,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      totalReviews: reviews.length
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
