import { logoutUser } from '@/lib/auth';
import { json } from '@/app/api/_utils';

export async function POST() {
  logoutUser();
  return json({ ok: true });
}


