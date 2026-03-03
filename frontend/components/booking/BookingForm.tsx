'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { servicesApi } from '@/lib/api';
import { useBooking } from '@/lib/hooks/useBooking';
import { TimeSlotPicker } from './TimeSlotPicker';
import { Button } from '@/components/ui/Button';
import { Calendar, User, Phone, MessageSquare, Stethoscope, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const schema = z.object({
  patientName: z.string().min(2, 'Введіть ваше ім'я (мін. 2 символи)'),
  phone: z.string().min(7, 'Введіть коректний номер телефону').regex(
    /^\+?[\d\s\-()]{7,20}$/,
    'Некоректний формат номера',
  ),
  serviceId: z.string().min(1, 'Оберіть послугу'),
  notes:     z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function BookingForm() {
  const { data: services = [] } = useQuery({
    queryKey: ['services-public'],
    queryFn:  servicesApi.getAll,
    staleTime: 10 * 60 * 1000,
  });

  const {
    selectedDate, selectedSlot, slots, slotsLoading,
    isSubmitting, isSuccess, selectDate, selectSlot, submitBooking,
  } = useBooking();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormValues) => {
    if (!selectedSlot) return;
    submitBooking(data);
    reset();
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center animate-fade-in">
        <CheckCircle className="text-primary-600" size={56} />
        <h3 className="text-2xl font-semibold text-neutral-900">Запис створено!</h3>
        <p className="text-neutral-500 max-w-sm">
          Наш адміністратор зв'яжеться з вами найближчим часом для підтвердження запису.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <label htmlFor="patientName" className="form-label">
            <User size={14} className="inline mr-1.5" />
            Ваше ім'я *
          </label>
          <input
            id="patientName"
            type="text"
            autoComplete="name"
            placeholder="Іван Петренко"
            className={cn('form-input', errors.patientName && 'border-red-400 focus:ring-red-400')}
            {...register('patientName')}
          />
          {errors.patientName && <p className="form-error">{errors.patientName.message}</p>}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="form-label">
            <Phone size={14} className="inline mr-1.5" />
            Телефон *
          </label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+38 (050) 000-00-00"
            className={cn('form-input', errors.phone && 'border-red-400 focus:ring-red-400')}
            {...register('phone')}
          />
          {errors.phone && <p className="form-error">{errors.phone.message}</p>}
        </div>
      </div>

      {/* Service */}
      <div>
        <label htmlFor="serviceId" className="form-label">
          <Stethoscope size={14} className="inline mr-1.5" />
          Послуга *
        </label>
        <select
          id="serviceId"
          className={cn('form-input', errors.serviceId && 'border-red-400 focus:ring-red-400')}
          {...register('serviceId')}
        >
          <option value="">— Оберіть послугу —</option>
          {services.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name} — від {s.startingPrice.toLocaleString('uk-UA')} грн
            </option>
          ))}
        </select>
        {errors.serviceId && <p className="form-error">{errors.serviceId.message}</p>}
      </div>

      {/* Date picker (simple native for now; can swap to custom calendar) */}
      <div>
        <label htmlFor="date" className="form-label">
          <Calendar size={14} className="inline mr-1.5" />
          Бажана дата *
        </label>
        <input
          id="date"
          type="date"
          min={new Date().toISOString().split('T')[0]}
          className="form-input"
          onChange={(e) => {
            if (e.target.value) selectDate(new Date(e.target.value));
          }}
        />
      </div>

      {/* Time slot picker */}
      {selectedDate && (
        <TimeSlotPicker
          slots={slots}
          loading={slotsLoading}
          selected={selectedSlot}
          onSelect={selectSlot}
        />
      )}

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="form-label">
          <MessageSquare size={14} className="inline mr-1.5" />
          Примітки (необов'язково)
        </label>
        <textarea
          id="notes"
          rows={3}
          placeholder="Вкажіть будь-яку додаткову інформацію..."
          className="form-input resize-none"
          {...register('notes')}
        />
      </div>

      <Button
        type="submit"
        size="lg"
        loading={isSubmitting}
        disabled={!selectedSlot}
        className="w-full sm:w-auto"
      >
        Записатися на прийом
      </Button>

      {!selectedSlot && selectedDate && (
        <p className="text-sm text-neutral-500 text-center">
          Оберіть зручний час вище
        </p>
      )}
    </form>
  );
}
