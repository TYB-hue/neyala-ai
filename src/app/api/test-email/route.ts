import { NextRequest, NextResponse } from 'next/server';
import { sendContactEmail } from '@/lib/email-service';

export async function GET(request: NextRequest) {
  try {
    // Test email data
    const testData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '+1 (555) 123-4567',
      company: 'Test Company',
      subject: 'Test Message',
      message: 'This is a test message to verify the email system is working correctly.'
    };

    console.log('🧪 Testing email system...');
    const emailSent = await sendContactEmail(testData);

    if (emailSent) {
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully! Check nyala.trip@gmail.com',
        data: testData
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Failed to send test email. Check your RESEND_API_KEY configuration.',
        data: testData
      });
    }

  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json({
      success: false,
      error: 'Test email failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}


