import { signJwt, verifyJwt } from '@/lib/jwt';

describe('auth jwt', () => {
  it('signs and verifies', () => {
    const token = signJwt({ sub: 'user_1', role: 'USER' });
    const payload = verifyJwt(token)!;
    expect(payload.sub).toBe('user_1');
    expect(payload.role).toBe('USER');
  });

  it('returns null for invalid token', () => {
    const payload = verifyJwt('invalid');
    expect(payload).toBeNull();
  });
});


