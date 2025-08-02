import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(request: NextRequest) {
  try {
    const { items, customerId } = await request.json();

    // Calculate total amount
    const totalAmount = items.reduce((sum: number, item: { price: number; quantity: number }) => {
      return sum + (item.price * item.quantity * 100); // Convert to cents
    }, 0);

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: 'usd',
      customer: customerId,
      metadata: {
        orderItems: JSON.stringify(items),
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });

  } catch (error) {
    console.error('Payment intent creation failed:', error);
    return NextResponse.json(
      { error: 'Payment intent creation failed' },
      { status: 500 }
    );
  }
}
