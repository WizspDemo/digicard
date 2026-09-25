import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import type { Metadata } from 'next';
import CardTabs from '@/app/components/CardTabs';

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

export default async function CardPage({ params }: { params: { slug: string } }) {
  const card = await prisma.card.findUnique({ where: { slug: params.slug } });
  if (!card) notFound();

  return (
    <div className="public-shell">
      <div className="wrap">
        <div className="card-page" style={{ ['--accent-color' as any]: card.themeColor || '#5b3df5' }}>
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
                  fontSize: 34,
                  fontWeight: 700,
                  color: card.themeColor || '#5b3df5'
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
            Αποθήκευση στις Επαφές
          </a>

          <CardTabs card={card} />
        </div>
        <p className="footer-note">Ψηφιακή επαγγελματική κάρτα · DigiCard</p>
      </div>
    </div>
  );
}
