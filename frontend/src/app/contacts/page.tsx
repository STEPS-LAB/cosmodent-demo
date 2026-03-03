import { Metadata } from 'next';
import { ContactsPage } from '@/components/contacts/ContactsPage';

export const metadata: Metadata = {
  title: 'Контакти - CosmoDent',
  description: 'Контактна інформація CosmoDent: адреса, телефон, графік роботи.',
};

export default function Contacts() {
  return <ContactsPage />;
}
