import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createPaymentIntent } from '@/lib/stripe';
import { getServerSession } from 'next-auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { items } = await request.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Items are required' },
        { status: 400 }
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Validate products and calculate total
    let totalAmount = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 400 }
        );
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      validatedItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
        name: product.name,
      });
    }

    // Create payment intent with Stripe
    const paymentResult = await createPaymentIntent({
      amount: Math.round(totalAmount * 100), // Convert to cents
      currency: 'usd',
      customerId: undefined, // Can be implemented later
      metadata: {
        userId: user.id.toString(),
        items: JSON.stringify(validatedItems),
      },
    });

    if (!paymentResult.success) {
      return NextResponse.json(
        { error: paymentResult.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      clientSecret: paymentResult.clientSecret,
      paymentIntentId: paymentResult.paymentIntentId,
      amount: totalAmount,
      items: validatedItems,
    });

  } catch (error) {
    console.error('Checkout initiation failed:', error);
    return NextResponse.json(
      { error: 'Checkout initiation failed' },
      { status: 500 }
    );
  }
}
