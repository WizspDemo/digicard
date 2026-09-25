import Link from 'next/link';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/session';
import QRCode from 'qrcode';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function DashboardQrPage() {
  const session = await requireUser();
  if (!session) redirect('/login');
  const user = await prisma.user.findUnique({ where: { id: session.userId }, include: { card: true } });
  if (!user || !user.card) redirect('/dashboard');

  const h = headers();
  const host = h.get('x-forwarded-host') || h.get('host');
  const proto = h.get('x-forwarded-proto') || 'https';
  const cardUrl = `${proto}://${host}/u/${user.card.slug}`;
  const qrDataUrl = await QRCode.toDataURL(cardUrl, { width: 480, margin: 2 });

  return (
    <div className="admin-wrap">
      <div className="admin-header">
        <h1>QR κώδικας</h1>
        <Link href="/dashboard" className="btn secondary">← Πίσω</Link>
      </div>
      <div className="qr-box">
        <img src={qrDataUrl} alt="QR code" style={{ width: 320, height: 320 }} />
        <p style={{ wordBreak: 'break-all' }}>{cardUrl}</p>
        <a className="btn" href={qrDataUrl} download={`${user.card.slug}-qr.png`}>
          Λήψη PNG
        </a>
      </div>
    </div>
  );
}
