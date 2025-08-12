import { currentUser } from "@clerk/nextjs";
import { getUserTrips } from "@/lib/api";
import { redirect } from "next/navigation";
import HistoryContent from "../components/HistoryContent";

export default async function HistoryPage() {
  const user = await currentUser();
  
  if (!user) {
    redirect("/sign-in");
  }

  const trips = await getUserTrips(user.id);

  // Convert date strings to Date objects for proper serialization
  const serializedTrips = trips.map(trip => ({
    ...trip,
    startDate: new Date(trip.startDate).toISOString(),
    endDate: new Date(trip.endDate).toISOString(),
    activities: trip.activities.map(activity => ({
      ...activity,
      date: new Date(activity.date).toISOString()
    }))
  }));

  return <HistoryContent trips={serializedTrips} />;
} 