'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '@/services/api';
import { useAdminStore } from '@/stores/adminStore';

const loginSchema = z.object({
  email: z.string().min(1, 'Введіть логін'),
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
      // Спочатку пробуємо реальний API
      try {
        const response = await api.adminLogin(data.email, data.password) as {
          accessToken: string;
          admin: { id: string; email: string; name: string; role: string };
        };
        setAuth(response.accessToken, response.admin);
        await new Promise(resolve => setTimeout(resolve, 100));
        router.push('/admin/dashboard');
      } catch {
        // Якщо API недоступний, використовуємо демо-режим
        console.log('API недоступний, використовуємо демо-режим');

        if (data.email === 'admin' && data.password === '12345678') {
          const mockUser = {
            id: '1',
            email: 'admin',
            name: 'Admin',
            role: 'superadmin',
          };
          const mockToken = 'demo-admin-token';

          setAuth(mockToken, mockUser);
          await new Promise(resolve => setTimeout(resolve, 100));
          router.push('/admin/dashboard');
        } else {
          setError('Невірний логін або пароль');
        }
      }
    } catch (err) {
      setError((err as Error).message || 'Помилка входу');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-14 h-14 flex-shrink-0">
            <img
              src="/logo.png"
              alt="КОСМОДЕНТ"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-2xl font-bold text-secondary-900">КОСМОДЕНТ</span>
        </div>
        <h1 className="text-2xl font-bold text-secondary-900">Адмін-панель</h1>
        <p className="text-secondary-600 mt-2">Вхід до системи управління</p>
      </div>

      {/* Login Form */}
      <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="label-field">Email</label>
            <input
              type="text"
              {...register('email')}
              className="input-field"
              placeholder="admin"
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
            <div>Логін: <code className="bg-white px-2 py-1 rounded">admin</code></div>
            <div className="mt-1">Пароль: <code className="bg-white px-2 py-1 rounded">12345678</code></div>
          </div>
        </div>
      </div>
    </div>
  );
}
