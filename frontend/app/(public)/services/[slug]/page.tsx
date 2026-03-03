import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { servicesApi } from '@/lib/api';
import { BookingForm } from '@/components/booking/BookingForm';
import { Card } from '@/components/ui/Card';
import { formatPrice } from '@/lib/utils';
import { Clock, ChevronLeft, CheckCircle } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await servicesApi.getBySlug(slug).catch(() => null);
  if (!service) return { title: 'Послугу не знайдено' };
  return {
    title:       service.seoTitle,
    description: service.seoDescription,
    keywords:    service.seoKeywords?.join(', '),
  };
}

export const revalidate = 300;

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = await servicesApi.getBySlug(slug).catch(() => null);

  if (!service) notFound();

  const allServices = await servicesApi.getAll().catch(() => []);
  const related = allServices
    .filter((s) => s.slug !== slug && s.category === service.category)
    .slice(0, 3);

  return (
    <div className="container-site py-12">
      {/* Breadcrumb */}
      <nav aria-label="Навігація" className="mb-8">
        <Link href="/services" className="flex items-center gap-1 text-sm text-neutral-500 hover:text-primary-600 transition-colors w-fit">
          <ChevronLeft size={16} />
          Всі послуги
        </Link>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <article className="lg:col-span-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">{service.name}</h1>

          <div className="flex flex-wrap gap-4 mb-6">
            <span className="badge-green text-base px-4 py-1">
              {formatPrice(service.startingPrice, service.currency)}
            </span>
            <span className="flex items-center gap-1 text-sm text-neutral-500">
              <Clock size={14} />
              {service.duration} хвилин
            </span>
          </div>

          {/* Full description (HTML from CMS/admin) */}
          <div
            className="prose prose-neutral max-w-none prose-headings:text-neutral-900 prose-p:text-neutral-600 prose-p:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: service.fullDescription }}
          />

          {/* Why choose us for this service */}
          <div className="mt-8 bg-primary-50 rounded-2xl p-6">
            <h2 className="font-semibold text-neutral-900 text-lg mb-4">Чому обирають Cosmodent?</h2>
            <ul className="space-y-2">
              {[
                'Сучасне обладнання та сертифіковані матеріали',
                'Досвідчені спеціалісти з підтвердженою кваліфікацією',
                'Гарантія якості на всі роботи',
                'Зручний онлайн-запис та нагадування',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-neutral-700">
                  <CheckCircle size={16} className="text-primary-600 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </article>

        {/* Sticky sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-20 space-y-6">
            {/* Price card */}
            <Card className="p-6 border-primary-200">
              <p className="text-sm text-neutral-500 mb-1">Вартість</p>
              <p className="text-3xl font-bold text-primary-600 mb-4">
                {formatPrice(service.startingPrice, service.currency)}
              </p>
              <Link href="/#booking" className="btn-primary w-full justify-center">
                Записатися
              </Link>
              <p className="text-xs text-neutral-400 text-center mt-3">
                Точну вартість уточнить лікар на консультації
              </p>
            </Card>

            {/* Mini booking */}
            <Card className="p-6">
              <h2 className="font-semibold text-neutral-900 mb-4">Швидкий запис</h2>
              <BookingForm />
            </Card>
          </div>
        </aside>
      </div>

      {/* Related services */}
      {related.length > 0 && (
        <section className="mt-16" aria-labelledby="related-heading">
          <h2 id="related-heading" className="text-2xl font-semibold text-neutral-900 mb-6">
            Схожі послуги
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {related.map((s) => (
              <Link key={s._id} href={`/services/${s.slug}`}>
                <Card className="p-5 hover-lift group cursor-pointer h-full">
                  <h3 className="font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors mb-2">
                    {s.name}
                  </h3>
                  <p className="text-sm text-neutral-500 mb-3">{s.shortDescription}</p>
                  <p className="text-primary-600 font-semibold text-sm">{formatPrice(s.startingPrice)}</p>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
