import { prisma } from './db';
import { getAuthUserId } from './auth';

export type TeamRole = 'OWNER' | 'EDITOR' | 'VIEWER';

export async function requireAuth(): Promise<string> {
  const userId = getAuthUserId();
  if (!userId) {
    throw new Error('UNAUTHORIZED');
  }
  return userId;
}

export async function requireFormAccess(formId: string): Promise<{ userId: string; isTeamOwned: boolean }> {
  const userId = await requireAuth();

  const form = await prisma.form.findUnique({
    where: { id: formId },
    select: { userId: true, teamId: true },
  });
  if (!form) throw new Error('NOT_FOUND');

  if (form.userId === userId) return { userId, isTeamOwned: false };

  if (form.teamId) {
    const member = await prisma.teamMember.findFirst({
      where: { teamId: form.teamId, userId },
    });
    if (member) return { userId, isTeamOwned: true };
  }

  throw new Error('FORBIDDEN');
}

export async function canEditForm(formId: string): Promise<boolean> {
  const userId = await requireAuth();
  const form = await prisma.form.findUnique({ where: { id: formId }, select: { userId: true, teamId: true } });
  if (!form) return false;
  if (form.userId === userId) return true;
  if (form.teamId) {
    const member = await prisma.teamMember.findFirst({ where: { teamId: form.teamId, userId } });
    // EDITOR and OWNER can edit
    return !!member && (member.role === 'EDITOR' || member.role === 'OWNER');
  }
  return false;
}

const TEAM_ROLE_RANK: Record<TeamRole, number> = { VIEWER: 1, EDITOR: 2, OWNER: 3 };

export async function requireTeamRole(teamId: string, minimumRole: TeamRole): Promise<{ userId: string; role: TeamRole }>
{
  const userId = await requireAuth();
  const member = await prisma.teamMember.findFirst({ where: { teamId, userId } });
  if (!member) throw new Error('FORBIDDEN');
  if (TEAM_ROLE_RANK[member.role as TeamRole] < TEAM_ROLE_RANK[minimumRole]) {
    throw new Error('FORBIDDEN');
  }
  return { userId, role: member.role as TeamRole };
}


