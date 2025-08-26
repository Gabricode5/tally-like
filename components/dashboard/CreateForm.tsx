"use client";
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  async function create() {
    if (!title.trim()) return;
    const res = await fetch('/api/forms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    if (res.ok) {
      const json = await res.json();
      router.push(`/dashboard/forms/${json.form.id}`);
    }
  }

  return (
    <div>
      <button
        className="px-3 py-2 bg-black text-white rounded"
        onClick={() => setOpen(true)}
      >
        Nouveau formulaire
      </button>
      {open && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow p-4 w-full max-w-sm">
            <h3 className="font-medium mb-2">Créer un formulaire</h3>
            <input
              className="w-full border rounded px-3 py-2 mb-3"
              placeholder="Titre"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button className="px-3 py-2" onClick={() => setOpen(false)}>Annuler</button>
              <button
                className="px-3 py-2 bg-black text-white rounded disabled:opacity-60"
                disabled={pending}
                onClick={() => startTransition(create)}
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


