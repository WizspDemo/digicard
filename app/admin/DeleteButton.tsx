'use client';

import { useRouter } from 'next/navigation';

export default function DeleteButton({ id }: { id: string }) {
  const router = useRouter();
  async function onDelete() {
    if (!confirm('Διαγραφή αυτής της κάρτας;')) return;
    const res = await fetch(`/api/cards/${id}`, { method: 'DELETE' });
    if (res.ok) router.refresh();
  }
  return (
    <button className="btn danger" onClick={onDelete} type="button">
      Διαγραφή
    </button>
  );
}
