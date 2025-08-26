import { NextRequest } from 'next/server';
import { POST as webhookHandler } from '@/app/api/billing/webhook/route';

function makeRequest(body: any, signature?: string): NextRequest {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(JSON.stringify(body)));
      controller.close();
    },
  });
  return new NextRequest('http://localhost/api/billing/webhook', {
    method: 'POST',
    body: stream as unknown as BodyInit,
    headers: signature ? { 'stripe-signature': signature } as any : undefined,
  });
}

describe('billing webhook', () => {
  it('rejects invalid signature', async () => {
    const req = makeRequest({ type: 'test' }, 'invalid');
    const res = await webhookHandler(req);
    expect(res.status).toBe(400);
  });
});


