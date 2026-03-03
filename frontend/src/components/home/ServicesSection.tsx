'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { api } from '@/services/api';

interface Service {
  _id: string;
  name: string;
  slug: string;
  shortDescription: string;
  startingPrice: number;
  category?: string;
}

const serviceIcons: Record<string, JSX.Element> = {
  default: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  ),
  implants: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
    </svg>
  ),
  whitening: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  orthodontics: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
    </svg>
  ),
};

function getServiceIcon(category?: string): JSX.Element {
  if (!category) return serviceIcons.default;
  const cat = category.toLowerCase();
  if (cat.includes('імплант')) return serviceIcons.implants;
  if (cat.includes('відбілюв')) return serviceIcons.whitening;
  if (cat.includes('ортодонт')) return serviceIcons.orthodontics;
  return serviceIcons.default;
}

export function ServicesSection() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    api.getServices({ isActive: 'true' }).then((data) => {
      setServices(data.slice(0, 6));
      setLoading(false);
    });
  }, []);

  useEffect(() => {
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

    const elements = document.querySelectorAll('[data-service-item]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [loading]);

  return (
    <section ref={sectionRef} className="py-20 md:py-28 bg-gradient-to-b from-white via-primary-50/30 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary-100/40 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-primary-100/40 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 border border-primary-200 rounded-full mb-6 animate-fade-in-up">
            <span className="text-sm font-semibold text-primary-700 uppercase tracking-wide">Наші послуги</span>
          </div>
          <h2 className="section-title text-center">Комплексний догляд за вашою посмішкою</h2>
          <p className="section-subtitle text-center mx-auto">
            Повний спектр стоматологічних послуг для всієї родини з використанням сучасних технологій
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card-premium p-8 animate-pulse">
                  <div className="w-14 h-14 bg-secondary-200 rounded-xl mb-6" />
                  <div className="h-6 bg-secondary-200 rounded w-3/4 mb-4" />
                  <div className="h-4 bg-secondary-200 rounded w-full mb-2" />
                  <div className="h-4 bg-secondary-200 rounded w-2/3" />
                </div>
              ))
            : services.map((service, index) => (
                <Link
                  key={service._id}
                  href={`/services/${service.slug}`}
                  data-service-item
                  data-index={index}
                  className={`card-premium p-8 group relative overflow-hidden ${
                    visibleItems.includes(index) ? 'animate-fade-in-up opacity-100' : 'opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 via-primary-500/0 to-primary-500/0 group-hover:from-primary-500/5 group-hover:via-primary-500/10 group-hover:to-primary-500/5 transition-all duration-700" />
                  
                  {/* Icon with glow effect */}
                  <div className="relative w-14 h-14 bg-gradient-to-br from-primary-100 to-primary-50 rounded-xl flex items-center justify-center text-primary-600 mb-6 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary-500/30 transition-all duration-500">
                    {getServiceIcon(service.category)}
                  </div>

                  {/* Content */}
                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-bold text-secondary-900 group-hover:text-primary-600 transition-colors duration-300">
                        {service.name}
                      </h3>
                      {service.category && (
                        <span className="text-xs px-3 py-1 bg-gradient-to-r from-primary-100 to-primary-50 text-primary-700 rounded-full font-medium border border-primary-200">
                          {service.category}
                        </span>
                      )}
                    </div>
                    <p className="text-secondary-600 text-sm mb-6 line-clamp-2 leading-relaxed">
                      {service.shortDescription}
                    </p>
                    
                    {/* Price and arrow */}
                    <div className="flex items-center justify-between pt-4 border-t border-secondary-100 group-hover:border-primary-200 transition-colors duration-300">
                      <div>
                        <span className="text-xs text-secondary-500 block mb-0.5">Вартість від</span>
                        <span className="text-lg font-bold text-gradient-primary bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                          {service.startingPrice.toLocaleString()} ₴
                        </span>
                      </div>
                      <span className="w-10 h-10 rounded-full bg-primary-50 group-hover:bg-primary-600 flex items-center justify-center text-primary-600 group-hover:text-white transition-all duration-500 group-hover:translate-x-1 group-hover:rotate-45">
                        →
                      </span>
                    </div>
                  </div>

                  {/* Corner decoration */}
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary-100/50 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
                </Link>
              ))}
        </div>

        {/* View All */}
        <div className="text-center mt-16">
          <Link href="/services" className="btn-outline inline-flex items-center gap-2 group">
            Переглянути всі послуги
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
