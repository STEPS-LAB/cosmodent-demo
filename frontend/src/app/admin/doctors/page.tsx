import { Metadata } from 'next';
import { AdminDoctorsPage } from '@/components/admin/doctors/AdminDoctorsPage';

export const metadata: Metadata = {
  title: 'Лікарі - КОСМОДЕНТ Admin',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminDoctors() {
  return <AdminDoctorsPage />;
}
