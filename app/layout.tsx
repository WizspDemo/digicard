import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DigiCard',
  description: 'Digital business cards'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="el">
      <body>{children}</body>
    </html>
  );
}
