import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { requireFormAccess } from '@/lib/rbac';
import { assertSubmissionQuota } from '@/lib/quota';
import { sendEmail } from '@/lib/email';
import { rateLimit } from '@/lib/rate-limit';
import { error, json, readJson } from '@/app/api/_utils';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireFormAccess(params.id);
    const body = await readJson(req) as Record<string, any>;

    const form = await prisma.form.findUnique({
      where: { id: params.id },
      include: { 
        fields: true,
        user: {
          select: { email: true }
        }
      },
    });

    if (!form) return error('NOT_FOUND', 404);

    // Rate limiting
    const ip = req.headers.get('x-forwarded-for') || (req as any).ip || '';
    const rl = await rateLimit(`submit:${form.id}:${ip}`, 20, 60);
    if (!rl.ok) return error('RATE_LIMITED', 429);

    await assertSubmissionQuota(form.id);

    const fieldByLabel = new Map(form.fields.map((f: any) => [f.label, f]));
    const answers = Object.entries(body)
      .map(([label, value]) => {
        const field = fieldByLabel.get(label) as any;
        return field ? { fieldId: field.id, value: String(value ?? '') } : null;
      })
      .filter((answer): answer is { fieldId: string; value: string } => answer !== null);

    const submission = await prisma.submission.create({
      data: {
        formId: params.id,
        answers: { create: answers },
      },
      include: { answers: { include: { field: true } } },
    });

    // Notification email si activée
    if (form.notifyOnSubmit && form.user?.email) {
      try {
        await sendEmail({
          to: form.user.email,
          subject: `Nouvelle soumission sur "${form.title}"`,
          text: `Vous avez reçu une nouvelle soumission sur votre formulaire "${form.title}".`,
          html: `<p>Vous avez reçu une nouvelle soumission sur votre formulaire "<strong>${form.title}</strong>".</p>`,
        });
      } catch (emailError) {
        console.error('Email notification failed:', emailError);
      }
    }

    return json(submission, 201);
  } catch (e: any) {
    console.error('Submission error:', e);
    if (e.message === 'QUOTA_EXCEEDED') return error('QUOTA_EXCEEDED', 402);
    if (e.message === 'FORBIDDEN') return error('FORBIDDEN', 403);
    if (e.message === 'NOT_FOUND') return error('NOT_FOUND', 404);
    return error('INTERNAL_ERROR', 500);
  }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireFormAccess(params.id);

    const submissions = await prisma.submission.findMany({
      where: { formId: params.id },
      include: {
        answers: {
          include: { field: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return json(submissions);
  } catch (e: any) {
    console.error('Submissions fetch error:', e);
    if (e.message === 'FORBIDDEN') return error('FORBIDDEN', 403);
    if (e.message === 'NOT_FOUND') return error('NOT_FOUND', 404);
    return error('INTERNAL_ERROR', 500);
  }
}


