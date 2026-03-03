import { Metadata } from 'next';
import { ReviewsPage } from '@/components/reviews/ReviewsPage';

export const metadata: Metadata = {
  title: 'Відгуки - CosmoDent',
  description: 'Відгуки наших пацієнтів про лікування в CosmoDent.',
};

export default function Reviews() {
  return <ReviewsPage />;
}
