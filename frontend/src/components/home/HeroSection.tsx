import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-primary-50 to-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-100 rounded-full opacity-50 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-100 rounded-full opacity-50 blur-3xl" />
      </div>

      <div className="container-custom relative py-20 md:py-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-secondary-900 mb-6 leading-tight">
            Сучасна стоматологія для вашої ідеальної посмішки
          </h1>
          <p className="text-lg md:text-xl text-secondary-600 mb-8 leading-relaxed">
            Професійні стоматологічні послуги з використанням найновіших технологій. 
            Імплантація, протезування, відбілювання та лікування зубів у серці Києва.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/booking" className="btn-primary text-center">
              Записатися на прийом
            </Link>
            <Link href="/services" className="btn-outline text-center">
              Дізнатися більше
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 grid grid-cols-3 gap-6 md:gap-12">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary-600">15+</div>
              <div className="text-sm text-secondary-600 mt-1">Років досвіду</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary-600">5000+</div>
              <div className="text-sm text-secondary-600 mt-1">Задоволених пацієнтів</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary-600">20+</div>
              <div className="text-sm text-secondary-600 mt-1">Послуг</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
