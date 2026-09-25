import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { buildVCard } from '@/lib/vcard';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const card = await prisma.card.findUnique({ where: { slug: params.slug } });
  if (!card) return notFound();

  const h = headers();
  const host = h.get('x-forwarded-host') || h.get('host');
  const proto = h.get('x-forwarded-proto') || 'https';
  const baseUrl = `${proto}://${host}`;

  const vcard = buildVCard(card, baseUrl);
  return new Response(vcard, {
    status: 200,
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': `attachment; filename="${card.slug}.vcf"`
    }
  });
}
