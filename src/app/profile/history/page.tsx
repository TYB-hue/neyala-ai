import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import HistoryContent from "../components/HistoryContent";

export default async function HistoryPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  // Fetch saved itineraries directly from database
  interface ItineraryPreview {
    destination: string;
    startDate: string | null;
    endDate: string | null;
    headerImage: string | null;
    estimatedCost: number | null;
    daysCount: number;
  }

  interface SavedItinerary {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    preview: ItineraryPreview;
  }

  let itineraries: SavedItinerary[] = [];
  try {
    const savedItineraries = await prisma.itinerary.findMany({
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
        itineraryData: true,
      },
    });

    // Parse itinerary data to extract preview information
    itineraries = savedItineraries.map((itinerary) => {
      try {
        const data = JSON.parse(itinerary.itineraryData);
        return {
          id: itinerary.id,
          title: itinerary.title,
          createdAt: itinerary.createdAt.toISOString(),
          updatedAt: itinerary.updatedAt.toISOString(),
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
          createdAt: itinerary.createdAt.toISOString(),
          updatedAt: itinerary.updatedAt.toISOString(),
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
  } catch (error) {
    console.error('Error fetching itinerary history:', error);
  }

  return <HistoryContent itineraries={itineraries} />;
} 