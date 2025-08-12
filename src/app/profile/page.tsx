import { currentUser } from "@clerk/nextjs";
import { getUserStats } from "@/lib/api";
import { redirect } from "next/navigation";
import ProfileContent from "./components/ProfileContent";
import type { UserProfile } from "@/types";

export default async function ProfilePage() {
  const user = await currentUser();
  
  if (!user) {
    redirect("/sign-in");
  }

  const stats = await getUserStats(user.id);

  const userProfile: UserProfile = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    imageUrl: user.imageUrl,
    emailAddress: user.emailAddresses[0]?.emailAddress ?? null,
    phoneNumber: user.phoneNumbers[0]?.phoneNumber ?? null,
    createdAt: new Date(user.createdAt),
  };

  return <ProfileContent user={userProfile} stats={stats} />;
} 