import { Metadata } from 'next';
import { AdminSettingsPage } from '@/components/admin/settings/AdminSettingsPage';

export const metadata: Metadata = {
  title: 'Налаштування - КОСМОДЕНТ Admin',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminSettings() {
  return <AdminSettingsPage />;
}
