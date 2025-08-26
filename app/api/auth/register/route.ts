import { NextRequest } from 'next/server';
import { registerUser } from '@/lib/auth';
import { error, json, readJson } from '@/app/api/_utils';

type Body = { email: string; password: string; name?: string };

export async function POST(req: NextRequest) {
  try {
    const body = await readJson<Body>(req);
    if (!body.email || !body.password) return error('MISSING_FIELDS', 422);
    const user = await registerUser(body.email.toLowerCase(), body.password, body.name);
    return json({ user }, 201);
  } catch (e: any) {
    if (e.message === 'EMAIL_IN_USE') return error('EMAIL_IN_USE', 409);
    return error('REGISTER_FAILED', 400);
  }
}


