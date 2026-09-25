import Link from 'next/link';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/session';
import CardForm from '@/app/components/CardForm';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await requireUser();
  if (!session) redirect('/login');

  const user = await prisma.user.findUnique({ where: { id: session.userId }, include: { card: true } });
  if (!user) redirect('/login');
  if (user.mustChangePassword) redirect('/change-password');
  if (user.role === 'ADMIN') redirect('/admin');
  if (!user.card) {
    return (
      <div className="admin-wrap">
        <p>Δεν έχει δημιουργηθεί ακόμα κάρτα για τον λογαριασμό σου. Επικοινώνησε με τον διαχειριστή.</p>
      </div>
    );
  }

  return (
    <div className="admin-wrap">
      <div className="admin-header">
        <h1>Η κάρτα μου</h1>
        <div className="actions-row">
          <Link href={`/u/${user.card.slug}`} target="_blank" className="btn secondary">
            Προεπισκόπηση
          </Link>
          <Link href={`/dashboard/qr`} className="btn secondary">
            QR κώδικας
          </Link>
          <form action="/api/auth/logout" method="post">
            <button className="btn secondary" type="submit" formAction="/api/auth/logout">
              Αποσύνδεση
            </button>
          </form>
        </div>
      </div>
      <div className="slug-row" style={{ marginBottom: 16, marginTop: -8 }}>
        Δημόσιος σύνδεσμος κάρτας: <a href={`/u/${user.card.slug}`} target="_blank" rel="noreferrer">/u/{user.card.slug}</a>
      </div>
      <div className="form-card">
        <CardForm initial={user.card} hideSlug />
      </div>
    </div>
  );
}
