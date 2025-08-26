import { NextRequest } from 'next/server';
import { createBillingPortal } from '@/lib/stripe';
import { requireAuth } from '@/lib/rbac';
import { prisma } from '@/lib/db';
import { json, error } from '@/app/api/_utils';

export async function POST(req: NextRequest) {
  try {
    const userId = await requireAuth();
    
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return error('NOT_FOUND', 404);
    
    if (!user.stripeCustomerId) {
      return error('NO_SUBSCRIPTION', 400);
    }

    try {
      const session = await createBillingPortal(user.stripeCustomerId);
      return json({ url: session.url });
    } catch (stripeError: any) {
      if (stripeError.message === 'Stripe not configured') {
        return error('BILLING_NOT_CONFIGURED', 503);
      }
      throw stripeError;
    }
  } catch (e: any) {
    console.error('Portal session error:', e);
    if (e.message === 'UNAUTHORIZED') return error('UNAUTHORIZED', 401);
    if (e.message === 'NOT_FOUND') return error('NOT_FOUND', 404);
    return error('INTERNAL_ERROR', 500);
  }
}


