import { NextResponse } from 'next/server';
export async function GET() {
  return NextResponse.json({ success: false, error: 'Diagnostic endpoint is disabled.' }, { status: 404 });
}
