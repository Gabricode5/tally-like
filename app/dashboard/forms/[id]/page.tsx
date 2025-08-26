import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { requireFormAccess } from '@/lib/rbac';
import { redirect } from 'next/navigation';
import FormBuilder from '@/components/dashboard/FormBuilder';
import SubmissionsTab from '@/components/dashboard/SubmissionsTab';

export default async function FormDetailPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  await requireFormAccess(params.id);

  const form = await prisma.form.findUnique({
    where: { id: params.id },
    include: { fields: { orderBy: { order: 'asc' } } },
  });
  if (!form) redirect('/dashboard');

  const submissionsCount = await prisma.submission.count({ where: { formId: params.id } });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{form.title}</h1>
        <a
          href={`/api/forms/${form.id}/export.csv`}
          className="px-3 py-2 bg-black text-white rounded"
        >
          Exporter CSV
        </a>
      </div>

      <div className="text-sm text-gray-500">{submissionsCount} réponses</div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="font-medium">Builder</h2>
          <FormBuilder form={form} />
        </div>
        <div className="space-y-4">
          <h2 className="font-medium">Submissions</h2>
          <SubmissionsTab formId={form.id} />
        </div>
      </div>
    </div>
  );
}


