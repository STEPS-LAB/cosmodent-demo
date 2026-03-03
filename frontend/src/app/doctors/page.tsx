import { Metadata } from 'next';
import { DoctorsPage } from '@/components/doctors/DoctorsPage';

export const metadata: Metadata = {
  title: 'Лікарі - КОСМОДЕНТ',
  description: 'Наші лікарі - досвідчені фахівці з сучасними підходами до лікування.',
};

export default function Doctors() {
  return <DoctorsPage />;
}
