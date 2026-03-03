'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminStore } from '@/stores/adminStore';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { api } from '@/services/api';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

interface Doctor {
  _id: string;
  name: string;
  slug: string;
  specialty?: string;
  experience?: number;
  isActive: boolean;
  sortOrder: number;
}

export function AdminDoctorsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAdminStore();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin/login');
      return;
    }
    loadDoctors();
  }, [isAuthenticated, router]);

  const loadDoctors = () => {
    api.getAdminDoctors()
      .then((data) => {
        setDoctors(data);
        setLoading(false);
      })
      .catch(() => {
        setDoctors([]);
        setLoading(false);
      });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Ви впевнені, що хочете видалити цього лікаря?')) return;
    try {
      await api.deleteDoctor(id);
      loadDoctors();
    } catch {
      alert('Помилка видалення');
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      await api.updateDoctor(id, { isActive: !isActive });
      loadDoctors();
    } catch {
      alert('Помилка оновлення');
    }
  };

  if (!isAuthenticated) return null;

  return (
    <AdminLayout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">Лікарі</h1>
            <p className="text-secondary-600 mt-1">Управління лікарями клініки</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center">
            <PlusIcon className="w-5 h-5 mr-2" />
            Додати лікаря
          </button>
        </div>

        {showForm && (
          <div className="card p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Новий лікар</h2>
            <p className="text-secondary-600 text-sm">Форма додавання лікаря буде реалізована тут.</p>
            <button onClick={() => setShowForm(false)} className="mt-4 btn-secondary">Закрити</button>
          </div>
        )}

        <div className="card overflow-hidden">
          <table className="min-w-full divide-y divide-secondary-200">
            <thead className="bg-secondary-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Назва</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Спеціальність</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Досвід</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Статус</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase">Дії</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-secondary-200">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-secondary-500">Завантаження...</td></tr>
              ) : doctors.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-secondary-500">Лікарів не знайдено</td></tr>
              ) : (
                doctors.map((doctor) => (
                  <tr key={doctor._id}>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-secondary-900">{doctor.name}</div>
                      <div className="text-sm text-secondary-500">{doctor.slug}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-secondary-600">{doctor.specialty || '-'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-secondary-600">{doctor.experience ? `${doctor.experience} років` : '-'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleActive(doctor._id, doctor.isActive)}
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          doctor.isActive ? 'bg-green-100 text-green-700' : 'bg-secondary-100 text-secondary-600'
                        }`}
                      >
                        {doctor.isActive ? 'Активний' : 'Неактивний'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="p-2 hover:bg-secondary-100 rounded text-primary-600">
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(doctor._id)} className="p-2 hover:bg-red-50 rounded text-red-600">
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
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
