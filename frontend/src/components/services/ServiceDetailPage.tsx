'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
  seoTitle?: string;
  seoDescription?: string;
}

interface ServiceDetailPageProps {
  slug: string;
}

export function ServiceDetailPage({ slug }: ServiceDetailPageProps) {
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    api.getServiceBySlug(slug).then((data) => {
      if (data) {
        setService(data);
      } else {
        router.push('/services');
      }
      setLoading(false);
    });
  }, [slug, router]);

  if (loading) {
    return (
      <div className="py-12 md:py-16">
        <div className="container-custom">
          <div className="animate-pulse">
            <div className="h-10 bg-secondary-200 rounded w-1/2 mb-4" />
            <div className="h-4 bg-secondary-200 rounded w-3/4 mb-8" />
            <div className="h-64 bg-secondary-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return null;
  }

  return (
    <div className="py-12 md:py-16">
      <div className="container-custom">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-secondary-600">
            <li><Link href="/" className="hover:text-primary-600">Головна</Link></li>
            <li>/</li>
            <li><Link href="/services" className="hover:text-primary-600">Послуги</Link></li>
            <li>/</li>
            <li className="text-secondary-900">{service.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              {service.category && (
                <span className="text-sm px-3 py-1 bg-primary-50 text-primary-700 rounded-full">
                  {service.category}
                </span>
              )}
              {service.duration && (
                <span className="text-sm text-secondary-500">
                  ⏱ {service.duration} хв
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-4">
              {service.name}
            </h1>

            <p className="text-lg text-secondary-600 mb-8">
              {service.shortDescription}
            </p>

            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold text-secondary-900 mb-4">Опис послуги</h2>
              <p className="text-secondary-700 whitespace-pre-line mb-8">
                {service.fullDescription}
              </p>
            </div>

            {/* CTA */}
            <div className="bg-primary-50 rounded-xl p-6 mt-8">
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                Зацікавила ця послуга?
              </h3>
              <p className="text-secondary-600 mb-4">
                Запишіться на консультацію до нашого фахівця
              </p>
              <Link href={`/booking?service=${service._id}`} className="btn-primary">
                Записатися на прийом
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                Вартість послуги
              </h3>
              <div className="mb-6">
                <span className="text-sm text-secondary-500">від</span>
                <div className="text-4xl font-bold text-primary-600">
                  {service.startingPrice.toLocaleString()} ₴
                </div>
              </div>

              <Link
                href={`/booking?service=${service._id}`}
                className="btn-primary w-full mb-4"
              >
                Записатися
              </Link>
              <a
                href="tel:+380441234567"
                className="btn-outline w-full block text-center"
              >
                Зателефонувати
              </a>

              <div className="mt-6 pt-6 border-t border-secondary-100">
                <div className="flex items-center space-x-2 text-sm text-secondary-600">
                  <span>✓</span>
                  <span>Безкоштовна консультація</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-secondary-600 mt-2">
                  <span>✓</span>
                  <span>Сучасне обладнання</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-secondary-600 mt-2">
                  <span>✓</span>
                  <span>Гарантія якості</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
