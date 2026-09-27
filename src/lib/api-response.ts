import { NextResponse } from 'next/server';
import { z } from 'zod';

export class ApiError extends Error {
  constructor(public status: number, public code: string, message: string) { super(message); }
}
export function errorInfo(error: unknown) {
  if (error instanceof ApiError) return { status: error.status, code: error.code, error: error.message };
  if (error instanceof z.ZodError) return { status: 400, code: 'INVALID_INPUT', error: error.issues.map(i => `${i.path.join('.') || 'request'}: ${i.message}`).join('; ') };
  if (error instanceof SyntaxError) return { status: 400, code: 'INVALID_JSON', error: 'Request body must be valid JSON.' };
  if (error instanceof Error && /abort|timeout/i.test(error.name)) return { status: 504, code: 'TIMEOUT', error: 'The service took too long to respond. Please try again.' };
  return { status: 500, code: 'INTERNAL_ERROR', error: 'Unable to complete the request. Please try again.' };
}
export function apiError(error: unknown) {
  const { status, ...body } = errorInfo(error);
  return NextResponse.json({ success: false, ...body }, { status, headers: { 'Cache-Control': 'no-store' } });
}
export async function readJson<T extends z.ZodTypeAny>(request: Request, schema: T): Promise<z.infer<T>> {
  const text = await request.text();
  if (new TextEncoder().encode(text).length > 1_000_000) throw new ApiError(413, 'BODY_TOO_LARGE', 'Request body is too large.');
  return schema.parse(JSON.parse(text));
}
export const jsonObject = z.object({}).passthrough();
