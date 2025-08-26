import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/rbac';
import { prisma } from '@/lib/db';
import { createCheckoutSession, createBillingPortal } from '@/lib/stripe';

async function upgrade(plan: 'PRO' | 'TEAM') {
  'use server';
  
  const userId = await requireAuth();
  
  try {
    const session = await createCheckoutSession(userId, plan);
    if (session.url) {
      redirect(session.url);
    } else {
      throw new Error('No checkout URL received');
    }
  } catch (error) {
    console.error('Checkout error:', error);
    throw new Error('Failed to create checkout session');
  }
}

async function manageBilling() {
  'use server';
  
  const userId = await requireAuth();
  
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true },
  });
  
  if (!user?.stripeCustomerId) {
    throw new Error('No billing account found');
  }
  
  try {
    const session = await createBillingPortal(user.stripeCustomerId);
    if (session.url) {
      redirect(session.url);
    } else {
      throw new Error('No billing portal URL received');
    }
  } catch (error) {
    console.error('Billing portal error:', error);
    throw new Error('Failed to create billing portal session');
  }
}

export default async function BillingPage() {
  const userId = await requireAuth();
  
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      subscription: true,
    },
  });

  if (!user) {
    redirect('/login');
  }

  const plan = user.subscription?.plan || 'FREE';
  const isActive = user.subscription?.status === 'ACTIVE';

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Facturation</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Plan actuel</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-900">{plan}</p>
            <p className="text-gray-600">
              {isActive ? 'Actif' : 'Inactif'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">
              {plan === 'FREE' && '50 réponses/mois'}
              {plan === 'PRO' && 'Réponses illimitées'}
              {plan === 'TEAM' && 'Réponses illimitées + Équipe'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Actions</h2>
        <div className="flex flex-wrap gap-3">
          <form action={async () => {
            await upgrade('PRO');
          }}>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Passer à PRO
            </button>
          </form>
          
          <form action={async () => {
            await upgrade('TEAM');
          }}>
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Passer à TEAM
            </button>
          </form>
          
          {isActive && (
            <form action={async () => {
              await manageBilling();
            }}>
              <button
                type="submit"
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Gérer mon abonnement
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}


