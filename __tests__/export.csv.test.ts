import { prisma } from '@/lib/db';

function toCsvRow(values: string[]): string {
  const escaped = values.map((v) => {
    const s = v ?? '';
    if (s.includes('"') || s.includes(',') || s.includes('\n')) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  });
  return escaped.join(',');
}

describe('csv export util (local parity)', () => {
  it('escapes properly', () => {
    const row = toCsvRow(['a', 'b,c', 'd"e', 'f\ng']);
    expect(row).toBe('a,"b,c","d""e","f\ng"');
  });

  it('db connectivity (noop)', async () => {
    // Just ensure prisma client can instantiate
    const count = await prisma.user.count();
    expect(typeof count).toBe('number');
  });
});


