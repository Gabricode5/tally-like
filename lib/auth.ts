import bcrypt from 'bcryptjs';
import { prisma } from './db';
import { signJwt, verifyJwt, JwtPayload } from './jwt';
import { getAuthCookie, setAuthCookie, clearAuthCookie } from './cookies';

type Role = 'USER' | 'ADMIN';

export async function registerUser(email: string, password: string, name?: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error('EMAIL_ALREADY_EXISTS');
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: 'USER' as Role,
    },
  });

  return user;
}

export async function authenticateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('INVALID_CREDENTIALS');
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error('INVALID_CREDENTIALS');
  }

  return user;
}

export async function getCurrentUser(): Promise<any> {
  const token = getAuthCookie();
  if (!token) return null;

  try {
    const payload = await verifyJwt(token);
    if (!payload || !payload.sub) return null;
    
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        stripeCustomerId: true,
      },
    });
    return user;
  } catch (error) {
    return null;
  }
}

export async function createAuthSession(userId: string) {
  const token = await signJwt({ sub: userId, role: 'USER' as Role });
  setAuthCookie(token);
}

export async function clearAuthSession() {
  clearAuthCookie();
}


