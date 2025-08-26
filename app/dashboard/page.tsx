import Link from 'next/link';
import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/rbac';
import { prisma } from '@/lib/db';
import CreateForm from '@/components/dashboard/CreateForm';

export default async function DashboardPage() {
  const userId = await requireAuth();
  
  const forms = await prisma.form.findMany({
    where: { userId },
    include: {
      _count: {
        select: { submissions: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Mes Formulaires</h1>
        <CreateForm />
      </div>

      {forms.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Vous n'avez pas encore créé de formulaire.</p>
          <CreateForm />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {forms.map((f: any) => (
            <Link key={f.id} href={`/dashboard/forms/${f.id}`} className="border rounded p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <h2 className="font-medium">{f.title}</h2>
                <span className="text-sm text-gray-500">
                  {f._count.submissions} réponses
                </span>
              </div>
              {f.description && (
                <p className="text-sm text-gray-600 mt-1">{f.description}</p>
              )}
              <div className="text-xs text-gray-400 mt-2">
                Créé le {new Date(f.createdAt).toLocaleDateString()}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}


