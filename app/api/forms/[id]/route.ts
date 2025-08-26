import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { requireFormAccess } from '@/lib/rbac';
import { error, json, readJson } from '@/app/api/_utils';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireFormAccess(params.id);
    const form = await prisma.form.findUnique({
      where: { id: params.id },
      include: { fields: { orderBy: { order: 'asc' } }, _count: { select: { submissions: true } } },
    });
    if (!form) return error('NOT_FOUND', 404);
    return json({ form });
  } catch (e: any) {
    if (e.message === 'UNAUTHORIZED') return error('UNAUTHORIZED', 401);
    if (e.message === 'FORBIDDEN') return error('FORBIDDEN', 403);
    return error('FORM_FETCH_FAILED', 400);
  }
}

type UpdateBody = { title?: string; description?: string; isPublished?: boolean; notifyOnSubmit?: boolean };

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireFormAccess(params.id);
    const body = await readJson<UpdateBody>(req);
    const form = await prisma.form.update({
      where: { id: params.id },
      data: {
        title: body.title,
        description: body.description,
        isPublished: body.isPublished,
        notifyOnSubmit: body.notifyOnSubmit,
      },
    });
    return json({ form });
  } catch (e: any) {
    if (e.message === 'UNAUTHORIZED') return error('UNAUTHORIZED', 401);
    if (e.message === 'FORBIDDEN') return error('FORBIDDEN', 403);
    return error('FORM_UPDATE_FAILED', 400);
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireFormAccess(params.id);
    await prisma.form.delete({ where: { id: params.id } });
    return json({ ok: true });
  } catch (e: any) {
    if (e.message === 'UNAUTHORIZED') return error('UNAUTHORIZED', 401);
    if (e.message === 'FORBIDDEN') return error('FORBIDDEN', 403);
    return error('FORM_DELETE_FAILED', 400);
  }
}


