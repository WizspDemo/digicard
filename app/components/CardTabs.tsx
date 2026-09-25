'use client';

import { useState } from 'react';
import type { Card } from '@prisma/client';
import {
  LinkedInIcon,
  InstagramIcon,
  FacebookIcon,
  TikTokIcon,
  TelegramIcon,
  TwitterXIcon,
  WhatsAppIcon,
  GlobeIcon
} from './SocialIcons';

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

function formatBirthday(input: string) {
  const m = input.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return input;
  return `${m[3]}/${m[2]}/${m[1]}`;
}

export default function CardTabs({ card }: { card: Card }) {
  const contactItems: { label: string; value: string; href: string; icon: string }[] = [];
  if (card.phone) contactItems.push({ label: 'Τηλέφωνο', value: card.phone, href: `tel:${card.phone}`, icon: '📞' });
  if (card.phone2) contactItems.push({ label: 'Τηλέφωνο 2', value: card.phone2, href: `tel:${card.phone2}`, icon: '📞' });
  if (card.email) contactItems.push({ label: 'Email', value: card.email, href: `mailto:${card.email}`, icon: '✉️' });
  if (card.email2) contactItems.push({ label: 'Email 2', value: card.email2, href: `mailto:${card.email2}`, icon: '✉️' });
  if (card.website) contactItems.push({ label: 'Ιστοσελίδα', value: card.website.replace(/^https?:\/\//, ''), href: card.website, icon: '🌐' });

  const socials: { label: string; href: string; Icon: any }[] = [];
  if (card.whatsapp) socials.push({ label: 'WhatsApp', href: `https://wa.me/${card.whatsapp.replace(/[^0-9]/g, '')}`, Icon: WhatsAppIcon });
  if (card.linkedin) socials.push({ label: 'LinkedIn', href: card.linkedin, Icon: LinkedInIcon });
  if (card.instagram) socials.push({ label: 'Instagram', href: card.instagram, Icon: InstagramIcon });
  if (card.facebook) socials.push({ label: 'Facebook', href: card.facebook, Icon: FacebookIcon });
  if (card.tiktok) socials.push({ label: 'TikTok', href: card.tiktok, Icon: TikTokIcon });
  if (card.telegram) socials.push({ label: 'Telegram', href: card.telegram, Icon: TelegramIcon });
  if (card.twitter) socials.push({ label: 'X / Twitter', href: card.twitter, Icon: TwitterXIcon });

  const address = formatAddress(card);
  const hasOther = Boolean(address || card.birthday);

  const tabs = [
    { key: 'contact', label: '📇 Επικοινωνία', show: contactItems.length > 0 },
    { key: 'social', label: '🔗 Κοινωνικά', show: socials.length > 0 },
    { key: 'other', label: '📍 Διεύθυνση & λοιπά', show: hasOther }
  ].filter((t) => t.show);

  const [active, setActive] = useState(tabs[0]?.key || 'contact');

  if (tabs.length === 0) return null;

  return (
    <div className="tabs-wrap">
      <div className="tabs-bar">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            className={`tab-btn ${active === t.key ? 'active' : ''}`}
            onClick={() => setActive(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {active === 'contact' && (
        <div className="contact-list">
          {contactItems.map((it) => (
            <a key={it.label} className="contact-item" href={it.href} target={it.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
              <div className="icon">{it.icon}</div>
              <div className="info">
                <div className="label">{it.label}</div>
                <div className="value">{it.value}</div>
              </div>
            </a>
          ))}
        </div>
      )}

      {active === 'social' && (
        <div className="social-grid">
          {socials.map((s) => (
            <a key={s.label} className="social-card" href={s.href} target="_blank" rel="noreferrer">
              <s.Icon size={44} />
              <span>{s.label}</span>
            </a>
          ))}
        </div>
      )}

      {active === 'other' && (
        <div className="contact-list">
          {address && (
            <a
              className="contact-item"
              href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
              target="_blank"
              rel="noreferrer"
            >
              <div className="icon">📍</div>
              <div className="info">
                <div className="label">Διεύθυνση</div>
                <div className="value">{address}</div>
              </div>
            </a>
          )}
          {card.birthday && (
            <div className="contact-item">
              <div className="icon">🎂</div>
              <div className="info">
                <div className="label">Γενέθλια</div>
                <div className="value">{formatBirthday(card.birthday)}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
