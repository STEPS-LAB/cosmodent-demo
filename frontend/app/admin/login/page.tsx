'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Lock, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

const schema = z.object({
  email:    z.string().email('Введіть коректний email'),
  password: z.string().min(6, 'Мінімум 6 символів'),
});

type FormValues = z.infer<typeof schema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      const res = await authApi.login(data.email, data.password);
      localStorage.setItem('cosmodent_token', res.data.token);
      localStorage.setItem('cosmodent_admin', JSON.stringify(res.data.admin));
      toast.success(`Вітаємо, ${res.data.admin.name}!`);
      router.push('/admin');
    } catch (err: any) {
      const msg = err?.response?.data?.error ?? 'Помилка входу. Перевірте дані.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-button">
            <span className="text-white font-bold text-2xl">C</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">Cosmodent Admin</h1>
          <p className="text-neutral-500 text-sm mt-1">Увійдіть до панелі управління</p>
        </div>

        <div className="bg-white rounded-2xl shadow-card border border-neutral-100 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div>
              <label htmlFor="email" className="form-label">
                <Mail size={14} className="inline mr-1.5" />Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="form-input"
                placeholder="admin@cosmodent.ua"
                {...register('email')}
              />
              {errors.email && <p className="form-error">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="form-label">
                <Lock size={14} className="inline mr-1.5" />Пароль
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className="form-input"
                placeholder="••••••••"
                {...register('password')}
              />
              {errors.password && <p className="form-error">{errors.password.message}</p>}
            </div>

            <Button type="submit" loading={loading} className="w-full justify-center" size="lg">
              Увійти
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
