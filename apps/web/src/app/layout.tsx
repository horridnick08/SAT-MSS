import type { Metadata } from 'next';
import { Inter, Orbitron, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { AuthGuard } from '@/components/layout/AuthGuard';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SAT-MSS · Satellite Mining Surveillance System',
  description: 'AI-assisted satellite land disturbance detection mission control platform.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${orbitron.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased select-none">
        <Providers>
          <AuthGuard>{children}</AuthGuard>
        </Providers>
      </body>
    </html>
  );
}
