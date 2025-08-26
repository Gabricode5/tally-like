type Counter = { count: number; resetAt: number };

const memoryStore = new Map<string, Counter>();

function getKey(key: string, windowSec: number) {
  const now = Date.now();
  const bucket = Math.floor(now / (windowSec * 1000));
  return `${key}:${bucket}`;
}

export async function rateLimit(key: string, max: number, windowSec: number): Promise<{ ok: boolean; remaining: number; resetAt: number }>
{
  if (process.env.NODE_ENV === 'test') {
    const resetAt = Math.ceil(Date.now() / (windowSec * 1000)) * (windowSec * 1000);
    return { ok: true, remaining: 999999, resetAt };
  }
  const storeKey = getKey(key, windowSec);
  const now = Date.now();
  const resetAt = Math.ceil(now / (windowSec * 1000)) * (windowSec * 1000);
  const entry = memoryStore.get(storeKey) ?? { count: 0, resetAt };
  entry.count += 1;
  entry.resetAt = resetAt;
  memoryStore.set(storeKey, entry);
  const ok = entry.count <= max;
  return { ok, remaining: Math.max(0, max - entry.count), resetAt };
}


