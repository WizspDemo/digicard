import Link from 'next/link';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/session';
import DeleteButton from './DeleteButton';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const session = await requireUser();
  if (!session || session.role !== 'ADMIN') redirect('/login');
  const me = await prisma.user.findUnique({ where: { id: session.userId } });
  if (me?.mustChangePassword) redirect('/change-password');

  const cards = await prisma.card.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className="admin-wrap">
      <div className="admin-header">
        <h1>Κάρτες ({cards.length})</h1>
        <div className="actions-row">
          <Link href="/admin/users" className="btn secondary">👥 Χρήστες</Link>
          <Link href="/admin/new" className="btn">+ Νέα κάρτα</Link>
          <form action="/api/auth/logout" method="post">
            <LogoutButton />
          </form>
        </div>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Όνομα</th>
              <th>Εταιρεία</th>
              <th>Slug</th>
              <th>Ενέργειες</th>
            </tr>
          </thead>
          <tbody>
            {cards.map((c) => (
              <tr key={c.id}>
                <td>{c.fullName}</td>
                <td>{c.company || '—'}</td>
                <td>
                  <a href={`/u/${c.slug}`} target="_blank" rel="noreferrer">/u/{c.slug}</a>
                </td>
                <td className="actions-row">
                  <Link href={`/admin/${c.id}`} className="btn secondary">Επεξεργασία</Link>
                  <Link href={`/admin/${c.id}/qr`} className="btn secondary">QR</Link>
                  <DeleteButton id={c.id} />
                </td>
              </tr>
            ))}
            {cards.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', color: '#999' }}>
                  Δεν υπάρχουν κάρτες ακόμα.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LogoutButton() {
  return (
    <button className="btn secondary" type="submit" formAction="/api/auth/logout">
      Αποσύνδεση
    </button>
  );
}
