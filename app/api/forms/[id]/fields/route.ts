import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { requireFormAccess } from '@/lib/rbac';
import { error, json, readJson } from '@/app/api/_utils';
import { FieldType } from '@prisma/client';

type FieldInput = {
  id?: string;
  label: string;
  type: FieldType;
  required?: boolean;
  order: number;
  options?: string[] | null;
};

type Body = { fields: FieldInput[] };

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireFormAccess(params.id);
    const body = await readJson<Body>(req);

    await prisma.$transaction(async (tx) => {
      await tx.field.deleteMany({ where: { formId: params.id } });
      if (body.fields?.length) {
        await tx.field.createMany({
          data: body.fields.map((f) => ({
            formId: params.id,
            label: f.label,
            type: f.type,
            required: !!f.required,
            order: f.order,
            optionsJson: f.options ? JSON.stringify(f.options) : null,
          })),
        });
      }
    });

    const fields = await prisma.field.findMany({
      where: { formId: params.id },
      orderBy: { order: 'asc' },
    });

    return json({ fields });
  } catch (e: any) {
    if (e.message === 'UNAUTHORIZED') return error('UNAUTHORIZED', 401);
    if (e.message === 'FORBIDDEN') return error('FORBIDDEN', 403);
    return error('FIELDS_UPDATE_FAILED', 400);
  }
}


