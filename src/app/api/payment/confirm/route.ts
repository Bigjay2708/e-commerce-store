import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(request: NextRequest) {
  try {
    const { paymentIntentId, userId, items } = await request.json();

    // Verify payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      );
    }

    // Calculate total from items
    const total = items.reduce((sum: number, item: { price: number; quantity: number }) => {
      return sum + (item.price * item.quantity);
    }, 0);

    // Create order in database
    const order = await prisma.order.create({
      data: {
        userId: parseInt(userId),
        total,
        status: 'completed',
        items: {
          create: items.map((item: { productId: number; quantity: number; price: number }) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      order,
    });

  } catch (error) {
    console.error('Order confirmation failed:', error);
    return NextResponse.json(
      { error: 'Order confirmation failed' },
      { status: 500 }
    );
  }
}
