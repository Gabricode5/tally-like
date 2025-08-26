import { NextRequest } from 'next/server';
import { analyzeSubmissions } from '@/lib/openai';
import { requireFormAccess } from '@/lib/rbac';
import { prisma } from '@/lib/db';
import { json, error } from '@/app/api/_utils';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireFormAccess(params.id); // Vérifier l'accès au formulaire

    const submissions = await prisma.submission.findMany({
      where: { formId: params.id },
      include: {
        answers: {
          include: {
            field: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const analysis = await analyzeSubmissions(submissions);

    return json(analysis);
  } catch (e: any) {
    console.error('Form analysis error:', e);
    if (e.message === 'FORBIDDEN') return error('FORBIDDEN', 403);
    if (e.message === 'NOT_FOUND') return error('NOT_FOUND', 404);
    return error('INTERNAL_ERROR', 500);
  }
}
