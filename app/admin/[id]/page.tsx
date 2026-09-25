import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import CardForm from '../CardForm';

export const dynamic = 'force-dynamic';

export default async function EditCardPage({ params }: { params: { id: string } }) {
  const card = await prisma.card.findUnique({ where: { id: params.id } });
  if (!card) notFound();

  return (
    <div className="admin-wrap">
      <div className="admin-header">
        <h1>Επεξεργασία: {card.fullName}</h1>
        <div className="actions-row">
          <Link href={`/u/${card.slug}`} target="_blank" className="btn secondary">Προεπισκόπηση</Link>
          <Link href="/admin" className="btn secondary">← Πίσω</Link>
        </div>
      </div>
      <div className="form-card">
        <CardForm initial={card} />
      </div>
    </div>
  );
}
