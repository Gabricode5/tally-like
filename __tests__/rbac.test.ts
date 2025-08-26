import { prisma } from '@/lib/db';
import { requireTeamRole } from '@/lib/rbac';

describe('RBAC team role hierarchy', () => {
  let teamId = '';
  let ownerId = '';
  let editorId = '';
  let viewerId = '';

  beforeAll(async () => {
    // create users and team
    const owner = await prisma.user.create({ data: { email: `owner_${Date.now()}@t.test`, passwordHash: 'x' } });
    const editor = await prisma.user.create({ data: { email: `editor_${Date.now()}@t.test`, passwordHash: 'x' } });
    const viewer = await prisma.user.create({ data: { email: `viewer_${Date.now()}@t.test`, passwordHash: 'x' } });
    ownerId = owner.id; editorId = editor.id; viewerId = viewer.id;

    const team = await prisma.team.create({ data: { name: 'RBAC Team', ownerId: owner.id } });
    teamId = team.id;

    await prisma.teamMember.create({ data: { teamId, userId: owner.id, role: 'OWNER' as any } });
    await prisma.teamMember.create({ data: { teamId, userId: editor.id, role: 'EDITOR' as any } });
    await prisma.teamMember.create({ data: { teamId, userId: viewer.id, role: 'VIEWER' as any } });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('OWNER satisfies OWNER/EDITOR/VIEWER', async () => {
    // Mock auth: set cookie-based user id via next/headers cookies mock
    jest.spyOn(require('next/headers'), 'cookies').mockReturnValue({
      get: (n: string) => (n === 'token' ? { name: 'token', value: 'owner' } : undefined),
      getAll: () => [],
      set: () => {},
      delete: () => {},
    } as any);
    // Directly call DB lookup instead of relying on token parse in tests; emulate requireTeamRole path by injecting prisma state
    // This is a smoke test of hierarchy; detailed integration is covered elsewhere
    await prisma.teamMember.update({ where: { userId_teamId: { userId: ownerId, teamId } }, data: { role: 'OWNER' as any } });
    await expect(requireTeamRole(teamId, 'VIEWER')).resolves.toBeTruthy();
    await expect(requireTeamRole(teamId, 'EDITOR')).resolves.toBeTruthy();
    await expect(requireTeamRole(teamId, 'OWNER')).resolves.toBeTruthy();
  });

  it('EDITOR satisfies EDITOR/VIEWER, not OWNER', async () => {
    jest.spyOn(require('next/headers'), 'cookies').mockReturnValue({
      get: (n: string) => (n === 'token' ? { name: 'token', value: 'editor' } : undefined),
      getAll: () => [],
      set: () => {},
      delete: () => {},
    } as any);
    await prisma.teamMember.update({ where: { userId_teamId: { userId: editorId, teamId } }, data: { role: 'EDITOR' as any } });
    await expect(requireTeamRole(teamId, 'VIEWER')).resolves.toBeTruthy();
    await expect(requireTeamRole(teamId, 'EDITOR')).resolves.toBeTruthy();
    await expect(requireTeamRole(teamId, 'OWNER')).rejects.toThrow('FORBIDDEN');
  });

  it('VIEWER satisfies VIEWER only', async () => {
    jest.spyOn(require('next/headers'), 'cookies').mockReturnValue({
      get: (n: string) => (n === 'token' ? { name: 'token', value: 'viewer' } : undefined),
      getAll: () => [],
      set: () => {},
      delete: () => {},
    } as any);
    await prisma.teamMember.update({ where: { userId_teamId: { userId: viewerId, teamId } }, data: { role: 'VIEWER' as any } });
    await expect(requireTeamRole(teamId, 'VIEWER')).resolves.toBeTruthy();
    await expect(requireTeamRole(teamId, 'EDITOR')).rejects.toThrow('FORBIDDEN');
    await expect(requireTeamRole(teamId, 'OWNER')).rejects.toThrow('FORBIDDEN');
  });
});


