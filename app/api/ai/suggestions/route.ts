import { NextRequest } from 'next/server';
import { generateFieldSuggestions, FormMeta } from '@/lib/openai';
import { requireAuth } from '@/lib/rbac';
import { json, error } from '@/app/api/_utils';

export async function POST(req: NextRequest) {
  try {
    await requireAuth(); // Vérifier l'authentification

    const body = await req.json();
    const { title, description, category }: FormMeta = body;

    if (!title) {
      return error('MISSING_TITLE', 400);
    }

    const formMeta: FormMeta = { title, description, category };
    const suggestions = await generateFieldSuggestions(formMeta);

    return json({ suggestions });
  } catch (e: any) {
    console.error('AI suggestions error:', e);
    return error('INTERNAL_ERROR', 500);
  }
}
