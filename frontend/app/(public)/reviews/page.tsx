import type { Metadata } from 'next';
import { reviewsApi } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { StarRating } from '@/components/ui/StarRating';
import { formatDate } from '@/lib/utils';
import { ReviewSubmitForm } from '@/components/public/ReviewSubmitForm';

export const metadata: Metadata = {
  title: 'Відгуки пацієнтів',
  description: 'Справжні відгуки пацієнтів стоматологічної клініки Cosmodent. Дізнайтесь, чому нам довіряють.',
};

export const revalidate = 120;

export default async function ReviewsPage() {
  const reviews = await reviewsApi.getHighlighted(12).catch(() => []);

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <div className="container-site py-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="section-heading">Відгуки пацієнтів</h1>
        {reviews.length > 0 && (
          <div className="flex flex-col items-center gap-2 mt-4">
            <StarRating rating={Math.round(avgRating)} size={28} />
            <p className="text-2xl font-bold text-neutral-900">{avgRating.toFixed(1)}</p>
            <p className="text-neutral-500 text-sm">{reviews.length}+ задоволених пацієнтів</p>
          </div>
        )}
      </div>

      {/* Reviews grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger mb-16">
        {reviews.map((review) => (
          <Card key={review._id} className="p-6 flex flex-col animate-fade-in">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-semibold text-neutral-900">{review.patientName}</p>
                {review.doctorId && (
                  <p className="text-xs text-neutral-400 mt-0.5">Лікар: {review.doctorId.name}</p>
                )}
              </div>
              <StarRating rating={review.rating} size={14} />
            </div>
            <p className="text-neutral-600 text-sm leading-relaxed flex-1">"{review.text}"</p>
            <p className="text-xs text-neutral-400 mt-4">{formatDate(review.createdAt)}</p>
          </Card>
        ))}
      </div>

      {reviews.length === 0 && (
        <div className="text-center py-12">
          <p className="text-neutral-500">Відгуки ще не додані. Будьте першими!</p>
        </div>
      )}

      {/* Submit review */}
      <section className="max-w-xl mx-auto" aria-labelledby="review-form-heading">
        <div className="text-center mb-8">
          <h2 id="review-form-heading" className="text-2xl font-semibold text-neutral-900">
            Поділіться своїм досвідом
          </h2>
          <p className="text-neutral-500 mt-2">Ваш відгук допоможе іншим пацієнтам зробити правильний вибір</p>
        </div>
        <Card className="p-8">
          <ReviewSubmitForm />
        </Card>
      </section>
    </div>
  );
}
