import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

// Configuration optimisée pour Supabase et Vercel
const prismaClientSingleton = () => {
  const databaseUrl = process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/tally_like';
  
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn', 'query'] : ['error'],
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  });
};

export const prisma: PrismaClient =
  global.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  global.prismaGlobal = prisma;
}


