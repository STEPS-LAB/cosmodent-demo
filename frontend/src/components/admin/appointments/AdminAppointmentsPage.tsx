'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminStore } from '@/stores/adminStore';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { api } from '@/services/api';
import { io } from 'socket.io-client';

interface Appointment {
  _id: string;
  patientName: string;
  patientPhone: string;
  service?: { name: string };
  doctor?: { name: string };
  date: string;
  timeSlot: string;
  status: 'new' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  confirmed: 'bg-green-100 text-green-700',
  completed: 'bg-gray-100 text-gray-700',
  cancelled: 'bg-red-100 text-red-700',
};

const statusLabels: Record<string, string> = {
  new: 'Новий',
  confirmed: 'Підтверджено',
  completed: 'Завершено',
  cancelled: 'Скасовано',
};

export function AdminAppointmentsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAdminStore();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin/login');
      return;
    }

    loadAppointments();

    // WebSocket connection for real-time updates
    const socket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3002');
    
    socket.on('appointment:created', (newAppointment) => {
      setAppointments((prev) => [newAppointment, ...prev]);
    });

    socket.on('appointment:updated', (updated) => {
      setAppointments((prev) =>
        prev.map((a) => (a._id === updated.id ? { ...a, ...updated } : a))
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [isAuthenticated, router]);

  const loadAppointments = () => {
    const query = filter !== 'all' ? `?status=${filter}` : '';
    api.getAdminAppointments(filter !== 'all' ? filter : undefined).then((data) => {
      setAppointments(data);
      setLoading(false);
    }).catch(() => {
      setAppointments([]);
      setLoading(false);
    });
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.updateAppointmentStatus(id, status);
      loadAppointments();
    } catch (_error) {
      alert('Помилка оновлення статусу');
    }
  };

  const filteredAppointments =
    filter === 'all'
      ? appointments
      : appointments.filter((a) => a.status === filter);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-secondary-900">Записи на прийом</h1>
          <p className="text-secondary-600 mt-1">Управління записами пацієнтів</p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {['all', 'new', 'confirmed', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-secondary-700 hover:bg-secondary-50'
              }`}
            >
              {status === 'all' ? 'Всі' : statusLabels[status]}
            </button>
          ))}
        </div>

        {/* Appointments List */}
        <div className="card overflow-hidden">
          <table className="min-w-full divide-y divide-secondary-200">
            <thead className="bg-secondary-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">
                  Пацієнт
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">
                  Послуга
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">
                  Дата і час
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">
                  Статус
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase">
                  Дії
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-secondary-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-secondary-500">
                    Завантаження...
                  </td>
                </tr>
              ) : filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-secondary-500">
                    Записів не знайдено
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((appointment) => (
                  <tr key={appointment._id}>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-secondary-900">
                          {appointment.patientName}
                        </div>
                        <div className="text-sm text-secondary-500">
                          {appointment.patientPhone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-secondary-900">
                        {appointment.service?.name || 'Не вказано'}
                      </div>
                      {appointment.doctor && (
                        <div className="text-sm text-secondary-500">
                          {appointment.doctor.name}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-secondary-900">
                        {new Date(appointment.date).toLocaleDateString('uk-UA')}
                      </div>
                      <div className="text-sm text-secondary-500">
                        {appointment.timeSlot}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[appointment.status]}`}>
                        {statusLabels[appointment.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <select
                        value={appointment.status}
                        onChange={(e) => updateStatus(appointment._id, e.target.value)}
                        className="text-sm border border-secondary-300 rounded-lg px-2 py-1"
                      >
                        <option value="new">Новий</option>
                        <option value="confirmed">Підтверджено</option>
                        <option value="completed">Завершено</option>
                        <option value="cancelled">Скасовано</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
