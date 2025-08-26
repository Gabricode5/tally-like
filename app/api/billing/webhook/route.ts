import { NextRequest } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/db';
import { json, error } from '@/app/api/_utils';

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

// Configuration pour le webhook Stripe (pas de bodyParser)
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    if (!stripe) {
      console.warn('Stripe webhook received but Stripe not configured');
      return json({ received: true });
    }

    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature || !STRIPE_WEBHOOK_SECRET) {
      return error('MISSING_SIGNATURE', 400);
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return error('INVALID_SIGNATURE', 400);
    }

    console.log('Webhook event:', event.type);

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(event.data.object);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionCanceled(event.data.object);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return json({ received: true });
  } catch (e: any) {
    console.error('Webhook error:', e);
    return error('WEBHOOK_ERROR', 500);
  }
}

async function handleSubscriptionChange(subscription: any) {
  const customerId = subscription.customer;
  const status = subscription.status;
  const plan = subscription.items.data[0]?.price?.metadata?.plan || 'PRO';

  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId },
  });

  if (!user) {
    console.error('User not found for customer:', customerId);
    return;
  }

  await prisma.subscription.upsert({
    where: { userId: user.id },
    update: {
      stripeSubscriptionId: subscription.id,
      status,
      plan: plan as any,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
    create: {
      userId: user.id,
      stripeSubscriptionId: subscription.id,
      status,
      plan: plan as any,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
  });

  console.log(`Subscription ${status} for user ${user.id}`);
}

async function handleSubscriptionCanceled(subscription: any) {
  const customerId = subscription.customer;

  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId },
  });

  if (!user) {
    console.error('User not found for customer:', customerId);
    return;
  }

  await prisma.subscription.update({
    where: { userId: user.id },
    data: {
      status: 'CANCELED',
      currentPeriodEnd: new Date(subscription.canceled_at * 1000),
    },
  });

  console.log(`Subscription canceled for user ${user.id}`);
}


