'use client';

import Link from 'next/link';

export function BookingCTA() {
  return (
    <section className="py-16 sm:py-20 md:py-28 relative overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-500 to-emerald-600" />

      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 sm:-top-40 sm:-right-40 w-64 h-64 sm:w-96 sm:h-96 bg-white/10 rounded-full blur-3xl float animate-pulse-slow" />
        <div className="absolute -bottom-20 -left-20 sm:-bottom-40 sm:-left-40 w-64 h-64 sm:w-96 sm:h-96 bg-white/10 rounded-full blur-3xl float-delayed animate-pulse-slow" />
        <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-64 sm:h-64 bg-white/5 rounded-full blur-2xl float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-64 sm:h-64 bg-white/5 rounded-full blur-2xl float-delayed" style={{ animationDelay: '2s' }} />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMTAgNjAgTSAwIDEwIEwgNjAgMTAiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIwLjI1IiBmaWxsPSJub25lIiBvcGFjaXR5PSIwLjA1Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full mb-6 sm:mb-8 animate-fade-in-down">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span className="text-xs sm:text-sm font-medium text-white">Безкоштовна консультація</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight animate-fade-in-up">
            Готові до ідеальної{' '}
            <span className="text-white/90">посмішки?</span>
          </h2>

          <p className="text-base sm:text-xl text-primary-100 mb-8 sm:mb-10 leading-relaxed max-w-2xl mx-auto animate-fade-in-up" style={{ transitionDelay: '100ms' }}>
            Запишіться на безкоштовну консультацію вже сьогодні.
            Наші фахівці допоможуть вам обрати оптимальний план лікування.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-fade-in-up" style={{ transitionDelay: '200ms' }}>
            <Link
              href="/booking"
              className="group relative inline-flex items-center justify-center px-6 sm:px-8 py-4 sm:py-5 text-base font-semibold text-primary-600 bg-white rounded-xl hover:bg-primary-50 transition-all duration-300 shadow-xl shadow-secondary-900/20 hover:shadow-2xl hover:shadow-secondary-900/30 hover:-translate-y-1 overflow-hidden w-full sm:w-auto"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/50 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <span className="relative flex items-center gap-2">
                Записатися онлайн
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </Link>

            <a
              href="tel:+380679082629"
              className="group relative inline-flex items-center justify-center px-6 sm:px-8 py-4 sm:py-5 text-base font-semibold text-white border-2 border-white/50 rounded-xl hover:bg-white/10 hover:border-white transition-all duration-300 backdrop-blur-sm hover:-translate-y-1 w-full sm:w-auto"
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Зателефонувати
              </span>
            </a>
          </div>

          {/* Trust badges */}
          <div className="mt-8 sm:mt-12 flex flex-wrap justify-center gap-4 sm:gap-6 animate-fade-in-up" style={{ transitionDelay: '300ms' }}>
            {[
              { icon: '✓', text: 'Безкоштовна консультація' },
              { icon: '✓', text: 'Індивідуальний план' },
              { icon: '✓', text: 'Сучасне обладнання' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-white/90 text-xs sm:text-sm font-medium">
                <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-xs">
                  {item.icon}
                </span>
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
