'use client';

import { useEffect, useState, useRef } from 'react';
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

interface ReviewStats {
  averageRating: number;
  activeReviews: number;
}

const DEFAULT_STATS: ReviewStats = {
  averageRating: 0,
  activeReviews: 0,
};

export function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats>(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [reviewsData, statsData] = await Promise.all([
          api.getReviews({ isActive: 'true' }),
          api.getReviewStatistics(),
        ]);

        setReviews(Array.isArray(reviewsData) ? reviewsData.slice(0, 3) : []);
        setStats({
          averageRating: statsData?.averageRating || 0,
          activeReviews: statsData?.activeReviews || 0,
        });
      } catch (error) {
        console.warn('Failed to load reviews for home section:', error);
        // Use defaults on error
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            if (!isNaN(index)) {
              setVisibleItems((prev) => [...prev, index]);
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    const elements = document.querySelectorAll('[data-review-item]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [loading]);

  return (
    <section
      ref={sectionRef}
      className="py-16 sm:py-20 md:py-28 bg-gradient-to-b from-white via-primary-50/20 to-white relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-bl from-amber-100/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-tr from-primary-100/30 to-transparent rounded-full blur-3xl" />
        {/* Quote marks decoration */}
        <div className="absolute top-20 left-4 sm:left-10 text-6xl sm:text-9xl font-serif text-primary-100/40 select-none">
          &quot;
        </div>
        <div className="absolute bottom-20 right-4 sm:right-10 text-6xl sm:text-9xl font-serif text-primary-100/40 select-none">
          &quot;
        </div>
      </div>

      <div className="container-custom relative z-10">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-amber-50 border border-amber-200 rounded-full mb-6 animate-fade-in-up">
            <StarIcon className="w-4 h-4 text-amber-500" />
            <span className="text-xs sm:text-sm font-semibold text-amber-700 uppercase tracking-wide">
              Відгуки пацієнтів
            </span>
          </div>
          <h2 className="section-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center leading-tight">
            Що кажуть наші пацієнти
          </h2>
          <p className="section-subtitle text-base sm:text-xl md:text-2xl text-center mx-auto max-w-2xl sm:max-w-3xl mt-4">
            Реальні історії та відгуки людей, які довірили нам свою посмішку
          </p>
        </div>

        {/* Stats */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-12 mb-12 sm:mb-16 animate-fade-in-up">
          <div className="relative group w-full sm:w-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-amber-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
            <div className="relative bg-white/80 backdrop-blur-xl border border-amber-200/50 rounded-3xl p-6 sm:p-8 shadow-xl shadow-amber-500/10 min-h-[160px] sm:min-h-[180px] flex flex-col justify-center items-center">
              <div className="flex items-center justify-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`w-6 h-6 sm:w-7 sm:h-7 ${
                      i < Math.floor(stats.averageRating)
                        ? 'text-amber-400 drop-shadow-sm'
                        : 'text-secondary-200'
                    }`}
                  />
                ))}
              </div>
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent">
                {stats.averageRating}/5
              </div>
              <div className="text-sm text-secondary-600 font-medium mt-1 text-center">
                Середній рейтинг
              </div>
            </div>
          </div>

          <div className="hidden sm:block w-px h-24 bg-gradient-to-b from-transparent via-secondary-200 to-transparent" />

          <div className="relative group w-full sm:w-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-400/20 to-primary-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
            <div className="relative bg-white/80 backdrop-blur-xl border border-primary-200/50 rounded-3xl p-6 sm:p-8 shadow-xl shadow-primary-500/10 min-h-[160px] sm:min-h-[180px] flex flex-col justify-center items-center">
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent mb-1">
                {stats.activeReviews}
              </div>
              <div className="text-sm text-secondary-600 font-medium text-center">
                Відгуків
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="card-premium p-6 sm:p-8 animate-pulse">
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, j) => (
                      <div key={j} className="w-5 h-5 bg-secondary-200 rounded" />
                    ))}
                  </div>
                  <div className="h-5 bg-secondary-200 rounded w-3/4 mb-4" />
                  <div className="h-4 bg-secondary-200 rounded w-full mb-2" />
                  <div className="h-4 bg-secondary-200 rounded w-2/3" />
                </div>
              ))
            : reviews.length === 0
            ? (
              <div className="sm:col-span-2 lg:col-span-3 text-center py-12 text-secondary-500">
                Відгуків поки немає
              </div>
            )
            : reviews.map((review, index) => (
                <div
                  key={review._id}
                  data-review-item
                  data-index={index}
                  className={`card-premium p-6 sm:p-8 relative group ${
                    visibleItems.includes(index)
                      ? 'animate-fade-in-up opacity-100'
                      : 'opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {/* Quote icon */}
                  <div className="absolute top-4 right-4 sm:top-6 sm:right-6 text-4xl sm:text-5xl font-serif text-primary-200/50 select-none group-hover:text-primary-300/70 transition-colors duration-500">
                    &quot;
                  </div>

                  {/* Rating */}
                  <div className="flex gap-1 mb-4 sm:mb-6">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 ${
                          i < review.rating
                            ? 'text-amber-400 drop-shadow-sm scale-110'
                            : 'text-secondary-200'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Content */}
                  <h3 className="text-base sm:text-lg font-bold text-secondary-900 mb-3 sm:mb-4 group-hover:text-primary-600 transition-colors duration-300">
                    {review.title}
                  </h3>
                  <p className="text-sm sm:text-base text-secondary-600 mb-4 sm:mb-6 leading-relaxed line-clamp-3">
                    {review.content}
                  </p>

                  {/* Author and date */}
                  <div className="flex items-center justify-between pt-4 border-t border-secondary-100 group-hover:border-primary-200 transition-colors duration-300">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-100 to-primary-50 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-xs sm:text-sm font-bold text-primary-600">
                          {review.patientName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-semibold text-secondary-900">
                          {review.patientName}
                        </div>
                        <div className="text-xs text-secondary-500">
                          Пацієнт клініки
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-secondary-400 font-medium">
                      {new Date(review.createdAt).toLocaleDateString('uk-UA', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 via-transparent to-primary-500/0 group-hover:from-primary-500/5 group-hover:to-primary-500/10 transition-all duration-700 rounded-3xl" />
                </div>
              ))}
        </div>

        {/* View All */}
        <div className="text-center mt-12 sm:mt-16">
          <a
            href="/reviews"
            className="btn-outline inline-flex items-center gap-2 group w-full sm:w-auto justify-center"
          >
            Переглянути всі відгуки
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
