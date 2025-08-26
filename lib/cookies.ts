import { cookies } from 'next/headers';

const COOKIE_NAME = 'token';

export function setAuthCookie(token: string) {
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearAuthCookie() {
  cookies().delete(COOKIE_NAME);
}

export function getAuthCookie(): string | null {
  return cookies().get(COOKIE_NAME)?.value ?? null;
}


