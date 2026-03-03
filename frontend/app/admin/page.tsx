'use client';

import { useQuery } from '@tanstack/react-query';
import { appointmentsApi } from '@/lib/api';
import { useWebSocket } from '@/lib/hooks/useWebSocket';
import { Card } from '@/components/ui/Card';
import { statusLabel, statusBadgeClass, formatDateTime } from '@/lib/utils';
import { Calendar, TrendingUp, CheckCircle, XCircle, Bell } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function AdminDashboardPage() {
  const [notification, setNotification] = useState<string | null>(null);

  // Real-time WebSocket notifications
  useWebSocket({
    'appointment:created': (msg) => {
      const p = msg.payload as { patientName: string; timeSlot: string };
      const text = `Новий запис: ${p.patientName} о ${p.timeSlot}`;
      toast.success(text, { icon: '🦷', duration: 6000 });
      setNotification(text);
      refetch();
    },
    'appointment:updated': () => refetch(),
  });

  const { data: stats, refetch } = useQuery({
    queryKey:      ['admin-stats'],
    queryFn:       appointmentsApi.adminStats,
    refetchInterval: 60_000,
  });

  const { data: recentRes } = useQuery({
    queryKey: ['admin-appointments-recent'],
    queryFn:  () => appointmentsApi.adminList({ limit: 8, sort: 'createdAt', order: 'desc' } as any),
    refetchInterval: 30_000,
  });

  const recent = recentRes?.data?.data?.data ?? [];

  const statCards = [
    { label: 'Всього записів',   value: stats?.total    ?? 0, icon: Calendar,     color: 'text-blue-600 bg-blue-100'    },
    { label: 'Сьогодні',         value: stats?.today    ?? 0, icon: TrendingUp,   color: 'text-green-600 bg-green-100'  },
    { label: 'Підтверджені',     value: stats?.byStatus?.confirmed ?? 0, icon: CheckCircle, color: 'text-primary-600 bg-primary-100' },
    { label: 'Скасовані',        value: stats?.byStatus?.cancelled ?? 0, icon: XCircle,     color: 'text-red-500 bg-red-100'  },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Дашборд</h1>
          <p className="text-neutral-500 text-sm mt-1">Огляд роботи клініки в реальному часі</p>
        </div>
        {notification && (
          <div className="flex items-center gap-2 bg-primary-50 border border-primary-200 text-primary-700 px-4 py-2 rounded-xl text-sm animate-fade-in">
            <Bell size={14} />
            {notification}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon size={20} />
            </div>
            <p className="text-2xl font-bold text-neutral-900">{value}</p>
            <p className="text-sm text-neutral-500 mt-0.5">{label}</p>
          </Card>
        ))}
      </div>

      {/* Recent appointments */}
      <Card padding="none" className="overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
          <h2 className="font-semibold text-neutral-900">Останні записи</h2>
          <a href="/admin/appointments" className="text-sm text-primary-600 hover:underline">Всі записи →</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-100">
                <th className="text-left px-6 py-3 font-medium text-neutral-500">Пацієнт</th>
                <th className="text-left px-6 py-3 font-medium text-neutral-500">Послуга</th>
                <th className="text-left px-6 py-3 font-medium text-neutral-500">Дата/Час</th>
                <th className="text-left px-6 py-3 font-medium text-neutral-500">Статус</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {recent.map((a: any) => (
                <tr key={a._id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-3">
                    <p className="font-medium text-neutral-900">{a.patientName}</p>
                    <p className="text-neutral-400 text-xs">{a.phone}</p>
                  </td>
                  <td className="px-6 py-3 text-neutral-600">{a.serviceId?.name}</td>
                  <td className="px-6 py-3 text-neutral-600">
                    {a.date && formatDateTime(a.date)} {a.timeSlot}
                  </td>
                  <td className="px-6 py-3">
                    <span className={statusBadgeClass(a.status)}>{statusLabel(a.status)}</span>
                  </td>
                </tr>
              ))}
              {recent.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-neutral-400">
                    Записи відсутні
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
