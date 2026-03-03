'use client';

import { useEffect, useState } from 'react';
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

  useEffect(() => {
    api.getDoctors({ isActive: 'true' }).then((data) => {
      setDoctors(data.slice(0, 4));
      setLoading(false);
    });
  }, []);

  return (
    <section className="py-16 md:py-24 bg-secondary-50">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="section-title text-center">Наші лікарі</h2>
          <p className="section-subtitle text-center mx-auto">
            Досвідчені фахівці, які дбають про ваше здоров'я
          </p>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="card p-6 animate-pulse text-center">
                  <div className="w-24 h-24 bg-secondary-200 rounded-full mx-auto mb-4" />
                  <div className="h-5 bg-secondary-200 rounded w-3/4 mx-auto mb-2" />
                  <div className="h-4 bg-secondary-200 rounded w-1/2 mx-auto" />
                </div>
              ))
            : doctors.map((doctor) => (
                <Link
                  key={doctor._id}
                  href={`/doctors/${doctor.slug}`}
                  className="card p-6 text-center group hover:border-primary-200 transition-all duration-300"
                >
                  <div className="w-24 h-24 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-3xl font-bold text-primary-600">
                      {doctor.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors">
                    {doctor.name}
                  </h3>
                  <p className="text-primary-600 text-sm mb-2">{doctor.position}</p>
                  <div className="flex flex-wrap justify-center gap-1">
                    {doctor.specialization.slice(0, 2).map((spec) => (
                      <span
                        key={spec}
                        className="text-xs px-2 py-1 bg-secondary-100 text-secondary-600 rounded"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
        </div>

        {/* View All */}
        <div className="text-center mt-12">
          <Link href="/doctors" className="btn-outline">
            Всі лікарі
          </Link>
        </div>
      </div>
    </section>
  );
}
