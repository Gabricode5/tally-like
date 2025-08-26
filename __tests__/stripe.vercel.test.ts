import { stripe, isStripeConfigured, createCheckoutSession } from '@/lib/stripe';
import { prisma } from '@/lib/db';

// Mock Stripe
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    customers: {
      create: jest.fn().mockResolvedValue({ id: 'cus_test123' }),
      retrieve: jest.fn().mockResolvedValue({ id: 'cus_test123' }),
    },
    checkout: {
      sessions: {
        create: jest.fn().mockResolvedValue({
          id: 'cs_test123',
          url: 'https://checkout.stripe.com/test',
        }),
      },
    },
    billingPortal: {
      sessions: {
        create: jest.fn().mockResolvedValue({
          url: 'https://billing.stripe.com/test',
        }),
      },
    },
  }));
});

// Mock Prisma
jest.mock('@/lib/db', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe('Stripe Vercel Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('isStripeConfigured', () => {
    it('should return false when STRIPE_SECRET_KEY is not set', () => {
      const originalEnv = process.env.STRIPE_SECRET_KEY;
      delete process.env.STRIPE_SECRET_KEY;

      expect(isStripeConfigured()).toBe(false);

      process.env.STRIPE_SECRET_KEY = originalEnv;
    });

    it('should return true when STRIPE_SECRET_KEY is set', () => {
      process.env.STRIPE_SECRET_KEY = 'sk_test_123';
      expect(isStripeConfigured()).toBe(true);
    });
  });

  describe('createCheckoutSession', () => {
    it('should throw error when Stripe is not configured', async () => {
      const originalEnv = process.env.STRIPE_SECRET_KEY;
      delete process.env.STRIPE_SECRET_KEY;

      await expect(createCheckoutSession('user123', 'PRO')).rejects.toThrow('Stripe not configured');

      process.env.STRIPE_SECRET_KEY = originalEnv;
    });

    it('should create checkout session when properly configured', async () => {
      process.env.STRIPE_SECRET_KEY = 'sk_test_123';
      process.env.STRIPE_PRICE_PRO = 'price_pro_123';
      process.env.PUBLIC_APP_URL = 'http://localhost:3000';

      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'user123',
        email: 'test@example.com',
        stripeCustomerId: null,
      });

      (prisma.user.update as jest.Mock).mockResolvedValue({});

      const session = await createCheckoutSession('user123', 'PRO');

      expect(session).toBeDefined();
      expect(session.id).toBe('cs_test123');
      expect(session.url).toBe('https://checkout.stripe.com/test');
    });
  });

  describe('stripe client', () => {
    it('should be null when STRIPE_SECRET_KEY is not set', () => {
      const originalEnv = process.env.STRIPE_SECRET_KEY;
      delete process.env.STRIPE_SECRET_KEY;

      // Re-import pour tester la configuration
      jest.resetModules();
      const { stripe } = require('@/lib/stripe');
      expect(stripe).toBeNull();

      process.env.STRIPE_SECRET_KEY = originalEnv;
    });

    it('should be configured when STRIPE_SECRET_KEY is set', () => {
      process.env.STRIPE_SECRET_KEY = 'sk_test_123';

      // Re-import pour tester la configuration
      jest.resetModules();
      const { stripe } = require('@/lib/stripe');
      expect(stripe).toBeDefined();
    });
  });
});
