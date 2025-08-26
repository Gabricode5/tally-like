import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/rbac';
import { error, json, readJson } from '@/app/api/_utils';

export async function GET() {
  try {
    const userId = await requireAuth();
    const forms = await prisma.form.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { submissions: true } },
      },
    });
    return json({ forms });
  } catch (e: any) {
    if (e.message === 'UNAUTHORIZED') return error('UNAUTHORIZED', 401);
    return error('FORMS_LIST_FAILED', 400);
  }
}

type CreateBody = { title: string; description?: string };

export async function POST(req: NextRequest) {
  try {
    const userId = await requireAuth();
    const body = await readJson<CreateBody>(req);
    if (!body.title) return error('MISSING_TITLE', 422);
    const form = await prisma.form.create({
      data: { title: body.title, description: body.description, userId },
    });
    return json({ form }, 201);
  } catch (e: any) {
    if (e.message === 'UNAUTHORIZED') return error('UNAUTHORIZED', 401);
    return error('FORM_CREATE_FAILED', 400);
  }
}


