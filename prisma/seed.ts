import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.review.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // Seed users
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: '$2b$10$Kx9J8l9t7h6g5f4d3s2a1e', // Placeholder hash
    },
  });

  const customer = await prisma.user.create({
    data: {
      email: 'customer@example.com',
      name: 'Jane Customer',
      password: '$2b$10$Kx9J8l9t7h6g5f4d3s2a1e', // Placeholder hash
    },
  });

  // Seed products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Wireless Headphones',
        description: 'High-quality wireless Bluetooth headphones with noise cancellation',
        price: 199.99,
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Smart Watch',
        description: 'Feature-rich smartwatch with health monitoring and GPS',
        price: 299.99,
        imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Coffee Maker',
        description: 'Premium coffee maker with programmable brewing settings',
        price: 89.99,
        imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Laptop Backpack',
        description: 'Durable laptop backpack with multiple compartments',
        price: 49.99,
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
      },
    }),
  ]);

  // Seed reviews
  await prisma.review.create({
    data: {
      productId: products[0].id,
      userId: customer.id,
      rating: 5,
      comment: 'Amazing sound quality and battery life!',
    },
  });

  // Seed wishlist
  await prisma.wishlist.create({
    data: {
      userId: customer.id,
      productId: products[1].id,
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log(`👤 Created 2 users (${admin.email}, ${customer.email})`);
  console.log(`📦 Created ${products.length} products`);
  console.log(`⭐ Created 1 review`);
  console.log(`❤️ Created 1 wishlist item`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
