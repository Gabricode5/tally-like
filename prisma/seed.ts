import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

type Role = 'USER' | 'ADMIN';
type Plan = 'FREE' | 'PRO' | 'TEAM';
type FieldType = 'TEXT' | 'EMAIL' | 'NUMBER' | 'TEXTAREA' | 'SELECT' | 'CHECKBOX' | 'RADIO';
type TeamRole = 'OWNER' | 'EDITOR' | 'VIEWER';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Nettoyer la base de données
  await prisma.submissionAnswer.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.field.deleteMany();
  await prisma.form.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.team.deleteMany();
  await prisma.user.deleteMany();

  // Créer un utilisateur admin
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN' as Role,
    },
  });

  // Créer un utilisateur normal
  const userPassword = await bcrypt.hash('user123', 12);
  const user = await prisma.user.create({
    data: {
      email: 'user@example.com',
      password: userPassword,
      name: 'Normal User',
      role: 'USER' as Role,
    },
  });

  // Créer une équipe
  const team = await prisma.team.create({
    data: {
      name: 'Demo Team',
      description: 'Une équipe de démonstration',
      ownerId: admin.id,
    },
  });

  // Ajouter des membres à l'équipe
  await prisma.teamMember.create({
    data: {
      userId: admin.id,
      teamId: team.id,
      role: 'OWNER' as TeamRole,
    },
  });

  await prisma.teamMember.create({
    data: {
      userId: user.id,
      teamId: team.id,
      role: 'EDITOR' as TeamRole,
    },
  });

  // Créer un formulaire
  const form = await prisma.form.create({
    data: {
      title: 'Formulaire de contact',
      description: 'Un formulaire de démonstration',
      userId: user.id,
      isPublished: true,

    },
  });

  // Ajouter des champs au formulaire
  await prisma.field.createMany({
    data: [
      {
        formId: form.id,
        type: 'TEXT' as FieldType,
        label: 'Nom',
        required: true,
        order: 0,
      },
      {
        formId: form.id,
        type: 'EMAIL' as FieldType,
        label: 'Email',
        required: true,
        order: 1,
      },
      {
        formId: form.id,
        type: 'TEXTAREA' as FieldType,
        label: 'Message',
        required: true,
        order: 2,
      },
    ],
  });

  // Créer quelques soumissions de test
  const submission1 = await prisma.submission.create({
    data: {
      formId: form.id,
    },
  });

  await prisma.submissionAnswer.createMany({
    data: [
      {
        submissionId: submission1.id,
        fieldId: (await prisma.field.findFirst({ where: { formId: form.id, order: 0 } }))!.id,
        value: 'John Doe',
      },
      {
        submissionId: submission1.id,
        fieldId: (await prisma.field.findFirst({ where: { formId: form.id, order: 1 } }))!.id,
        value: 'john@example.com',
      },
      {
        submissionId: submission1.id,
        fieldId: (await prisma.field.findFirst({ where: { formId: form.id, order: 2 } }))!.id,
        value: 'Bonjour, j\'aimerais en savoir plus sur vos services.',
      },
    ],
  });

  console.log('✅ Database seeded successfully!');
  console.log(`👤 Admin user: admin@example.com / admin123`);
  console.log(`👤 Normal user: user@example.com / user123`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


