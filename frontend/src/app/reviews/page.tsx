import { Metadata } from 'next';
import { ReviewsPage } from '@/components/reviews/ReviewsPage';

export const metadata: Metadata = {
  title: 'Відгуки - КОСМОДЕНТ',
  description: 'Відгуки наших пацієнтів про лікування в КОСМОДЕНТ.',
};

export default function Reviews() {
  return <ReviewsPage />;
}
