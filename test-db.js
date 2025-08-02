const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    
    // Test user count
    const userCount = await prisma.user.count();
    console.log(`Users in database: ${userCount}`);
    
    // Test product count
    const productCount = await prisma.product.count();
    console.log(`Products in database: ${productCount}`);
    
    // Fetch some data
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });
    
    console.log('Users:', users);
    
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        price: true,
      },
    });
    
    console.log('Products:', products);
    
    console.log('✅ Database connection successful!');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
