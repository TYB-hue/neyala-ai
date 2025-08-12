import { currentUser } from "@clerk/nextjs";
import { getUserHotels } from "@/lib/api";
import { redirect } from "next/navigation";
import HotelsContent from "../components/HotelsContent";

export default async function HotelsPage() {
  const user = await currentUser();
  
  if (!user) {
    redirect("/sign-in");
  }

  const hotels = await getUserHotels(user.id);

  return <HotelsContent hotels={hotels} />;
} 