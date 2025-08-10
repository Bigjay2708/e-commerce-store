import { PrismaClient } from '@prisma/client';

// Global Prisma client with environment-specific configuration
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

// Create Prisma client with production optimizations
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

// Prevent multiple instances in development
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Graceful shutdown
if (typeof window === 'undefined') {
  process.on('beforeExit', async () => {
    await prisma.$disconnect();
  });
}
