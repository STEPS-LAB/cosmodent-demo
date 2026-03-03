import { Metadata } from 'next';
import { AdminLoginPage } from '@/components/admin/AdminLoginPage';

export const metadata: Metadata = {
  title: 'Адмін-панель - CosmoDent',
  description: 'Вхід до адмін-панелі CosmoDent',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLogin() {
  return <AdminLoginPage />;
}
