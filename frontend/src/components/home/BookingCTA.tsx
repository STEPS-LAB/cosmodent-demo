import Link from 'next/link';

export function BookingCTA() {
  return (
    <section className="py-16 md:py-24 bg-primary-600">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Готові до ідеальної посмішки?
          </h2>
          <p className="text-primary-100 text-lg mb-8">
            Запишіться на безкоштовну консультацію вже сьогодні. 
            Наші фахівці допоможуть вам обрати оптимальний план лікування.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/booking" className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-primary-600 bg-white rounded-lg hover:bg-primary-50 transition-colors duration-200">
              Записатися онлайн
            </Link>
            <a
              href="tel:+380441234567"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white border-2 border-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
            >
              Зателефонувати
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
