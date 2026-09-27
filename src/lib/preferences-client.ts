import type { UserPreferences } from '@/types';
export async function getUserPreferences(_userId: string): Promise<UserPreferences> {
  const response = await fetch('/api/user/preferences', { cache: 'no-store' });
  if (!response.ok) throw new Error('Unable to load preferences.');
  return response.json();
}
export async function updateUserPreferences(_userId: string, preferences: UserPreferences): Promise<UserPreferences> {
  const response = await fetch('/api/user/preferences', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(preferences) });
  if (!response.ok) throw new Error('Unable to save preferences.');
  return response.json();
}
