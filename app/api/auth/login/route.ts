import { NextRequest } from 'next/server';
import { authenticateUser, createAuthSession } from '@/lib/auth';
import { error, json, readJson } from '@/app/api/_utils';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = req.headers.get('x-forwarded-for') || (req as any).ip || '';
    const rl = await rateLimit(`login:${ip}`, 5, 300);
    if (!rl.ok) return error('RATE_LIMITED', 429);

    const body = await readJson(req) as { email: string; password: string };
    const { email, password } = body;

    if (!email || !password) {
      return error('MISSING_CREDENTIALS', 400);
    }

    const user = await authenticateUser(email, password);
    await createAuthSession(user.id);

    return json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (e: any) {
    console.error('Login error:', e);
    if (e.message === 'INVALID_CREDENTIALS') {
      return error('INVALID_CREDENTIALS', 401);
    }
    return error('INTERNAL_ERROR', 500);
  }
}


