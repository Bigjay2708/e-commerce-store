import { NextRequest, NextResponse } from 'next/server';
import { sendOrderConfirmationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email, orderData } = await request.json();

    if (!email || !orderData) {
      return NextResponse.json(
        { error: 'Email and order data are required' },
        { status: 400 }
      );
    }

    const result = await sendOrderConfirmationEmail(email, orderData);

    if (result.success) {
      return NextResponse.json({ success: true, messageId: result.messageId });
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Email sending failed:', error);
    return NextResponse.json(
      { error: 'Email sending failed' },
      { status: 500 }
    );
  }
}
