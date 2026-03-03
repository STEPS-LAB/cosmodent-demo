import { Metadata } from 'next';
import { AdminDashboardPage } from '@/components/admin/dashboard/AdminDashboardPage';

export const metadata: Metadata = {
  title: 'Dashboard - КОСМОДЕНТ Admin',
  robots: {
    index: false,
    follow: false,
  },
};

export default function Dashboard() {
  return <AdminDashboardPage />;
}
