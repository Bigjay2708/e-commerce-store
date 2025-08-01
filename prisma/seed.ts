import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Seed users
  await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin',
      password: 'hashed-password', // Replace with real hash in production
    },
  });
  // Seed products
  await prisma.product.create({
    data: {
      name: 'Sample Product',
      description: 'A sample product for testing',
      price: 19.99,
      imageUrl: 'https://via.placeholder.com/300',
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
