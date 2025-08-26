import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { error, json, readJson } from '@/app/api/_utils';
import { assertSubmissionQuota } from '@/lib/quota';
import { sendEmail, submissionNotificationTemplate } from '@/lib/email';
import { rateLimit } from '@/lib/rate-limit';

type SubmissionInput = Record<string, string>;

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await readJson<SubmissionInput>(req);
    const form = await prisma.form.findUnique({
      where: { id: params.id },
      include: { fields: { orderBy: { order: 'asc' } }, owner: true },
    });
    if (!form || !form.isPublished) return error('FORM_NOT_AVAILABLE', 404);

    const ip = req.headers.get('x-forwarded-for') || (req as any).ip || '';
    const rl = await rateLimit(`submit:${form.id}:${ip}`, 20, 60);
    if (!rl.ok) return error('RATE_LIMITED', 429);
    await assertSubmissionQuota(form.id);

    const fieldByLabel = new Map(form.fields.map((f) => [f.label, f]));
    const answers = Object.entries(body).map(([label, value]) => {
      const field = fieldByLabel.get(label);
      return field ? { fieldId: field.id, value: String(value ?? '') } : null;
    }).filter(Boolean) as { fieldId: string; value: string }[];

    const ua = req.headers.get('user-agent') || '';

    const submission = await prisma.submission.create({
      data: {
        formId: form.id,
        answers: { createMany: { data: answers } },
        ipAddress: ip,
        userAgent: ua,
      },
      include: { answers: true },
    });

    if (form.notifyOnSubmit && form.owner?.email) {
      const count = await prisma.submission.count({ where: { formId: form.id } });
      const { subject, text, html } = submissionNotificationTemplate(form.title, count);
      await sendEmail({ to: form.owner.email, subject, text, html });
    }

    return json({ submissionId: submission.id }, 201);
  } catch (e: any) {
    if (e.message === 'FREE_QUOTA_EXCEEDED') return error('FREE_QUOTA_EXCEEDED', 402);
    return error('SUBMIT_FAILED', 400);
  }
}

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Access control: only owner/team members
    const form = await prisma.form.findUnique({
      where: { id: params.id },
      select: { userId: true },
    });
    if (!form) return new Response(JSON.stringify({ error: 'NOT_FOUND' }), { status: 404 });

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { requireFormAccess } = require('@/lib/rbac');
    await requireFormAccess(params.id);

    const submissions = await prisma.submission.findMany({
      where: { formId: params.id },
      orderBy: { createdAt: 'desc' },
      include: {
        answers: {
          include: { field: true },
        },
      },
    });

    return json({ submissions });
  } catch (e: any) {
    if (e.message === 'UNAUTHORIZED') return error('UNAUTHORIZED', 401);
    if (e.message === 'FORBIDDEN') return error('FORBIDDEN', 403);
    return error('SUBMISSIONS_LIST_FAILED', 400);
  }
}


