import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/rbac';
import { prisma } from '@/lib/db';
import FormBuilder from '@/components/dashboard/FormBuilder';
import SubmissionsTab from '@/components/dashboard/SubmissionsTab';
import Analytics from '@/components/dashboard/Analytics';

async function updateForm(formId: string, data: any) {
  'use server';
  
  const userId = await requireAuth();
  
  // Vérifier que l'utilisateur a accès au formulaire
  const form = await prisma.form.findUnique({
    where: { id: formId },
    select: { userId: true },
  });
  
  if (!form || form.userId !== userId) {
    throw new Error('Forbidden');
  }
  
  // Mettre à jour les métadonnées du formulaire
  await prisma.form.update({
    where: { id: formId },
    data: {
      title: data.title,
      description: data.description,
    },
  });
  
  // Mettre à jour les champs
  await prisma.field.deleteMany({ where: { formId } });
  
  if (data.fields.length > 0) {
    await prisma.field.createMany({
      data: data.fields.map((field: any) => ({
        formId,
        type: field.type,
        label: field.label,
        required: field.required,
        order: field.order,
        optionsJson: field.options ? JSON.stringify(field.options) : null,
      })),
    });
  }
}

export default async function FormPage({ params }: { params: { id: string } }) {
  const userId = await requireAuth();
  
  const form = await prisma.form.findUnique({
    where: { id: params.id },
    include: {
      fields: { orderBy: { order: 'asc' } },
      submissions: {
        include: { answers: { include: { field: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!form || form.userId !== userId) {
    redirect('/dashboard');
  }

  const initialData = {
    title: form.title,
    description: form.description || '',
    fields: form.fields.map((field: any) => ({
      id: field.id,
      type: field.type,
      label: field.label,
      required: field.required,
      order: field.order,
      options: field.optionsJson ? JSON.parse(field.optionsJson) : undefined,
    })),
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{form.title}</h1>
        <p className="text-gray-600 mt-2">
          {form.submissions.length} soumission{form.submissions.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="font-medium">Builder</h2>
          <FormBuilder 
            formId={form.id}
            initialData={initialData}
            onSave={async (data) => {
              await updateForm(form.id, data);
            }}
          />
        </div>
        <div className="space-y-4">
          <h2 className="font-medium">Submissions</h2>
          <SubmissionsTab formId={form.id} />
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-medium mb-4">Analytics</h2>
        <Analytics formId={form.id} />
      </div>
    </div>
  );
}


