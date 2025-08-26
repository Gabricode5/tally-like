import { prisma } from './db';
import { PLAN_LIMITS } from './plans';

type Plan = 'FREE' | 'PRO' | 'TEAM';

export async function getEffectivePlanForForm(formId: string): Promise<Plan> {
  const form = await prisma.form.findUnique({
    where: { id: formId },
    include: {
      user: {
        include: {
          subscription: true,
        },
      },
    },
  });

  if (!form) {
    throw new Error('Form not found');
  }

  // Vérifier d'abord l'abonnement de l'utilisateur
  if (form.user?.subscription && form.user.subscription.status === 'ACTIVE') {
    return form.user.subscription.plan as Plan;
  }

  // Sinon, plan gratuit
  return 'FREE';
}

export async function getMonthlySubmissionCount(formId: string): Promise<number> {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const count = await prisma.submission.count({
    where: {
      formId,
      createdAt: {
        gte: startOfMonth,
      },
    },
  });

  return count;
}

export async function assertSubmissionQuota(formId: string): Promise<void> {
  const plan = await getEffectivePlanForForm(formId);
  const currentCount = await getMonthlySubmissionCount(formId);
  const limit = PLAN_LIMITS[plan].submissionsPerMonth;

  if (currentCount >= limit) {
    throw new Error('QUOTA_EXCEEDED');
  }
}


