'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '@/services/api';
import { useAdminStore } from '@/stores/adminStore';

const loginSchema = z.object({
  email: z.string().email('Введіть коректний email'),
  password: z.string().min(1, 'Введіть пароль'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function AdminLoginPage() {
  const router = useRouter();
  const setAuth = useAdminStore((state) => state.setAuth);
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.adminLogin(data.email, data.password);
      setAuth(response.accessToken, response.admin);
      
      // Додаємо невелику затримку, щоб переконатися, що дані збереглися в localStorage
      await new Promise(resolve => setTimeout(resolve, 100));
      
      router.push('/admin/dashboard');
    } catch (err) {
      const message = (err as Error).message;
      if (message.includes('Failed to fetch') || message.includes('ERR_CONNECTION_REFUSED')) {
        setError('Сервер недоступний. Переконайтеся, що backend запущено на порту 3001.');
      } else {
        setError(message || 'Помилка входу');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-3xl">C</span>
          </div>
          <h1 className="text-2xl font-bold text-secondary-900">CosmoDent Admin</h1>
          <p className="text-secondary-600 mt-2">Вхід до системи управління</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="label-field">Email</label>
              <input
                type="email"
                {...register('email')}
                className="input-field"
                placeholder="admin@cosmodent.ua"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="label-field">Пароль</label>
              <input
                type="password"
                {...register('password')}
                className="input-field"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Вхід...' : 'Увійти'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-secondary-100">
            <p className="text-xs text-secondary-500 text-center mb-2">
              Демо-облікові дані:
            </p>
            <div className="bg-secondary-50 rounded-lg p-3 text-xs text-secondary-600">
              <div>Email: <code className="bg-white px-2 py-1 rounded">admin@cosmodent.ua</code></div>
              <div className="mt-1">Пароль: <code className="bg-white px-2 py-1 rounded">Admin123!</code></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
