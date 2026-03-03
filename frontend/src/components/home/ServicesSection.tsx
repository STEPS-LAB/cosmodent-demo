'use client';

import { useEffect, useState } from 'react';
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

export function ServicesSection() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getServices({ isActive: 'true' }).then((data) => {
      setServices(data.slice(0, 6));
      setLoading(false);
    });
  }, []);

  return (
    <section className="py-16 md:py-24 bg-white" id="services">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="section-title text-center">Наші послуги</h2>
          <p className="section-subtitle text-center mx-auto">
            Повний спектр стоматологічних послуг для всієї родини
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card p-6 animate-pulse">
                  <div className="h-6 bg-secondary-200 rounded w-3/4 mb-4" />
                  <div className="h-4 bg-secondary-200 rounded w-full mb-2" />
                  <div className="h-4 bg-secondary-200 rounded w-2/3" />
                </div>
              ))
            : services.map((service) => (
                <Link
                  key={service._id}
                  href={`/services/${service.slug}`}
                  className="card p-6 group hover:border-primary-200 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors">
                      {service.name}
                    </h3>
                    {service.category && (
                      <span className="text-xs px-2 py-1 bg-primary-50 text-primary-700 rounded-full">
                        {service.category}
                      </span>
                    )}
                  </div>
                  <p className="text-secondary-600 text-sm mb-4 line-clamp-2">
                    {service.shortDescription}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-primary-600 font-semibold">
                      від {service.startingPrice.toLocaleString()} ₴
                    </span>
                    <span className="text-primary-600 group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </div>
                </Link>
              ))}
        </div>

        {/* View All */}
        <div className="text-center mt-12">
          <Link href="/services" className="btn-outline">
            Переглянути всі послуги
          </Link>
        </div>
      </div>
    </section>
  );
}
