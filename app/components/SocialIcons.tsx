// Minimal inline brand marks (no external requests, no trademarked asset files).
// Each returns a small SVG icon on its official brand color.
import type { CSSProperties } from 'react';

type IconProps = { size?: number };

const wrapStyle = (bg: string, size: number): CSSProperties => ({
  width: size,
  height: size,
  borderRadius: '50%',
  background: bg,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0
});

export function LinkedInIcon({ size = 42 }: IconProps) {
  return (
    <div style={wrapStyle('#0A66C2', size)}>
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="#fff">
        <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
      </svg>
    </div>
  );
}

export function InstagramIcon({ size = 42 }: IconProps) {
  return (
    <div style={wrapStyle('linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)', size)}>
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="#fff" stroke="none" />
      </svg>
    </div>
  );
}

export function FacebookIcon({ size = 42 }: IconProps) {
  return (
    <div style={wrapStyle('#1877F2', size)}>
      <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="#fff">
        <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" />
      </svg>
    </div>
  );
}

export function TikTokIcon({ size = 42 }: IconProps) {
  return (
    <div style={wrapStyle('#000000', size)}>
      <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="#fff">
        <path d="M16.6 5.82a4.28 4.28 0 0 1-3.14-1.42v9.4a5.4 5.4 0 1 1-4.66-5.35v2.3a3.1 3.1 0 1 0 2.16 2.95V2h2.5a4.28 4.28 0 0 0 3.14 3.82v-0z" />
      </svg>
    </div>
  );
}

export function TelegramIcon({ size = 42 }: IconProps) {
  return (
    <div style={wrapStyle('#26A5E4', size)}>
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="#fff">
        <path d="M21.5 3.5 2.7 10.8c-.9.4-.9 1.7.1 2l4.6 1.5 1.8 5.5c.3.9 1.4 1.1 2 .4l2.5-2.7 4.7 3.5c.8.6 2 .2 2.2-.8l3-16.4c.2-1.1-.9-2-1.9-1.3z" />
      </svg>
    </div>
  );
}

export function TwitterXIcon({ size = 42 }: IconProps) {
  return (
    <div style={wrapStyle('#000000', size)}>
      <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="#fff">
        <path d="M18.9 2H22l-7.6 8.7L23.2 22h-6.9l-5.4-6.9L4.7 22H1.6l8.1-9.3L1 2h7.1l4.9 6.3L18.9 2zm-1.2 18h1.9L7.4 4H5.4l12.3 16z" />
      </svg>
    </div>
  );
}

export function WhatsAppIcon({ size = 42 }: IconProps) {
  return (
    <div style={wrapStyle('#25D366', size)}>
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="#fff">
        <path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.5A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .9.9-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.7.8-.8 1-.2.2-.3.2-.5.1a6.7 6.7 0 0 1-2-1.2 7.4 7.4 0 0 1-1.4-1.7c-.1-.2 0-.4.1-.5l.4-.4c.1-.1.2-.3.2-.4a.5.5 0 0 0 0-.5c0-.1-.6-1.5-.8-2-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.3 5.3 0 0 0 1.1 2.7 12 12 0 0 0 4.6 4c.6.3 1.1.4 1.5.6.6.2 1.2.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.2-.2-.3-.4-.4z" />
      </svg>
    </div>
  );
}

export function GlobeIcon({ size = 42 }: IconProps) {
  return (
    <div style={wrapStyle('#6b7280', size)}>
      <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" />
      </svg>
    </div>
  );
}
