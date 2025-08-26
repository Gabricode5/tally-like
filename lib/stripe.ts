import Stripe from 'stripe';
import { prisma } from './db';

type Plan = 'PRO' | 'TEAM';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY!;
const STRIPE_PRICE_PRO = process.env.STRIPE_PRICE_PRO!;
const STRIPE_PRICE_TEAM = process.env.STRIPE_PRICE_TEAM!;
const PUBLIC_APP_URL = process.env.PUBLIC_APP_URL!;

if (!STRIPE_SECRET_KEY && process.env.NODE_ENV === 'production') {
  throw new Error('STRIPE_SECRET_KEY missing in production');
}

// Configuration Stripe optimisée pour Vercel
export const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  typescript: true,
}) : null;

function getPriceIdForPlan(plan: Plan): string {
  switch (plan) {
    case 'PRO':
      return STRIPE_PRICE_PRO;
    case 'TEAM':
      return STRIPE_PRICE_TEAM;
    default:
      throw new Error(`Invalid plan: ${plan}`);
  }
}

export async function getOrCreateStripeCustomer(userId: string): Promise<string> {
  if (!stripe) {
    throw new Error('Stripe not configured');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true },
  });

  if (user?.stripeCustomerId) {
    // Vérifier que le customer existe toujours sur Stripe
    try {
      await stripe.customers.retrieve(user.stripeCustomerId);
      return user.stripeCustomerId;
    } catch {
      // Customer n'existe plus sur Stripe, on va le recréer
    }
  }

  // Créer un nouveau customer
  const customer = await stripe.customers.create({
    metadata: { userId },
  });

  // Mettre à jour l'utilisateur
  await prisma.user.update({
    where: { id: userId },
    data: { stripeCustomerId: customer.id },
  });

  return customer.id;
}

export async function createCheckoutSession(userId: string, plan: Plan): Promise<{ url: string }> {
  if (!stripe) {
    throw new Error('Stripe not configured');
  }

  const customerId = await getOrCreateStripeCustomer(userId);
  const priceId = getPriceIdForPlan(plan);

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${PUBLIC_APP_URL}/dashboard/billing?success=true`,
    cancel_url: `${PUBLIC_APP_URL}/dashboard/billing?canceled=true`,
    metadata: {
      userId,
      plan,
    },
  });

  return { url: session.url! };
}

export async function createBillingPortal(customerId: string): Promise<{ url: string }> {
  if (!stripe) {
    throw new Error('Stripe not configured');
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${PUBLIC_APP_URL}/dashboard/billing`,
  });

  return { url: session.url };
}

// Fonction utilitaire pour vérifier si Stripe est configuré
export function isStripeConfigured(): boolean {
  return !!stripe && !!STRIPE_SECRET_KEY;
}


