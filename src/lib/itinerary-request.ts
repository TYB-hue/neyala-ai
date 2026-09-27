import { z } from 'zod';
export const dateOnly = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD').refine(value => {
  const date = new Date(value + 'T00:00:00Z');
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}, 'Invalid date');
const text = z.string().trim().min(1).max(200);
export const itineraryRequestSchema = z.object({
  destination: text,
  startDate: dateOnly,
  endDate: dateOnly,
  travelGroup: text.default('solo'),
  requirements: z.array(text).max(20).default([]),
  budget: text.default('moderate'),
  travelStyle: text.default('balanced'),
  activities: z.array(text).max(20).default([]),
}).superRefine((data, ctx) => {
  const days = (Date.parse(data.endDate) - Date.parse(data.startDate)) / 86400000;
  if (days < 1 || days > 14) ctx.addIssue({ code: 'custom', path: ['endDate'], message: 'Choose a departure 1 to 14 days after arrival.' });
});
export type ItineraryRequest = z.infer<typeof itineraryRequestSchema>;
