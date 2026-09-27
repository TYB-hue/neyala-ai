import { z } from 'zod';
export const preferencesSchema = z.object({
  notifications: z.object({ email: z.boolean(), push: z.boolean(), marketing: z.boolean() }),
  darkMode: z.boolean(), language: z.string().min(2).max(10), currency: z.string().regex(/^[A-Z]{3}$/),
});
export const defaultPreferences = { notifications: { email: true, push: true, marketing: false }, darkMode: false, language: 'en', currency: 'USD' };
