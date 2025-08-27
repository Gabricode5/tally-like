type Plan = 'FREE' | 'PRO' | 'TEAM';

export const PLAN_LIMITS: Record<Plan, { submissionsPerMonth: number; formsLimit: number }> = {
  FREE: { submissionsPerMonth: 50, formsLimit: 3 },
  PRO: { submissionsPerMonth: 5000, formsLimit: -1 }, // -1 = illimité
  TEAM: { submissionsPerMonth: 100000, formsLimit: -1 },
};

export const PLAN_PRICES: Record<Plan, { monthly: number; yearly: number }> = {
  FREE: { monthly: 0, yearly: 0 },
  PRO: { monthly: 9, yearly: 90 },
  TEAM: { monthly: 29, yearly: 290 },
};

export function getPlanLimit(plan: Plan): number {
  return PLAN_LIMITS[plan].submissionsPerMonth;
}

export function getFormsLimit(plan: Plan): number {
  return PLAN_LIMITS[plan].formsLimit;
}

export function getPlanPrice(plan: Plan, yearly: boolean = false): number {
  return yearly ? PLAN_PRICES[plan].yearly : PLAN_PRICES[plan].monthly;
}

export function isPlanUpgradeable(currentPlan: Plan): boolean {
  return currentPlan === 'FREE';
}

export function getPlanFeatures(plan: Plan): string[] {
  const features = {
    FREE: [
      '50 soumissions/mois',
      '3 formulaires',
      'Fonctionnalités de base',
      'Support communautaire'
    ],
    PRO: [
      '5 000 soumissions/mois',
      'Formulaires illimités',
      'Export CSV',
      'Analytics avancés',
      'Support par email',
      'Intégrations webhook'
    ],
    TEAM: [
      '100 000 soumissions/mois',
      'Tout du plan PRO',
      'Collaboration d\'équipe',
      'RBAC (rôles et permissions)',
      'Support prioritaire',
      'API complète'
    ]
  };
  
  return features[plan];
}


