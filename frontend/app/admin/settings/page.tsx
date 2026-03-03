'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { settingsApi } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useForm } from 'react-hook-form';
import { ClinicSettings } from '@/types';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

export default function SettingsAdminPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn:  () => settingsApi.adminGet(),
  });

  const settings = data?.data?.data;

  const { register, handleSubmit, reset } = useForm<ClinicSettings>();

  useEffect(() => {
    if (settings) reset(settings);
  }, [settings, reset]);

  const update = useMutation({
    mutationFn: (d: Partial<ClinicSettings>) => settingsApi.adminUpdate(d),
    onSuccess: () => toast.success('Налаштування збережено'),
    onError:   () => toast.error('Помилка збереження'),
  });

  if (isLoading) return <p className="text-neutral-400 py-8">Завантаження…</p>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Налаштування сайту</h1>
        <p className="text-neutral-500 text-sm mt-1">Контакти, SEO, соціальні мережі</p>
      </div>

      <form onSubmit={handleSubmit((d) => update.mutate(d))} className="space-y-6 max-w-2xl">
        {/* Basic info */}
        <Card className="p-6 space-y-4">
          <h2 className="font-semibold text-neutral-900 text-lg border-b border-neutral-100 pb-3">Загальна інформація</h2>
          <div>
            <label className="form-label">Назва клініки</label>
            <input className="form-input" {...register('clinicName')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Телефон</label>
              <input className="form-input" {...register('phone')} />
            </div>
            <div>
              <label className="form-label">Email</label>
              <input type="email" className="form-input" {...register('email')} />
            </div>
          </div>
          <div>
            <label className="form-label">Адреса</label>
            <input className="form-input" {...register('address')} />
          </div>
        </Card>

        {/* Hero */}
        <Card className="p-6 space-y-4">
          <h2 className="font-semibold text-neutral-900 text-lg border-b border-neutral-100 pb-3">Головна сторінка</h2>
          <div>
            <label className="form-label">Заголовок Hero</label>
            <input className="form-input" {...register('heroHeading')} />
          </div>
          <div>
            <label className="form-label">Підзаголовок Hero</label>
            <input className="form-input" {...register('heroSubheading')} />
          </div>
        </Card>

        {/* Working hours */}
        <Card className="p-6 space-y-4">
          <h2 className="font-semibold text-neutral-900 text-lg border-b border-neutral-100 pb-3">Графік роботи</h2>
          <div>
            <label className="form-label">Пн–Пт</label>
            <input className="form-input" {...register('workingHours.weekdays')} />
          </div>
          <div>
            <label className="form-label">Субота</label>
            <input className="form-input" {...register('workingHours.saturday')} />
          </div>
          <div>
            <label className="form-label">Неділя</label>
            <input className="form-input" {...register('workingHours.sunday')} />
          </div>
        </Card>

        {/* Socials */}
        <Card className="p-6 space-y-4">
          <h2 className="font-semibold text-neutral-900 text-lg border-b border-neutral-100 pb-3">Соціальні мережі</h2>
          {['instagram', 'facebook', 'telegram', 'youtube'].map((key) => (
            <div key={key}>
              <label className="form-label capitalize">{key}</label>
              <input className="form-input" {...register(`socialLinks.${key}` as any)} />
            </div>
          ))}
        </Card>

        {/* SEO */}
        <Card className="p-6 space-y-4">
          <h2 className="font-semibold text-neutral-900 text-lg border-b border-neutral-100 pb-3">SEO</h2>
          <div>
            <label className="form-label">Мета-заголовок (max 70 символів)</label>
            <input className="form-input" {...register('seo.defaultTitle')} maxLength={70} />
          </div>
          <div>
            <label className="form-label">Мета-опис (max 160 символів)</label>
            <textarea className="form-input" rows={3} {...register('seo.defaultDescription')} maxLength={160} />
          </div>
          <div>
            <label className="form-label">Google Analytics ID</label>
            <input className="form-input" placeholder="G-XXXXXXXXXX" {...register('seo.googleAnalyticsId')} />
          </div>
        </Card>

        <Button type="submit" loading={update.isPending} size="lg">
          Зберегти налаштування
        </Button>
      </form>
    </div>
  );
}
