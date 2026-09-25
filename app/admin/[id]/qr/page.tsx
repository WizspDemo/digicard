import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import QRCode from 'qrcode';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function QrPage({ params }: { params: { id: string } }) {
  const card = await prisma.card.findUnique({ where: { id: params.id } });
  if (!card) notFound();

  const h = headers();
  const host = h.get('x-forwarded-host') || h.get('host');
  const proto = h.get('x-forwarded-proto') || 'https';
  const cardUrl = `${proto}://${host}/u/${card.slug}`;
  const qrDataUrl = await QRCode.toDataURL(cardUrl, { width: 480, margin: 2 });

  return (
    <div className="admin-wrap">
      <div className="admin-header">
        <h1>QR κώδικας</h1>
        <Link href="/admin" className="btn secondary">← Πίσω</Link>
      </div>
      <div className="qr-box">
        <img src={qrDataUrl} alt="QR code" style={{ width: 320, height: 320 }} />
        <p style={{ wordBreak: 'break-all' }}>{cardUrl}</p>
        <a className="btn" href={qrDataUrl} download={`${card.slug}-qr.png`}>
          Λήψη PNG
        </a>
      </div>
    </div>
  );
}
