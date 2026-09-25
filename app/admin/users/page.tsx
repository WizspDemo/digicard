import Link from 'next/link';
import { redirect } from 'next/navigation';
import { requireUser } from '@/lib/session';
import UsersManager from './UsersManager';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const session = await requireUser();
  if (!session || session.role !== 'ADMIN') redirect('/login');

  return (
    <div className="admin-wrap">
      <div className="admin-header">
        <h1>Χρήστες</h1>
        <Link href="/admin" className="btn secondary">← Πίσω στις κάρτες</Link>
      </div>
      <UsersManager />
    </div>
  );
}
