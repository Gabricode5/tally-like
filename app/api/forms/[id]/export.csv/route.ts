import { NextRequest } from 'next/server';
import { requireFormAccess } from '@/lib/rbac';
import { prisma } from '@/lib/db';
import { error } from '@/app/api/_utils';

function toCsvRow(values: string[]): string {
  return values
    .map((value) => {
      const escaped = value.replace(/"/g, '""');
      return `"${escaped}"`;
    })
    .join(',');
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireFormAccess(params.id);

    const form = await prisma.form.findUnique({
      where: { id: params.id },
      include: {
        fields: { orderBy: { order: 'asc' } },
        submissions: {
          include: {
            answers: {
              include: {
                field: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!form) {
      return error('NOT_FOUND', 404);
    }

    const headersRow = ['Submission ID', 'Created At', ...form.fields.map((f: any) => f.label)];
    const rows: string[] = [toCsvRow(headersRow)];

    for (const s of form.submissions) {
      const row: string[] = [s.id, s.createdAt.toISOString()];
      
      for (const field of form.fields) {
        const answer = s.answers.find((a: any) => a.fieldId === field.id);
        row.push(answer ? answer.value : '');
      }
      
      rows.push(toCsvRow(row));
    }

    const csv = rows.join('\n');
    const filename = `${form.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_submissions.csv`;

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (e: any) {
    console.error('CSV export error:', e);
    if (e.message === 'FORBIDDEN') return error('FORBIDDEN', 403);
    if (e.message === 'NOT_FOUND') return error('NOT_FOUND', 404);
    return error('INTERNAL_ERROR', 500);
  }
}


