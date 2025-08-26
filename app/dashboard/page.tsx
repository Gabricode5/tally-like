import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import CreateForm from '@/components/dashboard/CreateForm';

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const forms = await prisma.form.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { submissions: true } } },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <CreateForm />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {forms.map((f) => (
          <Link key={f.id} href={`/dashboard/forms/${f.id}`} className="border rounded p-4 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{f.title}</h2>
              <span className="text-sm text-gray-500">{f._count.submissions} submissions</span>
            </div>
            {f.description && <p className="text-sm text-gray-600 mt-2">{f.description}</p>}
            <div className="mt-2 text-xs text-gray-400">{new Date(f.createdAt).toLocaleString()}</div>
          </Link>
        ))}
        {forms.length === 0 && (
          <div className="col-span-full text-center text-gray-500 border rounded p-8">
            Aucun formulaire. Créez votre premier formulaire.
          </div>
        )}
      </div>
    </div>
  );
}


