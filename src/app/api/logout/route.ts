import { auth, clerkClient } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
export async function POST() {
  try {
    const { sessionId } = auth();
    if (sessionId) await clerkClient.sessions.revokeSession(sessionId);
    return NextResponse.json({ success: true });
  } catch (error) { return apiError(error); }
}
