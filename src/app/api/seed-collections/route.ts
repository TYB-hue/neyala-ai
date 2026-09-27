import { NextResponse } from 'next/server';
export async function POST() {
  return NextResponse.json({ success: false, error: 'Diagnostic endpoint is disabled.' }, { status: 404 });
}
