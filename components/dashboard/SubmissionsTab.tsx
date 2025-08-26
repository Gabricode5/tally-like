"use client";
import useSWR from 'swr';
import { useMemo, useState } from 'react';

async function fetcher(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed');
  return res.json();
}

export default function SubmissionsTab({ formId }: { formId: string }) {
  const { data, error, isLoading } = useSWR(`/api/forms/${formId}/submissions`, fetcher, { refreshInterval: 15000 });
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const submissions = (data?.submissions ?? []) as Array<{ id: string; createdAt: string; answers: Array<{ value: string; field: { label: string } }> }>;

  const rows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return submissions.slice(start, start + pageSize);
  }, [submissions, page]);

  if (isLoading) return <div className="text-sm text-gray-500">Chargement…</div>;
  if (error) return <div className="text-sm text-red-600">Erreur de chargement</div>;

  return (
    <div className="border rounded p-4">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600">
              <th className="py-2 pr-4">ID</th>
              <th className="py-2 pr-4">Date</th>
              <th className="py-2">Réponses</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="py-2 pr-4 font-mono text-xs">{s.id}</td>
                <td className="py-2 pr-4">{new Date(s.createdAt).toLocaleString()}</td>
                <td className="py-2">
                  <div className="space-y-1">
                    {s.answers.map((a, i) => (
                      <div key={i} className="text-gray-700">
                        <span className="text-gray-500 mr-1">{a.field.label}:</span>
                        <span>{a.value}</span>
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={3} className="py-8 text-center text-gray-500">Aucune réponse</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-end gap-2 mt-4">
        <button className="px-3 py-1 border rounded disabled:opacity-50" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Précédent</button>
        <span className="text-sm text-gray-600">Page {page}</span>
        <button className="px-3 py-1 border rounded disabled:opacity-50" disabled={submissions.length <= page * pageSize} onClick={() => setPage((p) => p + 1)}>Suivant</button>
      </div>
    </div>
  );
}


