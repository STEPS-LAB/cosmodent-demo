'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminStore } from '@/stores/adminStore';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { api } from '@/services/api';

interface DashboardStats {
  appointments: {
    totalAppointments: number;
    newAppointments: number;
    confirmedAppointments: number;
    completedAppointments: number;
    cancelledAppointments: number;
    todayAppointments: number;
    upcomingAppointments: number;
  };
  reviews: {
    totalReviews: number;
    activeReviews: number;
    averageRating: number;
  };
  services: number;
  doctors: number;
}

export function AdminDashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user, token } = useAdminStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Перевіряємо автентифікацію
    if (!isAuthenticated || !token) {
      router.push('/admin/login');
      return;
    }

    // Отримуємо статистику з API
    Promise.all([
      api.get<any>('/api/appointments').catch(() => []),
      api.get<any>('/api/reviews').catch(() => []),
      api.get<any>('/api/services').catch(() => []),
      api.get<any>('/api/doctors').catch(() => []),
    ])
      .then(([appointments, reviews, services, doctors]) => {
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        
        const todayAppointments = appointments.filter((a: any) => 
          a.date === today
        ).length;
        
        const upcomingAppointments = appointments.filter((a: any) => 
          a.date >= today && a.status !== 'cancelled'
        ).length;

        const newAppointments = appointments.filter((a: any) => 
          a.status === 'pending'
        ).length;

        const confirmedAppointments = appointments.filter((a: any) => 
          a.status === 'confirmed'
        ).length;

        const completedAppointments = appointments.filter((a: any) => 
          a.status === 'completed'
        ).length;

        const cancelledAppointments = appointments.filter((a: any) => 
          a.status === 'cancelled'
        ).length;

        const activeReviews = reviews.filter((r: any) => 
          r.status === 'approved' || r.status === 'active'
        ).length;

        const totalRating = reviews.reduce((sum: number, r: any) => 
          sum + (r.rating || 0), 0
        );
        const averageRating = reviews.length > 0 
          ? (totalRating / reviews.length).toFixed(1) 
          : 0;

        setStats({
          appointments: {
            totalAppointments: appointments.length,
            newAppointments,
            confirmedAppointments,
            completedAppointments,
            cancelledAppointments,
            todayAppointments,
            upcomingAppointments,
          },
          reviews: {
            totalReviews: reviews.length,
            activeReviews,
            averageRating: parseFloat(averageRating as string),
          },
          services: services.length,
          doctors: doctors.length,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error('Dashboard error:', err);
        setError('Не вдалося завантажити дані');
        setLoading(false);
      });
  }, [isAuthenticated, token, router]);

  if (!isAuthenticated || !token) {
    return null;
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-secondary-200 rounded w-1/4" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-secondary-200 rounded" />
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !stats) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-secondary-600">{error || 'Не вдалося завантажити дані'}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 btn-primary"
          >
            Оновити сторінку
          </button>
        </div>
      </AdminLayout>
    );
  }

  const statCards = [
    {
      title: 'Записи сьогодні',
      value: stats.appointments.todayAppointments,
      change: '+12%',
      color: 'bg-primary-500',
    },
    {
      title: 'Нові записи',
      value: stats.appointments.newAppointments,
      change: '+5%',
      color: 'bg-blue-500',
    },
    {
      title: 'Всього послуг',
      value: stats.services,
      change: '0%',
      color: 'bg-purple-500',
    },
    {
      title: 'Лікарів',
      value: stats.doctors,
      change: '0%',
      color: 'bg-orange-500',
    },
  ];

  return (
    <AdminLayout>
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-secondary-900">
            Вітаємо, {user?.name}!
          </h1>
          <p className="text-secondary-600 mt-1">
            Огляд активності клініки
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card) => (
            <div key={card.title} className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-600 mb-1">{card.title}</p>
                  <p className="text-3xl font-bold text-secondary-900">{card.value}</p>
                  <p className="text-sm text-primary-600 mt-1">{card.change}</p>
                </div>
                <div className={`w-12 h-12 ${card.color} rounded-lg opacity-20`} />
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Appointment Stats */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-secondary-900 mb-4">
              Статистика записів
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-secondary-600">Підтверджені</span>
                <span className="font-semibold">{stats.appointments.confirmedAppointments}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary-600">Завершені</span>
                <span className="font-semibold">{stats.appointments.completedAppointments}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary-600">Скасовані</span>
                <span className="font-semibold">{stats.appointments.cancelledAppointments}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t">
                <span className="font-semibold">Всього</span>
                <span className="font-bold text-lg">{stats.appointments.totalAppointments}</span>
              </div>
            </div>
          </div>

          {/* Review Stats */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-secondary-900 mb-4">
              Відгуки пацієнтів
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-secondary-600">Середній рейтинг</span>
                <span className="font-semibold text-lg">★ {stats.reviews.averageRating}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary-600">Активні відгуки</span>
                <span className="font-semibold">{stats.reviews.activeReviews}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary-600">Всього відгуків</span>
                <span className="font-semibold">{stats.reviews.totalReviews}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
