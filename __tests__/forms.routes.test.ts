import { prisma } from '@/lib/db';

describe('forms routes basic dao flow', () => {
  let formId = '';

  afterAll(async () => { await prisma.$disconnect(); });

  it('create form', async () => {
    const form = await prisma.form.create({ data: { title: 'Test Form' } });
    formId = form.id;
    expect(form.title).toBe('Test Form');
  });

  it('update form', async () => {
    const form = await prisma.form.update({ where: { id: formId }, data: { description: 'Desc' } });
    expect(form.description).toBe('Desc');
  });

  it('bulk fields', async () => {
    await prisma.field.createMany({ data: [
      { formId, label: 'Name', type: 'TEXT', required: true, order: 1 },
      { formId, label: 'Email', type: 'EMAIL', required: true, order: 2 },
    ] });
    const fields = await prisma.field.findMany({ where: { formId } });
    expect(fields.length).toBe(2);
  });

  it('submissions create + list', async () => {
    const fields = await prisma.field.findMany({ where: { formId } });
    const submission = await prisma.submission.create({
      data: {
        formId,
        answers: { createMany: { data: fields.map((f, i) => ({ fieldId: f.id, value: `v${i}` })) } },
      },
      include: { answers: true },
    });
    expect(submission.answers.length).toBe(fields.length);

    const list = await prisma.submission.findMany({ where: { formId }, include: { answers: true } });
    expect(list.length).toBeGreaterThan(0);
  });

  it('delete form', async () => {
    await prisma.form.delete({ where: { id: formId } });
    const maybe = await prisma.form.findUnique({ where: { id: formId } });
    expect(maybe).toBeNull();
  });
});


