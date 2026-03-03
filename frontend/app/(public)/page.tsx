import type { Metadata } from 'next';
import Link from 'next/link';
import { BookingForm } from '@/components/booking/BookingForm';
import { Card } from '@/components/ui/Card';
import { servicesApi, reviewsApi, doctorsApi } from '@/lib/api';
import { StarRating } from '@/components/ui/StarRating';
import { formatPrice } from '@/lib/utils';
import {
  ShieldCheck, Clock, Award, Smile, ChevronRight, Sparkles,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cosmodent — Стоматологічна клініка у Києві',
  description: 'Сучасна стоматологічна клініка Cosmodent. Імплантологія, ортодонтія, естетична стоматологія. Запис онлайн.',
};

// Revalidate page every 5 min (ISR)
export const revalidate = 300;

async function getData() {
  const [services, reviews, doctors] = await Promise.allSettled([
    servicesApi.getAll(),
    reviewsApi.getHighlighted(3),
    doctorsApi.getAll(),
  ]);
  return {
    services: services.status === 'fulfilled' ? services.value.slice(0, 6) : [],
    reviews:  reviews.status  === 'fulfilled' ? reviews.value  : [],
    doctors:  doctors.status  === 'fulfilled' ? doctors.value.slice(0, 3) : [],
  };
}

const FEATURES = [
  { icon: ShieldCheck, title: 'Гарантія якості',       desc: 'Довічна гарантія на імпланти та протезування'           },
  { icon: Award,       title: 'Досвідчені лікарі',      desc: 'Понад 15 років досвіду, понад 10 000 щасливих пацієнтів' },
  { icon: Clock,       title: 'Зручний графік',         desc: 'Пн–Пт 09:00–20:00, Сб 09:00–17:00'                     },
  { icon: Smile,       title: 'Безболісне лікування',   desc: 'Сучасна анестезія та бережний підхід до кожного'         },
];

export default async function HomePage() {
  const { services, reviews, doctors } = await getData();

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-mint-50">
        {/* Decorative blobs */}
        <div aria-hidden className="absolute -top-24 -right-24 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-60" />
        <div aria-hidden className="absolute -bottom-16 -left-16 w-72 h-72 bg-mint-100 rounded-full blur-3xl opacity-40" />

        <div className="container-site relative py-20 md:py-28 lg:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 text-sm font-medium px-4 py-2 rounded-full mb-6 animate-fade-in">
              <Sparkles size={14} />
              Сучасна стоматологія 2026
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 leading-tight tracking-tight animate-slide-up">
              Ваша усмішка —<br />
              <span className="text-primary-600">наша місія</span>
            </h1>

            <p className="mt-6 text-xl text-neutral-500 max-w-xl leading-relaxed animate-slide-up" style={{ animationDelay: '100ms' }}>
              Cosmodent — клініка, де технології зустрічаються з турботою. Лікуємо без болю, відновлюємо з гарантією, повертаємо впевненість у своїй посмішці.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <a href="#booking" className="btn-primary text-lg px-8 py-4">
                Записатися онлайн
              </a>
              <Link href="/services" className="btn-outline text-lg px-8 py-4">
                Наші послуги
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-10 flex flex-wrap gap-6 text-sm text-neutral-500 animate-slide-up" style={{ animationDelay: '300ms' }}>
              <span className="flex items-center gap-1.5"><ShieldCheck size={16} className="text-primary-600" /> Ліцензія МОЗ</span>
              <span className="flex items-center gap-1.5"><Award size={16} className="text-primary-600" /> 10 000+ пацієнтів</span>
              <span className="flex items-center gap-1.5"><Smile size={16} className="text-primary-600" /> 4.9★ рейтинг</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────── */}
      <section className="container-site py-16" aria-labelledby="features-heading">
        <h2 id="features-heading" className="sr-only">Переваги клініки</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="p-6 text-center animate-fade-in">
              <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon className="text-primary-600" size={22} />
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">{title}</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">{desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Services preview ──────────────────────────────── */}
      <section className="bg-neutral-50 py-16" aria-labelledby="services-heading">
        <div className="container-site">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 id="services-heading" className="section-heading">Наші послуги</h2>
              <p className="section-subheading">Повний спектр стоматологічної допомоги</p>
            </div>
            <Link href="/services" className="hidden sm:flex items-center gap-1 text-primary-600 font-medium hover:underline">
              Всі послуги <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
            {services.map((service) => (
              <Link key={service._id} href={`/services/${service.slug}`}>
                <Card className="p-6 h-full hover-lift animate-fade-in group cursor-pointer">
                  <h3 className="font-semibold text-lg text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-sm text-neutral-500 mb-4 leading-relaxed">{service.shortDescription}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-primary-600 font-semibold">{formatPrice(service.startingPrice)}</span>
                    <ChevronRight size={16} className="text-neutral-400 group-hover:text-primary-600 transition-colors" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link href="/services" className="btn-outline">Всі послуги</Link>
          </div>
        </div>
      </section>

      {/* ── Doctors preview ───────────────────────────────── */}
      {doctors.length > 0 && (
        <section className="container-site py-16" aria-labelledby="doctors-heading">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 id="doctors-heading" className="section-heading">Наші лікарі</h2>
              <p className="section-subheading">Досвідчена команда з великим серцем</p>
            </div>
            <Link href="/doctors" className="hidden sm:flex items-center gap-1 text-primary-600 font-medium hover:underline">
              Всі лікарі <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 stagger">
            {doctors.map((doctor) => (
              <Card key={doctor._id} className="p-6 text-center animate-fade-in hover-lift">
                <div className="w-20 h-20 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-primary-600 text-2xl font-bold">{doctor.name[0]}</span>
                </div>
                <h3 className="font-semibold text-neutral-900">{doctor.name}</h3>
                <p className="text-sm text-primary-600 mt-1">{doctor.specialization}</p>
                <p className="text-xs text-neutral-400 mt-1">{doctor.experience} р. досвіду</p>
                <StarRating rating={doctor.rating} size={14} className="justify-center mt-3" />
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* ── Reviews preview ───────────────────────────────── */}
      {reviews.length > 0 && (
        <section className="bg-primary-50 py-16" aria-labelledby="reviews-heading">
          <div className="container-site">
            <div className="text-center mb-10">
              <h2 id="reviews-heading" className="section-heading">Що кажуть наші пацієнти</h2>
              <p className="section-subheading mx-auto">Справжні відгуки від задоволених пацієнтів</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger">
              {reviews.map((review) => (
                <Card key={review._id} className="p-6 animate-fade-in">
                  <StarRating rating={review.rating} size={16} className="mb-3" />
                  <p className="text-neutral-700 text-sm leading-relaxed mb-4">"{review.text}"</p>
                  <p className="font-medium text-neutral-900 text-sm">{review.patientName}</p>
                  {review.doctorId && (
                    <p className="text-xs text-neutral-400 mt-0.5">Лікар: {review.doctorId.name}</p>
                  )}
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link href="/reviews" className="btn-outline">Всі відгуки</Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Booking form ──────────────────────────────────── */}
      <section id="booking" className="container-site py-16" aria-labelledby="booking-heading">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 id="booking-heading" className="section-heading">Записатися на прийом</h2>
            <p className="section-subheading mx-auto">
              Оберіть послугу, зручний час — і ми підтвердимо запис протягом декількох хвилин
            </p>
          </div>
          <Card className="p-8">
            <BookingForm />
          </Card>
        </div>
      </section>
    </>
  );
}
