'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export function HeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative bg-white overflow-hidden min-h-[85vh] sm:min-h-[90vh] flex items-center">
      {/* Animated background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large gradient orbs - with Safari fixes (reduced blur) */}
        <div className="absolute -top-20 -right-20 sm:-top-40 sm:-right-40 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-br from-primary-200/50 to-primary-300/50 rounded-full opacity-100 blur-2xl float animate-pulse-slow will-change-transform" />
        <div className="absolute -bottom-20 -left-20 sm:-bottom-40 sm:-left-40 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-tr from-primary-200/50 to-primary-300/50 rounded-full opacity-100 blur-2xl float-delayed animate-pulse-slow will-change-transform" />

        {/* Additional decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-br from-primary-100/40 to-transparent rounded-full opacity-80 blur-xl float will-change-transform" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-tl from-primary-100/40 to-transparent rounded-full opacity-80 blur-xl float-delayed will-change-transform" style={{ animationDelay: '2s' }} />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMTAgNjAgTSAwIDEwIEwgNjAgMTAiIHN0cm9rZT0iIzEwYjk4MSIgc3Ryb2tlLXdpZHRoPSIwLjI1IiBmaWxsPSJub25lIiBvcGFjaXR5PSIwLjAzIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-10" />
      </div>

      <div className="container-custom relative py-16 sm:py-20 md:py-32 z-10">
        <div className="max-w-4xl">
          {/* Badge */}
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/80 backdrop-blur-sm border border-primary-200 rounded-full mb-6 sm:mb-8 shadow-lg shadow-primary-500/10 animate-fade-in-down ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            <span className="text-xs sm:text-sm font-medium text-primary-700">Провідна стоматологічна клініка</span>
          </div>

          {/* Main heading */}
          <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-secondary-900 mb-6 sm:mb-8 leading-tight animate-fade-in-up ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '100ms' }}>
            Сучасна стоматологія для{' '}
            <span className="text-gradient-primary bg-gradient-to-r from-primary-600 via-primary-500 to-emerald-500">вашої ідеальної</span>
            {' '}посмішки
          </h1>

          {/* Subtitle */}
          <p className={`text-base sm:text-xl md:text-2xl text-secondary-600 mb-8 sm:mb-10 leading-relaxed max-w-3xl animate-fade-in-up ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '200ms' }}>
            Професійні стоматологічні послуги з використанням найновіших технологій.
            Імплантація, протезування, відбілювання та лікування зубів у серці Житомира.
          </p>

          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 mb-12 sm:mb-16 animate-fade-in-up ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '300ms' }}>
            <Link href="/booking" className="btn-primary group w-full sm:w-auto">
              Записатися на прийом
              <svg className="ml-2 w-5 h-5 sm:group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link href="/services" className="btn-outline group w-full sm:w-auto">
              Дізнатися більше
              <svg className="ml-2 w-5 h-5 sm:group-hover:rotate-45 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className={`grid grid-cols-3 gap-4 sm:gap-6 md:gap-12 animate-fade-in-up justify-center ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '400ms' }}>
            <div className="group text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary-600 sm:group-hover:scale-110 transition-transform duration-300">15+</div>
              <div className="text-xs sm:text-sm md:text-base text-secondary-600 mt-1 sm:mt-2 font-medium">Років досвіду</div>
            </div>
            <div className="group text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary-600 sm:group-hover:scale-110 transition-transform duration-300">5000+</div>
              <div className="text-xs sm:text-sm md:text-base text-secondary-600 mt-1 sm:mt-2 font-medium">Задоволених пацієнтів</div>
            </div>
            <div className="group text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary-600 sm:group-hover:scale-110 transition-transform duration-300">20+</div>
              <div className="text-xs sm:text-sm md:text-base text-secondary-600 mt-1 sm:mt-2 font-medium">Послуг</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator - only visible on desktop */}
      <div className={`hidden sm:block absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-slow ${mounted ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '1s' }}>
        <div className="w-6 h-10 border-2 border-secondary-300 rounded-full flex items-start justify-center p-2">
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-slide-down" />
        </div>
      </div>
    </section>
  );
}
