import bcrypt from 'bcryptjs';
import { prisma } from './db';
import { signJwt, verifyJwt, JwtPayload } from './jwt';
import { getAuthCookie, setAuthCookie, clearAuthCookie } from './cookies';
import { Role } from '@prisma/client';

export async function registerUser(email: string, password: string, name?: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error('EMAIL_IN_USE');
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, passwordHash, name, role: Role.USER },
  });
  const token = signJwt({ sub: user.id, role: user.role });
  setAuthCookie(token);
  return sanitizeUser(user);
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('INVALID_CREDENTIALS');
  }
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    throw new Error('INVALID_CREDENTIALS');
  }
  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  const token = signJwt({ sub: user.id, role: user.role });
  setAuthCookie(token);
  return sanitizeUser(user);
}

export function logoutUser() {
  clearAuthCookie();
}

export function getAuthUserId(): string | null {
  const token = getAuthCookie();
  if (!token) return null;
  const payload = verifyJwt<JwtPayload>(token);
  return payload?.sub ?? null;
}

export async function getCurrentUser() {
  const userId = getAuthUserId();
  if (!userId) return null;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user ? sanitizeUser(user) : null;
}

export type SafeUser = {
  id: string;
  email: string;
  name: string | null;
  role: 'USER' | 'ADMIN';
};

function sanitizeUser(user: { id: string; email: string; name: string | null; role: Role }): SafeUser {
  return { id: user.id, email: user.email, name: user.name, role: user.role };
}


