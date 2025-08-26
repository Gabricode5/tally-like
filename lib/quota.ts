import { prisma } from './db';
import { PLAN_LIMITS } from './plans';
import { Plan } from '@prisma/client';

export async function getEffectivePlanForForm(formId: string): Promise<Plan> {
  const form = await prisma.form.findUnique({
    where: { id: formId },
    select: { userId: true, teamId: true },
  });
  if (!form) throw new Error('NOT_FOUND');

  if (form.teamId) {
    const sub = await prisma.subscription.findUnique({ where: { teamId: form.teamId } });
    return sub?.plan ?? Plan.FREE;
  }

  if (form.userId) {
    const sub = await prisma.subscription.findUnique({ where: { userId: form.userId } });
    return sub?.plan ?? Plan.FREE;
  }

  return Plan.FREE;
}

export async function assertSubmissionQuota(formId: string) {
  const plan = await getEffectivePlanForForm(formId);
  const { submissionsPerMonth } = PLAN_LIMITS[plan];

  const monthStart = new Date();
  monthStart.setUTCDate(1);
  monthStart.setUTCHours(0, 0, 0, 0);

  const count = await prisma.submission.count({
    where: {
      formId,
      createdAt: { gte: monthStart },
    },
  });

  if (count >= submissionsPerMonth) {
    const isFree = plan === 'FREE';
    throw new Error(isFree ? 'FREE_QUOTA_EXCEEDED' : 'PLAN_QUOTA_EXCEEDED');
  }
}


