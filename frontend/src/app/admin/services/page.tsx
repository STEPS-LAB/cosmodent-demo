import { Metadata } from 'next';
import { AdminServicesPage } from '@/components/admin/services/AdminServicesPage';

export const metadata: Metadata = {
  title: 'Послуги - CosmoDent Admin',
  robots: {
    index: false,
    follow: false,
  },
};

export default function Services() {
  return <AdminServicesPage />;
}
