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
  bio: string;
  experience: number;
  education: string[];
  rating?: number;
  reviewsCount?: number;
}

export function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDoctors({ isActive: 'true' }).then((data) => {
      setDoctors(data as any[]);
      setLoading(false);
    });
  }, []);

  return (
    <div className="py-12 md:py-16">
      <div className="container-custom">
        <div className="max-w-3xl mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-4">
            Наші лікарі
          </h1>
          <p className="text-lg text-secondary-600">
            Досвідчені фахівці, які постійно вдосконалюють свої навички
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
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
                  className="card p-6 text-center group sm:hover:border-primary-200 transition-all duration-300"
                >
                  <div className="w-32 h-32 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-4xl font-bold text-primary-600">
                      {doctor.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-secondary-900 sm:group-hover:text-primary-600 transition-colors mb-1">
                    {doctor.name}
                  </h3>
                  <p className="text-primary-600 text-sm mb-3">{doctor.position}</p>
                  <div className="flex flex-wrap justify-center gap-1 mb-4">
                    {doctor.specialization.slice(0, 3).map((spec) => (
                      <span
                        key={spec}
                        className="text-xs px-2 py-1 bg-secondary-100 text-secondary-600 rounded"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-center gap-4 text-sm text-secondary-500">
                    <span>{doctor.experience} років досвіду</span>
                    {doctor.reviewsCount ? (
                      <span>★ {doctor.rating?.toFixed(1)} ({doctor.reviewsCount})</span>
                    ) : null}
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </div>
  );
}
