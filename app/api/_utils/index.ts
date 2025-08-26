import { NextRequest, NextResponse } from 'next/server';

export function json(data: unknown, init?: number | ResponseInit) {
  const status = typeof init === 'number' ? init : (init as ResponseInit | undefined)?.status ?? 200;
  const headers = new Headers(typeof init === 'object' ? (init as ResponseInit).headers : undefined);
  headers.set('Content-Type', 'application/json; charset=utf-8');
  return new NextResponse(JSON.stringify(data), {
    status,
    headers,
  });
}

export function error(message: string, status: number = 400) {
  return json({ error: message }, status);
}

export async function readJson<T>(req: NextRequest): Promise<T> {
  try {
    return (await req.json()) as T;
  } catch {
    throw new Error('INVALID_JSON');
  }
}


