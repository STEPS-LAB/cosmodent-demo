'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '@/services/api';
import { useBookingStore } from '@/stores/bookingStore';

const bookingSchema = z.object({
  patientName: z.string().min(2, "Ім&apos;я має містити щонайменше 2 символи"),
  patientPhone: z.string().min(10, 'Введіть коректний номер телефону'),
  patientEmail: z.string().email('Введіть коректний email').optional().or(z.literal('')),
  patientNotes: z.string().max(500, 'Нотатки не можуть перевищувати 500 символів').optional(),
  service: z.string().min(1, 'Оберіть послугу'),
  date: z.string().min(1, 'Оберіть дату'),
  timeSlot: z.string().min(1, 'Оберіть час'),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface Service {
  _id: string;
  name: string;
  slug: string;
  startingPrice: number;
}

interface TimeSlot {
  date: string;
  timeSlot: string;
  available: boolean;
  appointmentsCount: number;
}

export function BookingPage() {
  const searchParams = useSearchParams();
  const preselectedService = searchParams.get('service');

  const [services, setServices] = useState<Service[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      service: preselectedService || '',
      date: '',
      timeSlot: '',
    },
  });

  const selectedDate = watch('date');
  const selectedService = watch('service');

  // Load services
  useEffect(() => {
    api.getServices({ isActive: 'true' }).then((data) => {
      const servicesData = data as Service[];
      setServices(servicesData);
      if (preselectedService && servicesData.find((s: Service) => s._id === preselectedService)) {
        setValue('service', preselectedService);
      }
    });
  }, [preselectedService, setValue]);

  // Load available dates
  useEffect(() => {
    api.getAvailableDates().then((data) => {
      setAvailableDates(data as string[]);
    });
  }, []);

  // Load time slots when date changes
  useEffect(() => {
    if (selectedDate) {
      setLoadingSlots(true);
      api.getAvailableSlots(selectedDate, selectedService || undefined)
        .then((data) => {
          setTimeSlots(data as TimeSlot[]);
          setLoadingSlots(false);
        })
        .catch(() => {
          setTimeSlots([]);
          setLoadingSlots(false);
        });
    } else {
      setTimeSlots([]);
    }
  }, [selectedDate, selectedService]);

  const onSubmit = async (data: BookingFormData) => {
    setSubmitting(true);
    setError(null);

    try {
      await api.createAppointment({
        patientName: data.patientName,
        patientPhone: data.patientPhone,
        patientEmail: data.patientEmail,
        patientNotes: data.patientNotes,
        service: data.service,
        date: data.date,
        timeSlot: data.timeSlot,
      });

      setSuccess(true);
      useBookingStore.getState().clear();
    } catch (err) {
      setError((err as Error).message || 'Сталася помилка при створенні запису');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="py-12 sm:py-16">
        <div className="container-custom">
          <div className="max-w-lg mx-auto text-center px-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-secondary-900 mb-4">
              Запис успішно створено!
            </h1>
            <p className="text-secondary-600 mb-8 text-sm sm:text-base">
              Дякуємо за запис! Наш менеджер зв&apos;яжеться з вами найближчим часом для підтвердження.
            </p>
            <Link href="/" className="btn-primary w-full sm:w-auto inline-flex justify-center">
              Повернутися на головну
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-16">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-secondary-900 mb-4 text-center">
            Запис на прийом
          </h1>
          <p className="text-secondary-600 mb-8 text-center text-sm sm:text-base">
            Заповніть форму та оберіть зручний час для візиту
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Service Selection */}
            <div>
              <label className="label-field">Послуга *</label>
              <select
                {...register('service')}
                className="input-field"
                defaultValue=""
              >
                <option value="" disabled>Оберіть послугу</option>
                {services.map((service) => (
                  <option key={service._id} value={service._id}>
                    {service.name} - від {service.startingPrice} ₴
                  </option>
                ))}
              </select>
              {errors.service && (
                <p className="text-red-500 text-sm mt-1">{errors.service.message}</p>
              )}
            </div>

            {/* Personal Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label-field">Ім&apos;я *</label>
                <input
                  type="text"
                  {...register('patientName')}
                  className="input-field"
                  placeholder="Іван Петренко"
                />
                {errors.patientName && (
                  <p className="text-red-500 text-sm mt-1">{errors.patientName.message}</p>
                )}
              </div>

              <div>
                <label className="label-field">Телефон *</label>
                <input
                  type="tel"
                  {...register('patientPhone')}
                  className="input-field"
                  placeholder="+380 (__) ___-__-__"
                />
                {errors.patientPhone && (
                  <p className="text-red-500 text-sm mt-1">{errors.patientPhone.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="label-field">Email</label>
              <input
                type="email"
                {...register('patientEmail')}
                className="input-field"
                placeholder="email@example.com"
              />
              {errors.patientEmail && (
                <p className="text-red-500 text-sm mt-1">{errors.patientEmail.message}</p>
              )}
            </div>

            {/* Date Selection */}
            <div>
              <label className="label-field">Дата *</label>
              <select
                {...register('date')}
                className="input-field"
                defaultValue=""
              >
                <option value="" disabled>Оберіть дату</option>
                {availableDates.map((date) => (
                  <option key={date} value={date}>
                    {new Date(date).toLocaleDateString('uk-UA', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </option>
                ))}
              </select>
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
              )}
            </div>

            {/* Time Slots */}
            {selectedDate && (
              <div>
                <label className="label-field">Час *</label>
                {loadingSlots ? (
                  <div className="text-center py-4 text-secondary-500 text-sm">Завантаження...</div>
                ) : timeSlots.length === 0 ? (
                  <div className="text-center py-4 text-secondary-500 text-sm">
                    Немає доступних слотів на обрану дату
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot.timeSlot}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => setValue('timeSlot', slot.timeSlot)}
                        className={`py-2 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                          !slot.available
                            ? 'bg-secondary-100 text-secondary-400 cursor-not-allowed'
                            : watch('timeSlot') === slot.timeSlot
                            ? 'bg-primary-600 text-white'
                            : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                        }`}
                      >
                        {slot.timeSlot}
                      </button>
                    ))}
                  </div>
                )}
                {errors.timeSlot && (
                  <p className="text-red-500 text-sm mt-1">{errors.timeSlot.message}</p>
                )}
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="label-field">Нотатки (необов&apos;язково)</label>
              <textarea
                {...register('patientNotes')}
                className="input-field"
                rows={3}
                placeholder="Бажаєте щось додати?"
              />
              {errors.patientNotes && (
                <p className="text-red-500 text-sm mt-1">{errors.patientNotes.message}</p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full"
            >
              {submitting ? 'Створення запису...' : 'Записатися на прийом'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
