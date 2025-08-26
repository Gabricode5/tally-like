/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  images: {
    domains: ['localhost'],
  },
  // Optimisations pour Vercel
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  // Configuration pour les tests
  ...(process.env.NODE_ENV === 'test' && {
    experimental: {
      ...nextConfig.experimental,
      esmExternals: false,
    },
  }),
};

module.exports = nextConfig;
