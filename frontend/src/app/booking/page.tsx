import { Metadata } from 'next';
import { BookingPage } from '@/components/booking/BookingPage';

export const metadata: Metadata = {
  title: 'Запис на прийом - КОСМОДЕНТ',
  description: 'Запишіться на прийом до КОСМОДЕНТ онлайн. Зручна система бронювання з вибором послуги, лікаря та часу.',
};

export default function Booking() {
  return <BookingPage />;
}
