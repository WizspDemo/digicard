import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const card = await prisma.card.findUnique({ where: { slug: params.slug } });
  if (!card) return {};
  return {
    title: `${card.fullName}${card.company ? ' · ' + card.company : ''}`,
    description: card.headline || card.jobTitle || 'Ψηφιακή επαγγελματική κάρτα'
  };
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
}

function formatAddress(card: {
  addressStreet: string | null;
  addressCity: string | null;
  addressState: string | null;
  addressPostalCode: string | null;
  addressCountry: string | null;
}) {
  return [card.addressStreet, card.addressCity, card.addressState, card.addressPostalCode, card.addressCountry]
    .filter(Boolean)
    .join(', ');
}

export default async function CardPage({ params }: { params: { slug: string } }) {
  const card = await prisma.card.findUnique({ where: { slug: params.slug } });
  if (!card) notFound();

  const items: { label: string; value: string; href: string; icon: string }[] = [];
  if (card.phone) items.push({ label: 'Τηλέφωνο', value: card.phone, href: `tel:${card.phone}`, icon: '📞' });
  if (card.phone2) items.push({ label: 'Τηλέφωνο 2', value: card.phone2, href: `tel:${card.phone2}`, icon: '📞' });
  if (card.email) items.push({ label: 'Email', value: card.email, href: `mailto:${card.email}`, icon: '✉️' });
  if (card.email2) items.push({ label: 'Email 2', value: card.email2, href: `mailto:${card.email2}`, icon: '✉️' });
  if (card.whatsapp)
    items.push({
      label: 'WhatsApp',
      value: card.whatsapp,
      href: `https://wa.me/${card.whatsapp.replace(/[^0-9]/g, '')}`,
      icon: '💬'
    });
  if (card.website) items.push({ label: 'Ιστοσελίδα', value: card.website.replace(/^https?:\/\//, ''), href: card.website, icon: '🌐' });
  const address = formatAddress(card);
  if (address) items.push({ label: 'Διεύθυνση', value: address, href: `https://maps.google.com/?q=${encodeURIComponent(address)}`, icon: '📍' });

  const socials: { label: string; href: string; icon: string }[] = [];
  if (card.linkedin) socials.push({ label: 'LinkedIn', href: card.linkedin, icon: '💼' });
  if (card.instagram) socials.push({ label: 'Instagram', href: card.instagram, icon: '📷' });
  if (card.facebook) socials.push({ label: 'Facebook', href: card.facebook, icon: '👍' });
  if (card.tiktok) socials.push({ label: 'TikTok', href: card.tiktok, icon: '🎵' });
  if (card.telegram) socials.push({ label: 'Telegram', href: card.telegram, icon: '✈️' });
  if (card.twitter) socials.push({ label: 'X / Twitter', href: card.twitter, icon: '✖️' });

  return (
    <div className="wrap">
      <div className="card-page" style={{ ['--accent-color' as any]: card.themeColor || '#6d28d9' }}>
        <div className="cover" style={card.coverUrl ? { backgroundImage: `url(${card.coverUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}>
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
          {card.headline && <p className="headline">{card.headline}</p>}
        </div>

        <a className="save-btn" href={`/u/${card.slug}/vcard.vcf`}>
          ⬇️ Αποθήκευση στις Επαφές
        </a>

        {socials.length > 0 && (
          <div className="social-row">
            {socials.map((s) => (
              <a key={s.label} className="social-chip" href={s.href} target="_blank" rel="noreferrer" title={s.label}>
                {s.icon}
              </a>
            ))}
          </div>
        )}

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
