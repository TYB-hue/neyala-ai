import { auth, clerkClient } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { apiError, ApiError, readJson } from '@/lib/api-response';
import { defaultPreferences, preferencesSchema } from '@/lib/preferences';
export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) throw new ApiError(401, 'UNAUTHORIZED', 'Unauthorized');
    const user = await clerkClient.users.getUser(userId);
    const parsed = preferencesSchema.safeParse(user.privateMetadata.preferences);
    return NextResponse.json(parsed.success ? parsed.data : defaultPreferences, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) { return apiError(error); }
}
export async function PATCH(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) throw new ApiError(401, 'UNAUTHORIZED', 'Unauthorized');
    const preferences = await readJson(request, preferencesSchema);
    await clerkClient.users.updateUserMetadata(userId, { privateMetadata: { preferences } });
    return NextResponse.json(preferences);
  } catch (error) { return apiError(error); }
}
