import { withBodyValidation, bodySchemas } from '@/lib/request-validation';
import { NextRequest, NextResponse } from 'next/server';
import { sendContactEmail } from '@/lib/email-service';

async function handlePOST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, company, subject, message } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'All required fields must be filled' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Send email notification to business email
    const emailSent = await sendContactEmail({
      firstName,
      lastName,
      email,
      phone,
      company,
      subject,
      message
    });

    if (!emailSent) return NextResponse.json({ success: false, error: 'Message could not be delivered. Please try again later.' }, { status: 502 });

    return NextResponse.json({
      success: true,
      message: 'Thank you for your message. We will get back to you soon!'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process contact form' },
      { status: 500 }
    );
  }
}

export const POST = withBodyValidation(handlePOST, bodySchemas.contact, false);
