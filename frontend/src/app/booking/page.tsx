import { Metadata, Suspense } from 'next';
import { BookingPage } from '@/components/booking/BookingPage';

export const metadata: Metadata = {
  title: 'Запис на прийом - КОСМОДЕНТ',
  description: 'Запишіться на прийом до КОСМОДЕНТ онлайн. Зручна система бронювання з вибором послуги, лікаря та часу.',
};

export default function Booking() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Завантаження...</div>}>
      <BookingPage />
    </Suspense>
  );
}
