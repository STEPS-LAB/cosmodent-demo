'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentsApi } from '@/lib/api';
import { useWebSocket } from '@/lib/hooks/useWebSocket';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AppointmentStatus, Appointment } from '@/types';
import { statusLabel, statusBadgeClass, formatDateTime } from '@/lib/utils';
import { Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

const STATUSES: { value: AppointmentStatus | ''; label: string }[] = [
  { value: '',           label: 'Всі'         },
  { value: 'new',        label: 'Нові'        },
  { value: 'confirmed',  label: 'Підтверджені' },
  { value: 'completed',  label: 'Завершені'   },
  { value: 'cancelled',  label: 'Скасовані'   },
];

const NEXT_STATUSES: Record<AppointmentStatus, AppointmentStatus[]> = {
  new:       ['confirmed', 'cancelled'],
  confirmed: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

export default function AppointmentsAdminPage() {
  const [status, setStatus]   = useState<AppointmentStatus | ''>('');
  const [search, setSearch]   = useState('');
  const [page,   setPage]     = useState(1);
  const qc = useQueryClient();

  // Real-time updates
  useWebSocket({
    'appointment:created': () => { qc.invalidateQueries({ queryKey: ['admin-appointments'] }); toast.success('Новий запис!'); },
    'appointment:updated': () => qc.invalidateQueries({ queryKey: ['admin-appointments'] }),
  });

  const { data, isLoading } = useQuery({
    queryKey: ['admin-appointments', status, search, page],
    queryFn:  () => appointmentsApi.adminList({ status: status || undefined, page, limit: 15, search }),
    placeholderData: (prev) => prev,
  });

  const appointments: Appointment[] = data?.data?.data?.data ?? [];
  const total      = data?.data?.data?.total      ?? 0;
  const totalPages = data?.data?.data?.totalPages  ?? 1;

  const updateStatus = useMutation({
    mutationFn: ({ id, s }: { id: string; s: AppointmentStatus }) =>
      appointmentsApi.adminUpdateStatus(id, s),
    onSuccess: () => {
      toast.success('Статус оновлено');
      qc.invalidateQueries({ queryKey: ['admin-appointments'] });
    },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Записи на прийом</h1>
        <p className="text-neutral-500 text-sm mt-1">{total} записів загалом</p>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Status filter tabs */}
          <div className="flex gap-1 flex-wrap">
            {STATUSES.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => { setStatus(value); setPage(1); }}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  status === value
                    ? 'bg-primary-600 text-white'
                    : 'text-neutral-600 hover:bg-neutral-100',
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative sm:ml-auto">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="search"
              placeholder="Пошук за ім'ям або телефоном…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="form-input pl-9 w-full sm:w-64 py-2"
            />
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-100">
                <th className="text-left px-5 py-3 font-medium text-neutral-500">Пацієнт</th>
                <th className="text-left px-5 py-3 font-medium text-neutral-500">Послуга</th>
                <th className="text-left px-5 py-3 font-medium text-neutral-500">Дата / Час</th>
                <th className="text-left px-5 py-3 font-medium text-neutral-500">Статус</th>
                <th className="text-left px-5 py-3 font-medium text-neutral-500">Дії</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {isLoading ? (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-neutral-400">Завантаження…</td></tr>
              ) : appointments.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-neutral-400">Записи не знайдені</td></tr>
              ) : appointments.map((a) => (
                <tr key={a._id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-medium text-neutral-900">{a.patientName}</p>
                    <p className="text-neutral-400 text-xs">{a.phone}</p>
                  </td>
                  <td className="px-5 py-3 text-neutral-600">
                    {(a.serviceId as any)?.name ?? '—'}
                  </td>
                  <td className="px-5 py-3 text-neutral-600">
                    <p>{formatDateTime(a.date)}</p>
                    <p className="text-xs text-neutral-400">{a.timeSlot}</p>
                  </td>
                  <td className="px-5 py-3">
                    <span className={statusBadgeClass(a.status)}>{statusLabel(a.status)}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {NEXT_STATUSES[a.status].map((ns) => (
                        <Button
                          key={ns}
                          size="sm"
                          variant={ns === 'cancelled' ? 'danger' : 'outline'}
                          loading={updateStatus.isPending}
                          onClick={() => updateStatus.mutate({ id: a._id, s: ns })}
                        >
                          {statusLabel(ns)}
                        </Button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-neutral-100 flex items-center justify-between">
            <p className="text-sm text-neutral-500">Сторінка {page} з {totalPages}</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                ← Назад
              </Button>
              <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                Вперед →
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
