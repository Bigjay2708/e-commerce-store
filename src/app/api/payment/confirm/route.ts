import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { sendOrderConfirmationEmail } from '@/lib/email';
import { getServerSession } from 'next-auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { paymentIntentId } = await request.json();

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Payment intent ID is required' },
        { status: 400 }
      );
    }

    // Verify payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json(
        { error: 'Payment not completed' },
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

    // Parse items from payment intent metadata
    const items = JSON.parse(paymentIntent.metadata.items || '[]');
    const total = parseFloat((paymentIntent.amount / 100).toFixed(2));

    // Create order in database
    const order = await prisma.order.create({
      data: {
        userId: user.id,
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

    // Send order confirmation email
    try {
      await sendOrderConfirmationEmail(user.email, {
        orderId: order.id,
        customerName: user.name || 'Customer',
        items: order.items.map(item => ({
          name: item.product.name,
          quantity: item.quantity,
          price: item.price,
        })),
        total: order.total,
        orderDate: order.createdAt.toLocaleDateString(),
      });
    } catch (emailError) {
      console.error('Order confirmation email failed:', emailError);
      // Don't fail the order if email fails
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt,
        items: order.items,
      },
    });

  } catch (error) {
    console.error('Order confirmation failed:', error);
    return NextResponse.json(
      { error: 'Order confirmation failed' },
      { status: 500 }
    );
  }
}
