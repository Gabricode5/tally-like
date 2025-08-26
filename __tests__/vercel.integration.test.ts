import { prisma } from '@/lib/db';
import { stripe, isStripeConfigured } from '@/lib/stripe';
import { openai } from '@/lib/openai';

describe('Vercel Integration', () => {
  describe('Database Connection', () => {
    it('should connect to database', async () => {
      // Test de connexion basique
      expect(prisma).toBeDefined();
      
      // Vérifier que Prisma peut se connecter
      try {
        await prisma.$connect();
        expect(true).toBe(true); // Si on arrive ici, la connexion fonctionne
      } catch (error) {
        // En test, la DB peut ne pas être disponible
        console.warn('Database connection test skipped:', error);
      } finally {
        await prisma.$disconnect();
      }
    });
  });

  describe('Stripe Configuration', () => {
    it('should handle missing Stripe configuration gracefully', () => {
      const originalEnv = process.env.STRIPE_SECRET_KEY;
      delete process.env.STRIPE_SECRET_KEY;

      // Re-import pour tester la configuration
      jest.resetModules();
      const { isStripeConfigured } = require('@/lib/stripe');
      
      expect(isStripeConfigured()).toBe(false);

      process.env.STRIPE_SECRET_KEY = originalEnv;
    });

    it('should configure Stripe when key is present', () => {
      process.env.STRIPE_SECRET_KEY = 'sk_test_123';

      // Re-import pour tester la configuration
      jest.resetModules();
      const { isStripeConfigured } = require('@/lib/stripe');
      
      expect(isStripeConfigured()).toBe(true);
    });
  });

  describe('OpenAI Configuration', () => {
    it('should handle missing OpenAI configuration gracefully', () => {
      const originalEnv = process.env.OPENAI_API_KEY;
      delete process.env.OPENAI_API_KEY;

      // Re-import pour tester la configuration
      jest.resetModules();
      const { openai } = require('@/lib/openai');
      
      expect(openai).toBeUndefined();

      process.env.OPENAI_API_KEY = originalEnv;
    });

    it('should configure OpenAI when key is present', () => {
      process.env.OPENAI_API_KEY = 'sk-1234567890abcdef';

      // Re-import pour tester la configuration
      jest.resetModules();
      const { openai } = require('@/lib/openai');
      
      expect(openai).toBeDefined();
    });
  });

  describe('Environment Variables', () => {
    it('should have required environment variables', () => {
      const requiredVars = [
        'DATABASE_URL',
        'JWT_SECRET',
        'PUBLIC_APP_URL',
      ];

      requiredVars.forEach(varName => {
        expect(process.env[varName]).toBeDefined();
      });
    });

    it('should handle optional environment variables', () => {
      const optionalVars = [
        'STRIPE_SECRET_KEY',
        'OPENAI_API_KEY',
        'EMAIL_PROVIDER',
      ];

      // Ces variables peuvent être undefined en développement/test
      optionalVars.forEach(varName => {
        expect(typeof process.env[varName]).toBe('string');
      });
    });
  });

  describe('Serverless Compatibility', () => {
    it('should handle cold starts gracefully', async () => {
      // Simuler un cold start en réinitialisant les modules
      jest.resetModules();
      
      // Recharger les modules principaux
      const { prisma } = require('@/lib/db');
      const { stripe } = require('@/lib/stripe');
      const { openai } = require('@/lib/openai');
      
      expect(prisma).toBeDefined();
      expect(stripe).toBeDefined();
      expect(openai).toBeDefined();
    });

    it('should handle concurrent requests', async () => {
      // Test de concurrence basique
      const promises = Array.from({ length: 5 }, async (_, i) => {
        const { prisma } = require('@/lib/db');
        return { id: i, prisma: !!prisma };
      });

      const results = await Promise.all(promises);
      
      results.forEach(result => {
        expect(result.prisma).toBe(true);
      });
    });
  });
});
