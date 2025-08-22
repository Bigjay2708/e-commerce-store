const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Hash password for demo user
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Seed users
  const user1 = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: hashedPassword,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Demo User',
      password: hashedPassword,
    },
  });

  // Seed products
  const products = [
    {
      name: 'Wireless Headphones',
      description: 'High-quality wireless headphones with noise cancellation',
      price: 199.99,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    },
    {
      name: 'Smartphone',
      description: 'Latest model smartphone with advanced features',
      price: 699.99,
      imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
    },
    {
      name: 'Laptop',
      description: 'Powerful laptop for work and gaming',
      price: 1299.99,
      imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
    },
  ];

  for (const productData of products) {
    await prisma.product.upsert({
      where: { name: productData.name },
      update: {},
      create: productData,
    });
  }

  // Seed some wishlist items
  const createdProducts = await prisma.product.findMany();
  
  if (createdProducts.length > 0) {
    await prisma.wishlist.upsert({
      where: {
        userId_productId: {
          userId: user2.id,
          productId: createdProducts[0].id,
        },
      },
      update: {},
      create: {
        userId: user2.id,
        productId: createdProducts[0].id,
      },
    });
  }

  console.log('Database seeded successfully!');
  console.log(`Created users: ${user1.email}, ${user2.email}`);
  console.log(`Created ${products.length} products`);
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
