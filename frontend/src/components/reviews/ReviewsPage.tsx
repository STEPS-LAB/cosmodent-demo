'use client';

import { useEffect, useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { api } from '@/services/api';

interface Review {
  _id: string;
  patientName: string;
  rating: number;
  title: string;
  content: string;
  createdAt: string;
  service?: { name: string };
  doctor?: { name: string };
}

export function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<{
    averageRating: number;
    activeReviews: number;
    ratingDistribution: { rating: number; count: number }[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getReviews({ isActive: 'true' }),
      api.getReviewStatistics(),
    ]).then(([reviewsData, statsData]) => {
      setReviews(reviewsData);
      setStats(statsData);
      setLoading(false);
    });
  }, []);

  return (
    <div className="py-12 md:py-16">
      <div className="container-custom">
        <div className="max-w-3xl mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-4">
            Відгуки пацієнтів
          </h1>
          <p className="text-lg text-secondary-600">
            Дізнайтеся, що кажуть наші пацієнти про лікування в КОСМОДЕНТ
          </p>
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="card p-6 text-center md:col-span-1">
              <div className="text-4xl font-bold text-primary-600 mb-2">
                {stats.averageRating}
              </div>
              <div className="flex justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(stats.averageRating)
                        ? 'text-yellow-400'
                        : 'text-secondary-300'
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm text-secondary-600">Середній рейтинг</div>
            </div>

            <div className="card p-6 md:col-span-3">
              <h3 className="font-semibold text-secondary-900 mb-4">Розподіл оцінок</h3>
              <div className="space-y-2">
                {stats.ratingDistribution?.map((item) => (
                  <div key={item.rating} className="flex items-center gap-3">
                    <div className="w-12 text-sm text-secondary-600">{item.rating} ★</div>
                    <div className="flex-1 h-3 bg-secondary-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 rounded-full"
                        style={{
                          width: `${
                            stats.activeReviews
                              ? (item.count / stats.activeReviews) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                    <div className="w-12 text-sm text-secondary-600 text-right">
                      {item.count}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card p-6 animate-pulse">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, j) => (
                      <div key={j} className="w-5 h-5 bg-secondary-200 rounded" />
                    ))}
                  </div>
                  <div className="h-4 bg-secondary-200 rounded w-full mb-2" />
                  <div className="h-4 bg-secondary-200 rounded w-3/4" />
                </div>
              ))
            : reviews.map((review) => (
                <div key={review._id} className="card p-6">
                  <div className="flex mb-3">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`w-5 h-5 ${
                          i < review.rating ? 'text-yellow-400' : 'text-secondary-300'
                        }`}
                      />
                    ))}
                  </div>
                  <h3 className="font-semibold text-secondary-900 mb-2">{review.title}</h3>
                  <p className="text-secondary-700 mb-4">{review.content}</p>
                  <div className="flex items-center justify-between text-sm text-secondary-500">
                    <span>{review.patientName}</span>
                    <span>{new Date(review.createdAt).toLocaleDateString('uk-UA')}</span>
                  </div>
                  {(review.service || review.doctor) && (
                    <div className="mt-3 pt-3 border-t border-secondary-100 flex gap-4 text-xs text-secondary-500">
                      {review.service && <span>Послуга: {review.service.name}</span>}
                      {review.doctor && <span>Лікар: {review.doctor.name}</span>}
                    </div>
                  )}
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
