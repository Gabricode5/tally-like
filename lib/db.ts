import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

// Configuration optimisée pour Supabase et Vercel
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn', 'query'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
};

export const prisma: PrismaClient =
  global.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  global.prismaGlobal = prisma;
}


