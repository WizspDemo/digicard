import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const card = await prisma.card.findUnique({ where: { slug: params.slug } });
  if (!card) return {};
  return {
    title: `${card.fullName}${card.company ? ' · ' + card.company : ''}`,
    description: card.jobTitle || 'Ψηφιακή επαγγελματική κάρτα'
  };
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
}

export default async function CardPage({ params }: { params: { slug: string } }) {
  const card = await prisma.card.findUnique({ where: { slug: params.slug } });
  if (!card) notFound();

  const items: { label: string; value: string; href: string; icon: string }[] = [];
  if (card.phone) items.push({ label: 'Τηλέφωνο', value: card.phone, href: `tel:${card.phone}`, icon: '📞' });
  if (card.email) items.push({ label: 'Email', value: card.email, href: `mailto:${card.email}`, icon: '✉️' });
  if (card.whatsapp)
    items.push({
      label: 'WhatsApp',
      value: card.whatsapp,
      href: `https://wa.me/${card.whatsapp.replace(/[^0-9]/g, '')}`,
      icon: '💬'
    });
  if (card.linkedin) items.push({ label: 'LinkedIn', value: card.linkedin.replace(/^https?:\/\//, ''), href: card.linkedin, icon: '💼' });
  if (card.website) items.push({ label: 'Ιστοσελίδα', value: card.website.replace(/^https?:\/\//, ''), href: card.website, icon: '🌐' });
  if (card.address) items.push({ label: 'Διεύθυνση', value: card.address, href: `https://maps.google.com/?q=${encodeURIComponent(card.address)}`, icon: '📍' });

  return (
    <div className="wrap">
      <div className="card-page" style={{ ['--accent-color' as any]: card.themeColor || '#6d28d9' }}>
        <div className="cover">
          {card.photoUrl ? (
            <img className="avatar" src={card.photoUrl} alt={card.fullName} />
          ) : (
            <div
              className="avatar"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 36,
                fontWeight: 700,
                color: card.themeColor || '#6d28d9'
              }}
            >
              {initials(card.fullName)}
            </div>
          )}
        </div>
        <div className="identity">
          <h1>{card.fullName}</h1>
          {card.jobTitle && <p className="role">{card.jobTitle}</p>}
          {card.company && (
            <p className="company">
              {card.logoUrl && <img className="logo-inline" src={card.logoUrl} alt="" />}
              {card.company}
            </p>
          )}
        </div>

        <a className="save-btn" href={`/u/${card.slug}/vcard.vcf`}>
          ⬇️ Αποθήκευση στις Επαφές
        </a>

        <div className="contact-list">
          {items.map((it) => (
            <a key={it.label} className="contact-item" href={it.href} target={it.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
              <div className="icon">{it.icon}</div>
              <div className="info">
                <div className="label">{it.label}</div>
                <div className="value">{it.value}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
      <p className="footer-note">Ψηφιακή επαγγελματική κάρτα · DigiCard</p>
    </div>
  );
}
