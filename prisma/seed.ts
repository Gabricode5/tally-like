import { PrismaClient, Role, Plan, FieldType, TeamRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);

  const user = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      passwordHash,
      name: 'Admin',
      role: Role.ADMIN,
      notifyOnSubmit: true,
      subscription: {
        create: {
          plan: Plan.PRO,
        },
      },
    },
    include: { subscription: true },
  });

  const team = await prisma.team.create({
    data: {
      name: 'Demo Team',
      ownerId: user.id,
      subscription: {
        create: {
          plan: Plan.TEAM,
        },
      },
    },
    include: { subscription: true },
  });

  await prisma.teamMember.create({
    data: {
      teamId: team.id,
      userId: user.id,
      role: TeamRole.OWNER,
    },
  });

  const viewer = await prisma.user.upsert({
    where: { email: 'viewer@example.com' },
    update: {},
    create: { email: 'viewer@example.com', passwordHash, name: 'Viewer', role: Role.USER },
  });

  await prisma.teamMember.create({
    data: { teamId: team.id, userId: viewer.id, role: TeamRole.VIEWER },
  });

  const editor = await prisma.user.upsert({
    where: { email: 'editor@example.com' },
    update: {},
    create: { email: 'editor@example.com', passwordHash, name: 'Editor', role: Role.USER },
  });

  await prisma.teamMember.create({
    data: { teamId: team.id, userId: editor.id, role: TeamRole.EDITOR },
  });

  const form = await prisma.form.create({
    data: {
      title: 'Demo Feedback',
      description: 'Collect feedback from users',
      userId: user.id,
      isPublished: true,
      notifyOnSubmit: true,
      fields: {
        createMany: {
          data: [
            { label: 'Name', type: FieldType.TEXT, required: true, order: 1 },
            { label: 'Email', type: FieldType.EMAIL, required: true, order: 2 },
            { label: 'Feedback', type: FieldType.TEXTAREA, required: true, order: 3 },
            { label: 'Rating', type: FieldType.SELECT, required: false, order: 4, optionsJson: JSON.stringify(['1', '2', '3', '4', '5']) },
          ],
        },
      },
    },
    include: { fields: true },
  });

  console.log('Seed complete:', { user: user.email, team: team.name, form: form.title });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


