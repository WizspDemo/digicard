import type { Card } from '@prisma/client';

function esc(v: string) {
  return v.replace(/([,;])/g, '\\$1').replace(/\n/g, '\\n');
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
  if (card.phone) lines.push(`TEL;TYPE=CELL:${esc(card.phone)}`);
  if (card.email) lines.push(`EMAIL:${esc(card.email)}`);
  if (card.website) lines.push(`URL:${esc(card.website)}`);
  if (card.address) lines.push(`ADR;TYPE=WORK:;;${esc(card.address)};;;;`);
  if (card.whatsapp) lines.push(`URL;TYPE=WhatsApp:${esc(`https://wa.me/${card.whatsapp.replace(/[^0-9]/g, '')}`)}`);
  if (card.linkedin) lines.push(`URL;TYPE=LinkedIn:${esc(card.linkedin)}`);
  if (card.photoUrl) {
    const abs = card.photoUrl.startsWith('http') ? card.photoUrl : `${baseUrl}${card.photoUrl}`;
    lines.push(`PHOTO;VALUE=URL:${esc(abs)}`);
  }
  lines.push(`REV:${new Date().toISOString()}`);
  lines.push('END:VCARD');
  return lines.join('\r\n');
}
