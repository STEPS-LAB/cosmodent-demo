'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { reviewsApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Star, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const schema = z.object({
  patientName: z.string().min(2, 'Введіть ваше ім'я'),
  rating:      z.number().min(1, 'Оберіть оцінку').max(5),
  text:        z.string().min(20, 'Напишіть хоча б 20 символів').max(2000),
});

type FormValues = z.infer<typeof schema>;

export function ReviewSubmitForm() {
  const [hovered, setHovered] = useState(0);

  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { rating: 0 },
  });

  const rating = watch('rating');

  const mutation = useMutation({
    mutationFn: (data: FormValues) => reviewsApi.submit(data),
    onSuccess: () => reset(),
  });

  const onSubmit = (data: FormValues) => mutation.mutate(data);

  if (mutation.isSuccess) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center animate-fade-in">
        <CheckCircle className="text-primary-600" size={48} />
        <h3 className="text-xl font-semibold">Дякуємо за відгук!</h3>
        <p className="text-neutral-500 text-sm">Після модерації він з'явиться на сайті.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div>
        <label htmlFor="patientName" className="form-label">Ваше ім'я *</label>
        <input
          id="patientName"
          type="text"
          className={cn('form-input', errors.patientName && 'border-red-400')}
          placeholder="Іван Петренко"
          {...register('patientName')}
        />
        {errors.patientName && <p className="form-error">{errors.patientName.message}</p>}
      </div>

      {/* Star selector */}
      <div>
        <p className="form-label">Оцінка *</p>
        <div className="flex gap-2" role="radiogroup" aria-label="Рейтинг">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={rating === n}
              aria-label={`${n} зірок`}
              onClick={() => setValue('rating', n, { shouldValidate: true })}
              onMouseEnter={() => setHovered(n)}
              onMouseLeave={() => setHovered(0)}
              className="focus:outline-none"
            >
              <Star
                size={28}
                className={cn(
                  'transition-colors',
                  (hovered || rating) >= n ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-300',
                )}
              />
            </button>
          ))}
        </div>
        {errors.rating && <p className="form-error">{errors.rating.message}</p>}
      </div>

      <div>
        <label htmlFor="text" className="form-label">Ваш відгук *</label>
        <textarea
          id="text"
          rows={4}
          placeholder="Розкажіть про свій досвід лікування…"
          className={cn('form-input resize-none', errors.text && 'border-red-400')}
          {...register('text')}
        />
        {errors.text && <p className="form-error">{errors.text.message}</p>}
      </div>

      <Button type="submit" loading={mutation.isPending} className="w-full justify-center">
        Надіслати відгук
      </Button>
    </form>
  );
}
