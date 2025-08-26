import { NextRequest } from 'next/server';
import { createCheckoutSession } from '@/lib/stripe';
import { requireAuth } from '@/lib/rbac';
import { json, error } from '@/app/api/_utils';

type Plan = 'PRO' | 'TEAM';

export async function POST(req: NextRequest) {
  try {
    const userId = await requireAuth();
    const { plan } = await req.json();

    if (!plan || !['PRO', 'TEAM'].includes(plan)) {
      return error('INVALID_PLAN', 400);
    }

    try {
      const session = await createCheckoutSession(userId, plan as Plan);
      return json({ url: session.url });
    } catch (stripeError: any) {
      if (stripeError.message === 'Stripe not configured') {
        return error('BILLING_NOT_CONFIGURED', 503);
      }
      throw stripeError;
    }
  } catch (e: any) {
    console.error('Checkout session error:', e);
    if (e.message === 'UNAUTHORIZED') return error('UNAUTHORIZED', 401);
    if (e.message === 'NOT_FOUND') return error('NOT_FOUND', 404);
    return error('INTERNAL_ERROR', 500);
  }
}


