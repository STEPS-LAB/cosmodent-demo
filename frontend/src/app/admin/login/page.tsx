import { Metadata } from 'next';
import { AdminLoginPage } from '@/components/admin/AdminLoginPage';

export const metadata: Metadata = {
  title: 'Адмін-панель - КОСМОДЕНТ',
  description: 'Вхід до адмін-панелі КОСМОДЕНТ',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLogin() {
  return <AdminLoginPage />;
}
