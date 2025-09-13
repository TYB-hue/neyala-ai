import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { getUserTrips, saveTrip } from "@/lib/api";
import type { ActivityType } from "@/types";

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const trips = await getUserTrips(userId);
    return NextResponse.json(trips);
  } catch (error) {
    console.error("[USER_TRIPS_GET]", error);
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
    const itinerary = body?.itinerary;
    if (!itinerary) {
      return NextResponse.json({ error: "Missing itinerary" }, { status: 400 });
    }

    // Build activities from itinerary days
    const activities = Array.isArray(itinerary.itineraries)
      ? itinerary.itineraries.flatMap((day: any) => {
          const dayDate = new Date(day.date);
          const items: Array<{ name: string; type: ActivityType; date: Date; description?: string }> = [];
          if (day.morning?.activity) {
            items.push({ name: day.morning.activity, type: 'TOUR', date: dayDate, description: day.morning.description });
          }
          if (day.afternoon?.activity) {
            items.push({ name: day.afternoon.activity, type: 'TOUR', date: dayDate, description: day.afternoon.description });
          }
          if (day.restaurant?.name) {
            items.push({ name: day.restaurant.name, type: 'RESTAURANT', date: dayDate, description: day.restaurant.description });
          }
          return items;
        })
      : [];

    const result = await saveTrip(userId, {
      destination: itinerary.destination,
      startDate: new Date(itinerary.dates?.start || new Date()),
      endDate: new Date(itinerary.dates?.end || new Date()),
      budget: String(itinerary.estimatedCost?.total ?? 'N/A'),
      travelStyle: 'Unspecified',
      activities,
      requirements: []
    });

    return NextResponse.json({ success: true, trip: result });
  } catch (error) {
    console.error("[USER_TRIPS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}






