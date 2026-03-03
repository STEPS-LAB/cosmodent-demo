import { Metadata } from 'next';
import { AdminAppointmentsPage } from '@/components/admin/appointments/AdminAppointmentsPage';

export const metadata: Metadata = {
  title: 'Записи - CosmoDent Admin',
  robots: {
    index: false,
    follow: false,
  },
};

export default function Appointments() {
  return <AdminAppointmentsPage />;
}
