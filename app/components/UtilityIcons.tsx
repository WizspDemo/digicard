// Small monochrome utility icons for contact-list rows (phone, mail, globe, pin, cake).
// Replaces emoji glyphs — renders crisply at any size/DPI and matches the accent color.
import type { CSSProperties } from 'react';

type Props = { size?: number; style?: CSSProperties };

const base = (size: number): CSSProperties => ({ width: size, height: size });

export function PhoneIcon({ size = 18, style }: Props) {
  return (
    <svg style={{ ...base(size), ...style }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.79.63 2.65a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.43-1.2a2 2 0 0 1 2.11-.45c.86.3 1.75.51 2.65.63A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

export function MailIcon({ size = 18, style }: Props) {
  return (
    <svg style={{ ...base(size), ...style }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  );
}

export function GlobeLineIcon({ size = 18, style }: Props) {
  return (
    <svg style={{ ...base(size), ...style }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" />
    </svg>
  );
}

export function PinIcon({ size = 18, style }: Props) {
  return (
    <svg style={{ ...base(size), ...style }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function CakeIcon({ size = 18, style }: Props) {
  return (
    <svg style={{ ...base(size), ...style }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" />
      <path d="M4 16s.5-1 2-1 1.5 1 3 1 1.5-1 3-1 1.5 1 3 1 2-1 2-1M10 3v3M14 3v3" />
      <path d="M2 21h20" />
    </svg>
  );
}
