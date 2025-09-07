import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NicheConnect - Your curated launchpad for student entrepreneur success',
  description: 'A community hub for student entrepreneurs to discover funding, enhance skills, and connect with peers.',
  keywords: ['student entrepreneurs', 'funding', 'startup', 'community', 'Base', 'Web3'],
  authors: [{ name: 'NicheConnect Team' }],
  openGraph: {
    title: 'NicheConnect',
    description: 'Your curated launchpad for student entrepreneur success',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
