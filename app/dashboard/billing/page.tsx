import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';

async function getPlanLabel(plan: string | null | undefined) {
  switch (plan) {
    case 'PRO':
      return 'PRO (10€/mois)';
    case 'TEAM':
      return 'TEAM (30€/mois)';
    default:
      return 'FREE (50 réponses/mois)';
  }
}

export default async function BillingPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const subscription = await prisma.subscription.findUnique({ where: { userId: user.id } });
  const plan = subscription?.plan ?? 'FREE';

  async function upgrade(plan: 'PRO' | 'TEAM') {
    'use server';
    const res = await fetch(`${process.env.PUBLIC_APP_URL || ''}/api/billing/create-checkout-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan }),
      cache: 'no-store',
    });
    if (res.ok) {
      const { url } = await res.json();
      return url as string;
    }
    return null;
  }

  async function portal() {
    'use server';
    const res = await fetch(`${process.env.PUBLIC_APP_URL || ''}/api/billing/create-portal-session`, {
      method: 'POST',
      cache: 'no-store',
    });
    if (res.ok) {
      const { url } = await res.json();
      return url as string;
    }
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-semibold">Abonnement</h1>
      <div className="border rounded p-4 space-y-2">
        <div className="text-gray-600">Plan actuel</div>
        <div className="text-lg">{await getPlanLabel(plan)}</div>
      </div>
      <div className="flex flex-wrap gap-3">
        <form action={async () => {
          const url = await upgrade('PRO');
          if (url) {
            // @ts-expect-error Server Action redirect via return
            return (global as any).location ? (location.href = url) : url;
          }
        }}>
          <button type="submit" className="px-3 py-2 bg-black text-white rounded">Upgrade PRO</button>
        </form>
        <form action={async () => {
          const url = await upgrade('TEAM');
          if (url) {
            // @ts-expect-error Server Action redirect via return
            return (global as any).location ? (location.href = url) : url;
          }
        }}>
          <button type="submit" className="px-3 py-2 bg-black text-white rounded">Upgrade TEAM</button>
        </form>
        <form action={async () => {
          const url = await portal();
          if (url) {
            // @ts-expect-error Server Action redirect via return
            return (global as any).location ? (location.href = url) : url;
          }
        }}>
          <button type="submit" className="px-3 py-2 border rounded">Gérer mon abonnement</button>
        </form>
      </div>
    </div>
  );
}


