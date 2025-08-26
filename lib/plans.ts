import { Plan } from '@prisma/client';

export const PLAN_LIMITS: Record<Plan, { submissionsPerMonth: number }> = {
  FREE: { submissionsPerMonth: 50 },
  PRO: { submissionsPerMonth: 10000 },
  TEAM: { submissionsPerMonth: 100000 },
};


