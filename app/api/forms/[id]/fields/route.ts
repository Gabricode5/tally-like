import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { requireFormAccess } from '@/lib/rbac';
import { error, json, readJson } from '@/app/api/_utils';

type FieldType = 'TEXT' | 'EMAIL' | 'NUMBER' | 'TEXTAREA' | 'SELECT' | 'CHECKBOX' | 'RADIO';

type FieldInput = {
  id?: string;
  type: FieldType;
  label: string;
  required: boolean;
  order: number;
  options?: string[];
};

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireFormAccess(params.id);
    const { fields }: { fields: FieldInput[] } = await readJson(req);

    // Supprimer tous les champs existants
    await prisma.field.deleteMany({ where: { formId: params.id } });

    // Créer les nouveaux champs
    const createdFields = await Promise.all(
      fields.map((field) =>
        prisma.field.create({
          data: {
            formId: params.id,
            type: field.type,
            label: field.label,
            required: field.required,
            order: field.order,
            optionsJson: field.options ? JSON.stringify(field.options) : null,
          },
        })
      )
    );

    return json(createdFields);
  } catch (e: any) {
    console.error('Fields update error:', e);
    if (e.message === 'FORBIDDEN') return error('FORBIDDEN', 403);
    if (e.message === 'NOT_FOUND') return error('NOT_FOUND', 404);
    return error('INTERNAL_ERROR', 500);
  }
}


