import { withBodyValidation, bodySchemas } from '@/lib/request-validation';
import { auth, clerkClient } from "@clerk/nextjs";
import { NextResponse } from "next/server";

async function handlePATCH(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { firstName, lastName, username } = body;

    // Update user data in Clerk
    const user = await clerkClient.users.updateUser(userId, {
      firstName,
      lastName,
      username,
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("[USER_UPDATE]", error);
    return NextResponse.json({ success: false, error: "Internal Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Delete user from Clerk
    await clerkClient.users.deleteUser(userId);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[USER_DELETE]", error);
    return NextResponse.json({ success: false, error: "Internal Error" }, { status: 500 });
  }
} 
export const PATCH = withBodyValidation(handlePATCH, bodySchemas.user, true);
