import { createCheckoutSession } from '@/lib/stripe';
import { prisma } from '@/lib/db';

jest.mock('@/lib/stripe', () => {
  const original = jest.requireActual('@/lib/stripe');
  return {
    ...original,
    stripe: {
      checkout: {
        sessions: {
          create: jest.fn(async () => ({ id: 'cs_test', url: 'https://stripe.test/checkout' })),
        },
      },
      customers: {
        retrieve: jest.fn(),
        create: jest.fn(async () => ({ id: 'cus_test' })),
      },
      billingPortal: { sessions: { create: jest.fn(async () => ({ url: 'https://stripe.test/portal' })) } },
    },
  };
});

describe('billing success', () => {
  const userId = 'user_billing_test';
  beforeAll(async () => {
    await prisma.user.create({ data: { id: userId, email: 'user@test.com', passwordHash: 'x' } }).catch(() => {});
  });
  afterAll(async () => { await prisma.$disconnect(); });

  it('creates checkout session', async () => {
    const session = await createCheckoutSession(userId, 'PRO' as any);
    expect(session.url).toContain('stripe');
  });
});


