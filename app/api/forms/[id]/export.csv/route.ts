import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { requireFormAccess } from '@/lib/rbac';

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

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  await requireFormAccess(params.id);

  const form = await prisma.form.findUnique({
    where: { id: params.id },
    include: {
      fields: { orderBy: { order: 'asc' } },
      submissions: {
        orderBy: { createdAt: 'desc' },
        include: { answers: true },
      },
    },
  });

  if (!form) {
    return new Response('NOT_FOUND', { status: 404 });
  }

  const headersRow = ['Submission ID', 'Created At', ...form.fields.map((f) => f.label)];
  const rows: string[] = [toCsvRow(headersRow)];

  for (const s of form.submissions) {
    const byFieldId = new Map(s.answers.map((a) => [a.fieldId, a.value]));
    const row = [
      s.id,
      s.createdAt.toISOString(),
      ...form.fields.map((f) => byFieldId.get(f.id) ?? ''),
    ];
    rows.push(toCsvRow(row));
  }

  const csv = rows.join('\n');

  return new Response(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="form_${form.id}_submissions.csv"`,
    },
  });
}


