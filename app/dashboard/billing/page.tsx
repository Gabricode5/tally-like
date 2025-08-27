import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/rbac';
import { prisma } from '@/lib/db';
import { createCheckoutSession, createBillingPortal } from '@/lib/stripe';
import { getPlanPrice, getPlanFeatures, getPlanLimit } from '@/lib/plans';

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

  const currentPlan = user.subscription?.plan || 'FREE';
  const isActive = user.subscription?.status === 'ACTIVE';
  const currentFeatures = getPlanFeatures(currentPlan);
  const currentLimit = getPlanLimit(currentPlan);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Facturation</h1>
      
      {/* Plan actuel */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Plan actuel</h2>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-2xl font-bold text-gray-900 capitalize">{currentPlan}</p>
            <p className="text-gray-600">
              {isActive ? 'Actif' : 'Inactif'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">
              {currentPlan === 'FREE' ? 'Gratuit' : `€${getPlanPrice(currentPlan as any)}/mois`}
            </p>
            <p className="text-sm text-gray-600">
              {currentLimit.toLocaleString()} réponses/mois
            </p>
          </div>
        </div>
        
        {/* Fonctionnalités actuelles */}
        <div className="mt-4">
          <h3 className="font-medium text-gray-900 mb-2">Fonctionnalités incluses :</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {currentFeatures.map((feature, index) => (
              <div key={index} className="flex items-center text-sm text-gray-600">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Actions</h2>
        
        {currentPlan === 'FREE' && (
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">Passer au plan Pro</h3>
              <p className="text-gray-600 mb-3">
                Débloquez des fonctionnalités avancées et augmentez vos limites
              </p>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-2xl font-bold">€9/mois</p>
                  <p className="text-sm text-gray-600">ou €90/an (-17%)</p>
                </div>
                <form action={async () => {
                  await upgrade('PRO');
                }}>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Passer au Pro
                  </button>
                </form>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">Passer au plan Team</h3>
              <p className="text-gray-600 mb-3">
                Collaboration d'équipe et fonctionnalités avancées
              </p>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-2xl font-bold">€29/mois</p>
                  <p className="text-sm text-gray-600">ou €290/an (-17%)</p>
                </div>
                <form action={async () => {
                  await upgrade('TEAM');
                }}>
                  <button
                    type="submit"
                    className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Passer au Team
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {currentPlan !== 'FREE' && (
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">Gérer la facturation</h3>
              <p className="text-gray-600 mb-3">
                Modifier votre plan, mettre à jour vos informations de paiement ou annuler votre abonnement
              </p>
              <form action={manageBilling}>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Gérer la facturation
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Informations supplémentaires */}
      <div className="mt-6 text-center text-sm text-gray-600">
        <p>Questions sur la facturation ? Contactez notre support</p>
        <p className="mt-1">Tous les plans incluent une période d'essai de 14 jours</p>
      </div>
    </div>
  );
}


