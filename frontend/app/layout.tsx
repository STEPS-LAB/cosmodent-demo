import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { QueryProvider } from '@/components/providers/QueryProvider';
import './globals.css';

const inter = Inter({
  subsets:  ['latin', 'cyrillic'],
  variable: '--font-inter',
  display:  'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://cosmodent.ua'),
  title: {
    default:  'Cosmodent — Стоматологічна клініка у Києві',
    template: '%s | Cosmodent',
  },
  description:
    'Сучасна стоматологічна клініка Cosmodent у Києві. Імплантологія, ортодонтія, естетична стоматологія, відбілювання зубів. Запис онлайн.',
  keywords: ['стоматологія', 'стоматолог київ', 'implant', 'ортодонтія', 'cosmodent'],
  openGraph: {
    type:        'website',
    locale:      'uk_UA',
    siteName:    'Cosmodent',
    title:       'Cosmodent — Стоматологічна клініка у Києві',
    description: 'Сучасна стоматологія з турботою про кожного пацієнта.',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#16a34a',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-white">
        <QueryProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: { borderRadius: '12px', fontFamily: 'Inter, sans-serif' },
              success: { iconTheme: { primary: '#16a34a', secondary: '#fff' } },
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}
