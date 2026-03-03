'use client';

import { useEffect, useState, useLayoutEffect, useMemo } from 'react';
import Link from 'next/link';
import { api } from '@/services/api';

interface Service {
  _id: string;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  startingPrice: number;
  category?: string;
  duration?: number;
  isActive: boolean;
}

export function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [initialHash, setInitialHash] = useState<string>('');

  // Зберігаємо hash при першому завантаженні (useLayoutEffect виконується до рендеру)
  useLayoutEffect(() => {
    setInitialHash(window.location.hash.replace('#', ''));
  }, []);

  useEffect(() => {
    api.getServices({ isActive: 'true' }).then((data) => {
      setServices(data);
      setLoading(false);
    });
  }, []);

  const categories = useMemo(() => 
    ['all', ...Array.from(new Set(services.map((s) => s.category).filter(Boolean)))]
  , [services]);

  // Обробка початкового hash при завантаженні послуг
  useEffect(() => {
    if (services.length === 0 || !initialHash) return;
    
    // Мапінг якорів на категорії
    const categoryMap: Record<string, string> = {
      'prosthetics': 'Протезування',
      'orthodontics': 'Ортодонтія',
      'treatment': 'Лікування зубів',
      'hygiene': 'Професійна гігієна',
      'implantatsiya': 'Імплантація',
    };
    
    const category = categoryMap[initialHash];
    
    if (category && categories.includes(category)) {
      setSelectedCategory(category);
    }
  }, [services, categories, initialHash]);

  // Обробка змін hash після завантаження
  useEffect(() => {
    const handleHashChange = () => {
      if (services.length === 0) return;
      
      const hash = window.location.hash.replace('#', '');
      const categoryMap: Record<string, string> = {
        'prosthetics': 'Протезування',
        'orthodontics': 'Ортодонтія',
        'treatment': 'Лікування зубів',
        'hygiene': 'Професійна гігієна',
        'implantatsiya': 'Імплантація',
      };
      
      const category = categoryMap[hash];
      
      if (category && categories.includes(category)) {
        setSelectedCategory(category);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [services, categories]);

  const filteredServices =
    selectedCategory === 'all'
      ? services
      : services.filter((s) => s.category === selectedCategory);

  return (
    <div className="py-12 md:py-16">
      <div className="container-custom">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-4">
            Наші послуги
          </h1>
          <p className="text-lg text-secondary-600">
            Повний спектр стоматологічних послуг з використанням сучасних технологій
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category || 'all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-primary-600 text-white'
                  : 'bg-secondary-100 text-secondary-700 sm:hover:bg-secondary-200'
              }`}
            >
              {category === 'all' ? 'Всі' : category}
            </button>
          ))}
        </div>

        {/* Services List */}
        <div className="space-y-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card p-6 animate-pulse">
                  <div className="h-6 bg-secondary-200 rounded w-1/3 mb-4" />
                  <div className="h-4 bg-secondary-200 rounded w-full mb-2" />
                  <div className="h-4 bg-secondary-200 rounded w-2/3" />
                </div>
              ))
            : filteredServices.map((service) => (
                <Link
                  key={service._id}
                  href={`/services/${service.slug}`}
                  className="card p-6 group sm:hover:border-primary-200 transition-all duration-300 block"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-secondary-900 sm:group-hover:text-primary-600 transition-colors">
                          {service.name}
                        </h3>
                        {service.category && (
                          <span className="text-xs px-2 py-1 bg-primary-50 text-primary-700 rounded-full text-center">
                            {service.category}
                          </span>
                        )}
                      </div>
                      <p className="text-secondary-600 mb-3">{service.shortDescription}</p>
                      {service.duration && (
                        <span className="text-sm text-secondary-500">
                          ⏱ {service.duration} хв
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-secondary-500 whitespace-nowrap">вартість від</span>
                        <span className="text-xl font-bold text-primary-600">
                          {service.startingPrice.toLocaleString()} ₴
                        </span>
                      </div>
                      <span className="text-primary-600 sm:group-hover:translate-x-2 transition-transform text-2xl">
                        →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </div>
  );
}
