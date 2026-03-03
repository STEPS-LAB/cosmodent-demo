import { Metadata } from 'next';
import { ServicesPage } from '@/components/services/ServicesPage';

export const metadata: Metadata = {
  title: 'Послуги - CosmoDent',
  description: 'Повний спектр стоматологічних послуг: імплантація, протезування, ортодонтія, лікування зубів та професійна гігієна.',
};

export default function Services() {
  return <ServicesPage />;
}
