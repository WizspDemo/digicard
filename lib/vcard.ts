import type { Card } from '@prisma/client';

function esc(v: string) {
  return v.replace(/([,;])/g, '\\$1').replace(/\n/g, '\\n');
}

function formatBday(input: string): string | null {
  // Accept "YYYY-MM-DD" from a <input type=date>, output vCard BDAY format.
  const m = input.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  return `${m[1]}${m[2]}${m[3]}`;
}

export function buildVCard(card: Card, baseUrl: string): string {
  const lines = ['BEGIN:VCARD', 'VERSION:3.0'];

  const name = card.fullName.trim();
  const parts = name.split(/\s+/);
  const last = parts.length > 1 ? parts[parts.length - 1] : '';
  const first = parts.length > 1 ? parts.slice(0, -1).join(' ') : name;
  lines.push(`N:${esc(last)};${esc(first)};;;`);
  lines.push(`FN:${esc(name)}`);

  if (card.company) lines.push(`ORG:${esc(card.company)}`);
  if (card.jobTitle) lines.push(`TITLE:${esc(card.jobTitle)}`);
  if (card.headline) lines.push(`NOTE:${esc(card.headline)}`);
  if (card.phone) lines.push(`TEL;TYPE=CELL:${esc(card.phone)}`);
  if (card.phone2) lines.push(`TEL;TYPE=WORK:${esc(card.phone2)}`);
  if (card.email) lines.push(`EMAIL;TYPE=WORK:${esc(card.email)}`);
  if (card.email2) lines.push(`EMAIL;TYPE=HOME:${esc(card.email2)}`);
  if (card.website) lines.push(`URL:${esc(card.website)}`);

  const hasAddress = card.addressStreet || card.addressCity || card.addressState || card.addressPostalCode || card.addressCountry;
  if (hasAddress) {
    lines.push(
      `ADR;TYPE=WORK:;;${esc(card.addressStreet || '')};${esc(card.addressCity || '')};${esc(card.addressState || '')};${esc(card.addressPostalCode || '')};${esc(card.addressCountry || '')}`
    );
  }

  if (card.birthday) {
    const bday = formatBday(card.birthday);
    if (bday) lines.push(`BDAY:${bday}`);
  }

  if (card.whatsapp) lines.push(`URL;TYPE=WhatsApp:${esc(`https://wa.me/${card.whatsapp.replace(/[^0-9]/g, '')}`)}`);
  if (card.linkedin) lines.push(`URL;TYPE=LinkedIn:${esc(card.linkedin)}`);
  if (card.instagram) lines.push(`URL;TYPE=Instagram:${esc(card.instagram)}`);
  if (card.facebook) lines.push(`URL;TYPE=Facebook:${esc(card.facebook)}`);
  if (card.tiktok) lines.push(`URL;TYPE=TikTok:${esc(card.tiktok)}`);
  if (card.telegram) lines.push(`URL;TYPE=Telegram:${esc(card.telegram)}`);
  if (card.twitter) lines.push(`URL;TYPE=X:${esc(card.twitter)}`);

  if (card.photoUrl) {
    const abs = card.photoUrl.startsWith('http') ? card.photoUrl : `${baseUrl}${card.photoUrl}`;
    lines.push(`PHOTO;VALUE=URL:${esc(abs)}`);
  }
  lines.push(`REV:${new Date().toISOString()}`);
  lines.push('END:VCARD');
  return lines.join('\r\n');
}
