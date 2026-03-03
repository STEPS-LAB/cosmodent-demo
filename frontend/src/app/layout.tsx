import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CosmoDent - Сучасна Стоматологія у Києві',
  description: 'Професійні стоматологічні послуги. Імплантація, відбілювання, лікування зубів. Сучасне обладнання та досвідчені лікарі.',
  keywords: ['стоматологія', 'імплантація', 'лікування зубів', 'Київ', 'CosmoDent'],
  authors: [{ name: 'CosmoDent' }],
  openGraph: {
    title: 'CosmoDent - Сучасна Стоматологія',
    description: 'Професійні стоматологічні послуги у Києві',
    type: 'website',
    locale: 'uk_UA',
    siteName: 'CosmoDent',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
