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
}

export function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<{ averageRating: number; activeReviews: number }>({
    averageRating: 0,
    activeReviews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getReviews({ isActive: 'true' }),
      api.getReviewStatistics(),
    ]).then(([reviewsData, statsData]) => {
      setReviews(reviewsData.slice(0, 3));
      setStats({
        averageRating: statsData.averageRating,
        activeReviews: statsData.activeReviews,
      });
      setLoading(false);
    });
  }, []);

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="section-title text-center">Відгуки пацієнтів</h2>
          <p className="section-subtitle text-center mx-auto">
            Що кажуть наші пацієнти про нас
          </p>
        </div>

        {/* Stats */}
        <div className="flex justify-center items-center space-x-8 mb-12">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={`w-6 h-6 ${
                    i < Math.floor(stats.averageRating)
                      ? 'text-yellow-400'
                      : 'text-secondary-300'
                  }`}
                />
              ))}
            </div>
            <div className="text-2xl font-bold text-secondary-900">{stats.averageRating}/5</div>
            <div className="text-sm text-secondary-600">Середній рейтинг</div>
          </div>
          <div className="w-px h-16 bg-secondary-200" />
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary-900">{stats.activeReviews}</div>
            <div className="text-sm text-secondary-600">Відгуків</div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
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
                  <div className="flex mb-4">
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
                  <p className="text-secondary-600 text-sm mb-4 line-clamp-3">{review.content}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-secondary-600">{review.patientName}</span>
                    <span className="text-xs text-secondary-400">
                      {new Date(review.createdAt).toLocaleDateString('uk-UA')}
                    </span>
                  </div>
                </div>
              ))}
        </div>

        {/* View All */}
        <div className="text-center mt-12">
          <a href="/reviews" className="btn-outline">
            Переглянути всі відгуки
          </a>
        </div>
      </div>
    </section>
  );
}
