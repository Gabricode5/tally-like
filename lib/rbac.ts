import { getAuthCookie } from './cookies';
import { verifyJwt } from './jwt';

export async function requireAuth(): Promise<string> {
  const token = getAuthCookie();
  if (!token) {
    throw new Error('UNAUTHORIZED');
  }

  try {
    const payload = await verifyJwt(token);
    if (!payload || !payload.sub) {
      throw new Error('UNAUTHORIZED');
    }
    return payload.sub;
  } catch (error) {
    throw new Error('UNAUTHORIZED');
  }
}

export async function requireFormAccess(formId: string): Promise<void> {
  const userId = await requireAuth();
  
  // Vérifier que l'utilisateur a accès au formulaire
  const { prisma } = await import('./db');
  const form = await prisma.form.findUnique({
    where: { id: formId },
    select: { userId: true },
  });

  if (!form || form.userId !== userId) {
    throw new Error('FORBIDDEN');
  }
}

export async function requireTeamRole(teamId: string, requiredRole: 'OWNER' | 'EDITOR' | 'VIEWER'): Promise<void> {
  const userId = await requireAuth();
  
  const { prisma } = await import('./db');
  const member = await prisma.teamMember.findUnique({
    where: {
      userId_teamId: {
        userId,
        teamId,
      },
    },
    select: { role: true },
  });

  if (!member) {
    throw new Error('FORBIDDEN');
  }

  // Hiérarchie des rôles : OWNER > EDITOR > VIEWER
  const roleHierarchy = { OWNER: 3, EDITOR: 2, VIEWER: 1 };
  const userRoleLevel = roleHierarchy[member.role as keyof typeof roleHierarchy] || 0;
  const requiredRoleLevel = roleHierarchy[requiredRole];

  if (userRoleLevel < requiredRoleLevel) {
    throw new Error('FORBIDDEN');
  }
}

export function canEditForm(userRole: string, teamRole?: string): boolean {
  if (userRole === 'ADMIN') return true;
  if (teamRole === 'OWNER' || teamRole === 'EDITOR') return true;
  return false;
}


