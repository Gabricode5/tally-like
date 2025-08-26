import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not set');
}

export type JwtPayload = {
  sub: string;
  role: 'USER' | 'ADMIN';
  teamId?: string | null;
};

export function signJwt(payload: JwtPayload, expiresIn: string = '7d'): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyJwt<T = JwtPayload>(token: string): T | null {
  try {
    return jwt.verify(token, JWT_SECRET) as T;
  } catch {
    return null;
  }
}


