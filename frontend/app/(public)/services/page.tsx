import type { Metadata } from 'next';
import Link from 'next/link';
import { servicesApi } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { formatPrice } from '@/lib/utils';
import { ChevronRight, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Послуги та ціни',
  description: 'Повний перелік стоматологічних послуг клініки Cosmodent з цінами. Імплантологія, ортодонтія, відбілювання та інше.',
};

export const revalidate = 300;

const CATEGORY_LABELS: Record<string, string> = {
  surgical:    'Хірургія',
  therapy:     'Терапія',
  orthodontics: 'Ортодонтія',
  aesthetic:   'Естетика',
  prosthetics: 'Протезування',
  pediatric:   'Дитяча',
  general:     'Загальне',
};

export default async function ServicesPage() {
  const services = await servicesApi.getAll().catch(() => []);

  // Group by category
  const grouped = services.reduce<Record<string, typeof services>>((acc, s) => {
    const cat = s.category ?? 'general';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  return (
    <div className="container-site py-12">
      {/* Page header */}
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <h1 className="section-heading">Послуги та ціни</h1>
        <p className="section-subheading mx-auto">
          Cosmodent пропонує повний спектр сучасних стоматологічних послуг. Усі ціни вказані з позначкою «від» і уточнюються на консультації.
        </p>
      </div>

      {/* CTA strip */}
      <div className="mb-12 bg-primary-600 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-white font-semibold text-lg">Безкоштовна первинна консультація</p>
          <p className="text-primary-100 text-sm mt-1">Запишіться онлайн і отримайте первинний огляд безкоштовно</p>
        </div>
        <Link href="/#booking" className="bg-white text-primary-700 font-semibold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors whitespace-nowrap">
          Записатися
        </Link>
      </div>

      {/* Services by category */}
      {Object.entries(grouped).map(([category, categoryServices]) => (
        <section key={category} className="mb-14" aria-labelledby={`cat-${category}`}>
          <h2 id={`cat-${category}`} className="text-2xl font-semibold text-neutral-900 mb-6 flex items-center gap-3">
            <span className="w-1 h-7 bg-primary-600 rounded-full inline-block" aria-hidden />
            {CATEGORY_LABELS[category] ?? category}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {categoryServices.map((service) => (
              <Link key={service._id} href={`/services/${service.slug}`}>
                <Card className="p-6 h-full group cursor-pointer hover-lift">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors text-lg mb-1">
                        {service.name}
                      </h3>
                      <p className="text-sm text-neutral-500 leading-relaxed">{service.shortDescription}</p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-neutral-400">
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {service.duration} хв
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-primary-600 text-lg">{formatPrice(service.startingPrice)}</p>
                      <ChevronRight size={16} className="text-neutral-300 group-hover:text-primary-600 transition-colors ml-auto mt-2" />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      ))}

      {services.length === 0 && (
        <p className="text-center text-neutral-500 py-12">Послуги завантажуються…</p>
      )}

      {/* Bottom booking CTA */}
      <div className="mt-8 text-center">
        <p className="text-neutral-500 mb-4">Маєте питання щодо вартості лікування?</p>
        <Link href="/contacts" className="btn-outline mr-4">Зв'яжіться з нами</Link>
        <Link href="/#booking" className="btn-primary">Записатися онлайн</Link>
      </div>
    </div>
  );
}
