import Stripe from 'stripe';
import { prisma } from './db';
import { Plan } from '@prisma/client';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY!;
const STRIPE_PRICE_PRO = process.env.STRIPE_PRICE_PRO!;
const STRIPE_PRICE_TEAM = process.env.STRIPE_PRICE_TEAM!;
const PUBLIC_APP_URL = process.env.PUBLIC_APP_URL!;

if (!STRIPE_SECRET_KEY && process.env.NODE_ENV === 'production') {
  throw new Error('STRIPE_SECRET_KEY missing in production');
}

// Configuration Stripe optimisée pour Vercel
export const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
  typescript: true,
}) : null;

export function getPriceIdForPlan(plan: Plan) {
  switch (plan) {
    case 'PRO':
      return STRIPE_PRICE_PRO;
    case 'TEAM':
      return STRIPE_PRICE_TEAM;
    default:
      throw new Error('NO_PRICE_FOR_FREE');
  }
}

export async function getOrCreateStripeCustomer(userId: string, email: string) {
  if (!stripe) throw new Error('Stripe not configured');

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('NOT_FOUND');

  if (user.stripeCustomerId) {
    try {
      return await stripe.customers.retrieve(user.stripeCustomerId);
    } catch (error) {
      // Si le customer n'existe plus sur Stripe, on le recrée
      console.warn('Stripe customer not found, recreating:', user.stripeCustomerId);
    }
  }

  const customer = await stripe.customers.create({
    email,
    metadata: { userId },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { stripeCustomerId: customer.id },
  });

  return customer;
}

export async function createCheckoutSession(userId: string, plan: Plan) {
  if (!stripe) throw new Error('Stripe not configured');

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('NOT_FOUND');

  const customer = await getOrCreateStripeCustomer(userId, user.email);

  const priceId = getPriceIdForPlan(plan);

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: typeof customer === 'string' ? customer : customer.id,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${PUBLIC_APP_URL}/dashboard/billing?success=1`,
    cancel_url: `${PUBLIC_APP_URL}/dashboard/billing?canceled=1`,
    metadata: { userId, plan },
    allow_promotion_codes: true,
    billing_address_collection: 'auto',
  });

  return session;
}

export async function createBillingPortal(customerId: string) {
  if (!stripe) throw new Error('Stripe not configured');

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${PUBLIC_APP_URL}/dashboard/billing`,
  });
  return session;
}

// Fonction utilitaire pour vérifier si Stripe est configuré
export function isStripeConfigured(): boolean {
  return !!stripe && !!STRIPE_SECRET_KEY;
}


