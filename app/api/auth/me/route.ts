import { getCurrentUser } from '@/lib/auth';
import { error, json } from '@/app/api/_utils';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return error('UNAUTHORIZED', 401);
  return json({ user });
}


