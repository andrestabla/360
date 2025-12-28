import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';



const inter = Inter({ subsets: ['latin'] });


import { getOrganizationSettings } from '@/app/lib/actions';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getOrganizationSettings();
  const branding = (settings?.branding as any) || {};

  return {
    title: branding.appTitle || 'Maturity 360',
    description: branding.portalDescription || 'Titan Edition v17',
    icons: {
      icon: branding.faviconUrl || '/favicon.ico',
      apple: branding.faviconUrl || '/apple-touch-icon.png', // Optional: fallback or use same
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className} suppressHydrationWarning={true}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
