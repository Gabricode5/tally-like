import http, { IncomingMessage, ServerResponse } from 'http';
import supertest from 'supertest';
import { NextRequest } from 'next/server';

// Import route handlers
import { POST as registerPOST } from '@/app/api/auth/register/route';
import { POST as loginPOST } from '@/app/api/auth/login/route';
import { GET as meGET } from '@/app/api/auth/me/route';
import { POST as formsPOST, GET as formsGET } from '@/app/api/forms/route';
import { GET as formGET, PATCH as formPATCH } from '@/app/api/forms/[id]/route';
import { PUT as fieldsPUT } from '@/app/api/forms/[id]/fields/route';
import { POST as submissionsPOST, GET as submissionsGET } from '@/app/api/forms/[id]/submissions/route';
import { GET as exportCSVGET } from '@/app/api/forms/[id]/export.csv/route';

// Mock sendEmail to ensure no external calls and no throws
jest.mock('@/lib/email', () => {
  const actual = jest.requireActual('@/lib/email');
  return { ...actual, sendEmail: jest.fn(async () => undefined) };
});

// Cookie jar and next/headers mock to emulate Next cookies() in App Router
type CookieRecord = Record<string, string>;
const cookieJar: CookieRecord = {};
let pendingSetCookies: string[] = [];

jest.mock('next/headers', () => {
  return {
    cookies: () => ({
      get(name: string) {
        const value = cookieJar[name];
        return value ? { name, value } : undefined;
      },
      getAll() {
        return Object.entries(cookieJar).map(([name, value]) => ({ name, value }));
      },
      set(name: string, value: string, _options?: any) {
        cookieJar[name] = value;
        // emulate Set-Cookie header
        pendingSetCookies.push(`${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax`);
      },
      delete(name: string) {
        delete cookieJar[name];
        pendingSetCookies.push(`${name}=; Path=/; Max-Age=0`);
      },
    }),
    headers: () => new Map(),
  };
});

function parseCookiesHeader(header?: string | null) {
  if (!header) return;
  const parts = header.split(';');
  for (const p of parts) {
    const [k, v] = p.trim().split('=');
    if (k && v !== undefined) cookieJar[k] = decodeURIComponent(v);
  }
}

async function readBody(req: IncomingMessage): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

function toNextRequest(nodeReq: IncomingMessage, body?: Buffer): NextRequest {
  const url = `http://localhost${nodeReq.url}`;
  const headers = new Headers();
  for (const [k, v] of Object.entries(nodeReq.headers)) {
    if (Array.isArray(v)) headers.set(k, v.join(', '));
    else if (v) headers.set(k, v as string);
  }
  let stream: ReadableStream | undefined;
  if (body && body.length > 0) {
    stream = new ReadableStream({
      start(controller) {
        controller.enqueue(body);
        controller.close();
      },
    });
  }
  return new NextRequest(url, { method: nodeReq.method, headers, body: stream as any });
}

function sendNode(res: ServerResponse, nextRes: Response) {
  // apply Set-Cookie from our mock
  for (const sc of pendingSetCookies) {
    res.appendHeader('Set-Cookie', sc);
  }
  pendingSetCookies = [];
  // copy headers
  nextRes.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });
  res.statusCode = nextRes.status;
  return nextRes.arrayBuffer().then((buf) => {
    res.end(Buffer.from(buf));
  });
}

function match(pathname: string | undefined, pattern: RegExp): RegExpExecArray | null {
  if (!pathname) return null;
  return pattern.exec(pathname);
}

function createServer() {
  return http.createServer(async (req, res) => {
    try {
      // Reset pending set-cookies per request
      pendingSetCookies = [];
      // Load incoming cookies into jar
      parseCookiesHeader(req.headers['cookie'] as string | undefined);

      const body = await readBody(req);
      const nextReq = toNextRequest(req, body);
      const url = new URL(nextReq.url);
      const { pathname } = url;

      if (req.method === 'POST' && pathname === '/api/auth/register') return sendNode(res, await registerPOST(nextReq));
      if (req.method === 'POST' && pathname === '/api/auth/login') return sendNode(res, await loginPOST(nextReq));
      if (req.method === 'GET' && pathname === '/api/auth/me') return sendNode(res, await meGET());

      if (req.method === 'GET' && pathname === '/api/forms') return sendNode(res, await formsGET());
      if (req.method === 'POST' && pathname === '/api/forms') return sendNode(res, await formsPOST(nextReq));

      let m = match(pathname, /^\/api\/forms\/([^\/]+)$/);
      if (m) {
        const id = m[1];
        if (req.method === 'GET') return sendNode(res, await formGET(nextReq, { params: { id } } as any));
        if (req.method === 'PATCH') return sendNode(res, await formPATCH(nextReq, { params: { id } } as any));
      }

      m = match(pathname, /^\/api\/forms\/([^\/]+)\/fields$/);
      if (m && req.method === 'PUT') {
        const id = m[1];
        return sendNode(res, await fieldsPUT(nextReq, { params: { id } } as any));
      }

      m = match(pathname, /^\/api\/forms\/([^\/]+)\/submissions$/);
      if (m) {
        const id = m[1];
        if (req.method === 'POST') return sendNode(res, await submissionsPOST(nextReq, { params: { id } } as any));
        if (req.method === 'GET') return sendNode(res, await submissionsGET(nextReq, { params: { id } } as any));
      }

      m = match(pathname, /^\/api\/forms\/([^\/]+)\/export\.csv$/);
      if (m && req.method === 'GET') {
        const id = m[1];
        return sendNode(res, await exportCSVGET(nextReq, { params: { id } } as any));
      }

      res.statusCode = 404;
      res.end('Not found');
    } catch (e: any) {
      res.statusCode = 500;
      res.end('Server error');
    }
  });
}

describe('E2E API routes (cookies-aware)', () => {
  const server = createServer();
  const request = supertest.agent(server);
  const uniqueEmail = `e2e_${Date.now()}@test.com`;
  let formId = '';
  let csvExpectedSnippet = '';

  beforeAll((done) => server.listen(0, done));
  afterAll((done) => server.close(done));

  it('POST /api/auth/register → 201', async () => {
    const res = await request.post('/api/auth/register').send({ email: uniqueEmail, password: 'password123' });
    expect(res.status).toBe(201);
    expect(res.body?.user?.email).toBe(uniqueEmail.toLowerCase());
  });

  it('POST /api/auth/login → set-cookie', async () => {
    const res = await request.post('/api/auth/login').send({ email: uniqueEmail, password: 'password123' });
    expect(res.status).toBe(200);
    const setCookie = res.headers['set-cookie'];
    expect(Array.isArray(setCookie) || typeof setCookie === 'string').toBeTruthy();
  });

  it('POST /api/auth/login (bad password) → 401', async () => {
    const res = await request.post('/api/auth/login').send({ email: uniqueEmail, password: 'wrong' });
    expect(res.status).toBe(401);
    expect(res.body?.error).toBe('INVALID_CREDENTIALS');
  });

  it('GET /api/auth/me with cookie → 200', async () => {
    const res = await request.get('/api/auth/me');
    expect(res.status).toBe(200);
    expect(res.body?.user?.email).toBe(uniqueEmail.toLowerCase());
  });

  it('POST /api/forms → 201', async () => {
    const res = await request.post('/api/forms').send({ title: 'E2E Form' });
    expect(res.status).toBe(201);
    expect(res.body.form.title).toBe('E2E Form');
    formId = res.body.form.id;
  });

  it('GET /api/forms/[id] sans auth → 401', async () => {
    // Simulate logout by clearing our cookie jar
    for (const k of Object.keys(cookieJar)) delete cookieJar[k];
    const res = await request.get(`/api/forms/${formId}`);
    expect(res.status).toBe(401);
    expect(res.body?.error).toBe('UNAUTHORIZED');
  });

  it('Re-login to proceed', async () => {
    const res = await request.post('/api/auth/login').send({ email: uniqueEmail, password: 'password123' });
    expect(res.status).toBe(200);
  });

  it('PUT /api/forms/[id]/fields → 200', async () => {
    const res = await request.put(`/api/forms/${formId}/fields`).send({
      fields: [
        { label: 'Text', type: 'TEXT', required: true, order: 1 },
        { label: 'Email', type: 'EMAIL', required: true, order: 2 },
      ],
    });
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.fields)).toBe(true);
    expect(res.body.fields.length).toBe(2);
  });

  it('POST /api/forms/[id]/submissions → 201', async () => {
    const res = await request.post(`/api/forms/${formId}/submissions`).send({ Text: 'Hello', Email: 'a@b.com' });
    expect(res.status).toBe(201);
    expect(typeof res.body.submissionId).toBe('string');
  });

  it('POST /api/forms/[id]/submissions au-delà du quota FREE → 403/402', async () => {
    // Simulate hitting quota quickly in test by creating many submissions
    let statusOver: number | null = null;
    for (let i = 0; i < 60; i++) {
      const r = await request.post(`/api/forms/${formId}/submissions`).send({ Text: `N${i}`, Email: `n${i}@b.com` });
      if (r.status === 402 || r.status === 403) { statusOver = r.status; break; }
    }
    expect([402, 403]).toContain(statusOver as number);
  });

  it('GET /api/forms/[id]/submissions → 200', async () => {
    const res = await request.get(`/api/forms/${formId}/submissions`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.submissions)).toBe(true);
    const first = res.body.submissions[0];
    expect(first).toBeTruthy();
    const answers = first.answers as Array<{ value: string; field: { label: string } }>;
    const byLabel = new Map(answers.map((a) => [a.field.label, a.value]));
    expect(byLabel.get('Text')).toBe('Hello');
    expect(byLabel.get('Email')).toBe('a@b.com');
    csvExpectedSnippet = `Submission ID,Created At,Text,Email`;
  });

  it('GET /api/forms/[id]/export.csv → text/csv', async () => {
    const res = await request.get(`/api/forms/${formId}/export.csv`);
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/text\/csv/);
    expect(typeof res.text).toBe('string');
    expect(res.text.split('\n')[0]).toBe(csvExpectedSnippet);
    expect(res.text).toMatch(/Hello/);
    expect(res.text).toMatch(/a@b\.com/);
  });
});


