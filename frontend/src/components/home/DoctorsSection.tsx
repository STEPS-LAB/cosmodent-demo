'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { api } from '@/services/api';

interface Doctor {
  _id: string;
  name: string;
  slug: string;
  position: string;
  specialization: string[];
  imageUrl?: string;
  experience: number;
}

export function DoctorsSection() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    api.getDoctors({ isActive: 'true' }).then((data) => {
      setDoctors(data.slice(0, 4));
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            if (!isNaN(index)) {
              setVisibleItems((prev) => [...prev, index]);
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    const elements = document.querySelectorAll('[data-doctor-item]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [loading]);

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 md:py-28 bg-gradient-to-b from-secondary-50 via-white to-secondary-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-80 sm:h-80 bg-gradient-to-br from-primary-100/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-80 sm:h-80 bg-gradient-to-tl from-primary-100/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary-200 to-transparent" />
      </div>

      <div className="container-custom relative z-10">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-primary-50 border border-primary-200 rounded-full mb-6 animate-fade-in-up">
            <span className="text-xs sm:text-sm font-semibold text-primary-700 uppercase tracking-wide">Наші лікарі</span>
          </div>
          <h2 className="section-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center">Команда професіоналів</h2>
          <p className="section-subtitle text-base sm:text-xl md:text-2xl text-center mx-auto max-w-2xl sm:max-w-3xl">
            Досвідчені фахівці, які дбають про ваше здоров&apos;я та створюють ідеальні посмішки
          </p>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="card-premium p-6 sm:p-8 animate-pulse text-center">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 bg-secondary-200 rounded-full mx-auto mb-6" />
                  <div className="h-5 sm:h-6 bg-secondary-200 rounded w-3/4 mx-auto mb-3" />
                  <div className="h-4 bg-secondary-200 rounded w-1/2 mx-auto mb-4" />
                  <div className="flex justify-center gap-2">
                    <div className="h-6 w-20 bg-secondary-200 rounded-full" />
                  </div>
                </div>
              ))
            : doctors.map((doctor, index) => (
                <Link
                  key={doctor._id}
                  href={`/doctors/${doctor.slug}`}
                  data-doctor-item
                  data-index={index}
                  className={`card-premium p-6 sm:p-8 text-center group relative overflow-hidden ${
                    visibleItems.includes(index) ? 'animate-fade-in-up opacity-100' : 'opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 via-transparent to-primary-500/0 group-hover:from-primary-500/5 group-hover:to-primary-500/10 transition-all duration-700" />

                  {/* Avatar with ring effect */}
                  <div className="relative mb-6 inline-block">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-500 scale-110" />
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-primary-100 via-primary-50 to-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-primary-500/20 group-hover:shadow-xl group-hover:shadow-primary-500/30 transition-all duration-500 group-hover:scale-110">
                      <span className="text-3xl sm:text-4xl font-bold bg-gradient-to-br from-primary-600 to-primary-500 bg-clip-text text-transparent">
                        {doctor.name.charAt(0)}
                      </span>
                    </div>
                    {/* Experience badge */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 sm:px-3 sm:py-1 bg-gradient-to-r from-primary-600 to-primary-500 text-white text-xs font-semibold rounded-full shadow-lg whitespace-nowrap">
                      {doctor.experience} років
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative">
                    <h3 className="text-lg sm:text-xl font-bold text-secondary-900 group-hover:text-primary-600 transition-colors duration-300 mb-2">
                      {doctor.name}
                    </h3>
                    <p className="text-primary-600 font-semibold text-sm mb-4">{doctor.position}</p>

                    {/* Specializations */}
                    <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
                      {doctor.specialization.slice(0, 2).map((spec) => (
                        <span
                          key={spec}
                          className="text-xs px-2 py-1 sm:px-3 sm:py-1.5 bg-gradient-to-r from-secondary-100 to-secondary-50 text-secondary-600 rounded-full font-medium border border-secondary-200 group-hover:border-primary-300 group-hover:bg-primary-50 group-hover:text-primary-700 transition-all duration-300"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>

                    {/* Hover arrow indicator */}
                    <div className="mt-4 sm:mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-primary-600">
                        Детальніше
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </div>
                  </div>

                  {/* Corner decoration */}
                  <div className="absolute -top-4 -right-4 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary-100/50 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
                </Link>
              ))}
        </div>

        {/* View All */}
        <div className="text-center mt-12 sm:mt-16">
          <Link href="/doctors" className="btn-outline inline-flex items-center gap-2 group w-full sm:w-auto justify-center">
            Всі лікарі
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
