import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Clear any server-side session data if needed
    const response = NextResponse.json({ success: true });
    
    // Clear cookies
    response.cookies.delete('session');
    response.cookies.delete('token');
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ success: false, error: 'Logout failed' }, { status: 500 });
  }
}

