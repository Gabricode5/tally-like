import { prisma } from '@/lib/db';
import { assertSubmissionQuota } from '@/lib/quota';
import { Plan } from '@prisma/client';

jest.mock('@/lib/quota', () => {
  const original = jest.requireActual('@/lib/quota');
  return {
    ...original,
    getEffectivePlanForForm: jest.fn(),
  };
});

const { getEffectivePlanForForm } = jest.requireMock('@/lib/quota');

describe('quota', () => {
  const formId = 'form_1';

  beforeAll(async () => {
    await prisma.form.create({
      data: { id: formId, title: 'Q', userId: null },
    }).catch(() => {});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('allows under quota', async () => {
    (getEffectivePlanForForm as jest.Mock).mockResolvedValue('FREE' as Plan);
    await prisma.submission.deleteMany({ where: { formId } });
    for (let i = 0; i < 3; i++) {
      await prisma.submission.create({ data: { formId } });
    }
    await expect(assertSubmissionQuota(formId)).resolves.toBeUndefined();
  });

  it('blocks when over quota on FREE', async () => {
    (getEffectivePlanForForm as jest.Mock).mockResolvedValue('FREE' as Plan);
    await prisma.submission.deleteMany({ where: { formId } });
    for (let i = 0; i < 50; i++) {
      await prisma.submission.create({ data: { formId } });
    }
    await expect(assertSubmissionQuota(formId)).rejects.toThrow('FREE_QUOTA_EXCEEDED');
  });
});


