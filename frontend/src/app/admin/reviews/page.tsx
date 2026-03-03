import { Metadata } from 'next';
import { AdminReviewsPage } from '@/components/admin/reviews/AdminReviewsPage';

export const metadata: Metadata = {
  title: 'Відгуки - КОСМОДЕНТ Admin',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminReviews() {
  return <AdminReviewsPage />;
}
