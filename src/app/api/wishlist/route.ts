import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user ID from email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const wishlistItems = await prisma.wishlist.findMany({
      where: { userId: user.id },
      include: {
        product: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(wishlistItems);
  } catch (error) {
    console.error('Failed to fetch wishlist:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Get user ID from email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if already in wishlist
    const existingItem = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: parseInt(productId),
        },
      },
    });

    if (existingItem) {
      return NextResponse.json(
        { error: 'Product already in wishlist' },
        { status: 400 }
      );
    }

    const wishlistItem = await prisma.wishlist.create({
      data: {
        userId: user.id,
        productId: parseInt(productId),
      },
      include: {
        product: true,
      },
    });

    return NextResponse.json(wishlistItem);
  } catch (error) {
    console.error('Failed to add to wishlist:', error);
    return NextResponse.json(
      { error: 'Failed to add to wishlist' },
      { status: 500 }
    );
  }
}
