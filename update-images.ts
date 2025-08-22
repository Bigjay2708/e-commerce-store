import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateBrokenImages() {
  try {
    // Update the broken FakeStoreAPI URLs with working Unsplash URLs
    await prisma.product.updateMany({
      where: {
        imageUrl: 'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg'
      },
      data: {
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'
      }
    });

    await prisma.product.updateMany({
      where: {
        imageUrl: 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879_.jpg'
      },
      data: {
        imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'
      }
    });

    await prisma.product.updateMany({
      where: {
        imageUrl: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg'
      },
      data: {
        imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400'
      }
    });

    console.log('Successfully updated broken image URLs');
  } catch (error) {
    console.error('Error updating image URLs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateBrokenImages();
