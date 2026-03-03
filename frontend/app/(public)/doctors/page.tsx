import type { Metadata } from 'next';
import { doctorsApi } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { StarRating } from '@/components/ui/StarRating';
import { BookingForm } from '@/components/booking/BookingForm';
import Link from 'next/link';
import { Award } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Наші лікарі',
  description: 'Досвідчена команда стоматологів клініки Cosmodent. Хірурги, ортодонти, терапевти з підтвердженою кваліфікацією.',
};

export const revalidate = 300;

export default async function DoctorsPage() {
  const doctors = await doctorsApi.getAll().catch(() => []);

  return (
    <div className="container-site py-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="section-heading">Наші лікарі</h1>
        <p className="section-subheading mx-auto">
          Команда Cosmodent — це кандидати медичних наук, сертифіковані фахівці та лауреати міжнародних конкурсів
        </p>
      </div>

      {/* Doctors grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger">
        {doctors.map((doctor) => (
          <Card key={doctor._id} className="overflow-hidden animate-fade-in hover-lift">
            {/* Photo */}
            <div className="h-52 bg-gradient-to-br from-primary-100 to-mint-100 flex items-center justify-center">
              {doctor.photo ? (
                <img
                  src={doctor.photo}
                  alt={doctor.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 bg-primary-200 rounded-full flex items-center justify-center">
                  <span className="text-primary-700 text-4xl font-bold">{doctor.name[0]}</span>
                </div>
              )}
            </div>

            <div className="p-6">
              <h2 className="text-xl font-semibold text-neutral-900">{doctor.name}</h2>
              <p className="text-primary-600 font-medium text-sm mt-1">{doctor.specialization}</p>

              <div className="flex items-center gap-3 mt-3">
                <StarRating rating={doctor.rating} size={14} />
                <span className="text-xs text-neutral-500">{doctor.reviewCount} відгуків</span>
              </div>

              <div className="flex items-center gap-2 mt-3 text-xs text-neutral-500">
                <Award size={13} className="text-primary-400" />
                {doctor.experience} років досвіду
              </div>

              <p className="text-sm text-neutral-600 mt-4 leading-relaxed line-clamp-3">{doctor.bio}</p>

              {doctor.services.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {doctor.services.slice(0, 3).map((s) => (
                    <Link
                      key={s._id}
                      href={`/services/${s.slug}`}
                      className="badge-green text-xs hover:bg-primary-200 transition-colors"
                    >
                      {s.name}
                    </Link>
                  ))}
                </div>
              )}

              <Link href="/#booking" className="btn-primary w-full justify-center mt-6 text-sm">
                Записатися до {doctor.name.split(' ')[0]}
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {doctors.length === 0 && (
        <p className="text-center text-neutral-500 py-16">Інформація про лікарів завантажується…</p>
      )}

      {/* Bottom CTA */}
      <section className="mt-16 max-w-2xl mx-auto" aria-labelledby="book-heading">
        <div className="text-center mb-8">
          <h2 id="book-heading" className="text-2xl font-semibold text-neutral-900">
            Обрали лікаря? Запишіться онлайн!
          </h2>
        </div>
        <Card className="p-8">
          <BookingForm />
        </Card>
      </section>
    </div>
  );
}
