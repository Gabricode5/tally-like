import { NextRequest } from 'next/server';
import { clearAuthSession } from '@/lib/auth';
import { json } from '@/app/api/_utils';

export async function POST(req: NextRequest) {
  try {
    clearAuthSession();
    return json({ success: true });
  } catch (e: any) {
    console.error('Logout error:', e);
    return json({ success: true }); // Toujours retourner success même en cas d'erreur
  }
}


