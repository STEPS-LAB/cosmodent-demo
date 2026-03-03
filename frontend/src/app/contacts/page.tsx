import { Metadata } from 'next';
import { ContactsPage } from '@/components/contacts/ContactsPage';

export const metadata: Metadata = {
  title: 'Контакти - КОСМОДЕНТ',
  description: 'Контактна інформація КОСМОДЕНТ: адреса, телефон, графік роботи.',
};

export default function Contacts() {
  return <ContactsPage />;
}
