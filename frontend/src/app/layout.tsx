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
  title: 'КОСМОДЕНТ - Сучасна Стоматологія у Житомирі',
  description: 'Професійні стоматологічні послуги. Імплантація, відбілювання, лікування зубів. Сучасне обладнання та досвідчені лікарі.',
  keywords: ['стоматологія', 'імплантація', 'лікування зубів', 'Житомир', 'КОСМОДЕНТ'],
  authors: [{ name: 'КОСМОДЕНТ' }],
  openGraph: {
    title: 'КОСМОДЕНТ - Сучасна Стоматологія',
    description: 'Професійні стоматологічні послуги у Житомирі',
    type: 'website',
    locale: 'uk_UA',
    siteName: 'КОСМОДЕНТ',
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
            <main className="flex-grow pt-20 lg:pt-20">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
