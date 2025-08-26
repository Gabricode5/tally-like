import { NextRequest } from 'next/server';
import { loginUser } from '@/lib/auth';
import { error, json, readJson } from '@/app/api/_utils';
import { rateLimit } from '@/lib/rate-limit';

type Body = { email: string; password: string };

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || (req as any).ip || 'unknown';
    const rl = await rateLimit(`login:${ip}`, 10, 60);
    if (!rl.ok) return error('RATE_LIMITED', 429);
    const body = await readJson<Body>(req);
    if (!body.email || !body.password) return error('MISSING_FIELDS', 422);
    const user = await loginUser(body.email.toLowerCase(), body.password);
    return json({ user });
  } catch (e: any) {
    if (e.message === 'INVALID_CREDENTIALS') return error('INVALID_CREDENTIALS', 401);
    return error('LOGIN_FAILED', 400);
  }
}


