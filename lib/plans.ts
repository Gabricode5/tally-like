type Plan = 'FREE' | 'PRO' | 'TEAM';

export const PLAN_LIMITS: Record<Plan, { submissionsPerMonth: number }> = {
  FREE: { submissionsPerMonth: 50 },
  PRO: { submissionsPerMonth: 10000 },
  TEAM: { submissionsPerMonth: 100000 },
};

export function getPlanLimit(plan: Plan): number {
  return PLAN_LIMITS[plan].submissionsPerMonth;
}

export function isPlanUpgradeable(currentPlan: Plan): boolean {
  return currentPlan === 'FREE';
}


