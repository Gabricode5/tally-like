import { NextRequest } from 'next/server';
import { generateFieldSuggestions, FormMeta } from '@/lib/openai';
import { requireAuth } from '@/lib/rbac';
import { json, error } from '@/app/api/_utils';

export async function POST(req: NextRequest) {
  try {
    await requireAuth();

    const body = await req.json();
    const { title, description }: FormMeta = body;

    if (!title) {
      return error('MISSING_TITLE', 400);
    }

    const suggestions = await generateFieldSuggestions({ title, description });
    return json(suggestions);
  } catch (e: any) {
    console.error('AI suggestions error:', e);
    if (e.message === 'UNAUTHORIZED') return error('UNAUTHORIZED', 401);
    return error('INTERNAL_ERROR', 500);
  }
}
