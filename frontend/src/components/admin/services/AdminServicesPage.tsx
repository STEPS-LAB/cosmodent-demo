'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminStore } from '@/stores/adminStore';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { api } from '@/services/api';
import { PencilIcon, TrashIcon, PlusIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

interface Service {
  _id: string;
  name: string;
  slug: string;
  category?: string;
  startingPrice: number;
  isActive: boolean;
  sortOrder: number;
}

export function AdminServicesPage() {
  const router = useRouter();
  const { isAuthenticated } = useAdminStore();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin/login');
      return;
    }

    loadServices();
  }, [isAuthenticated, router]);

  const loadServices = () => {
    api.get<Service[]>('/api/admin/services').then((data) => {
      setServices(data);
      setLoading(false);
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Ви впевнені, що хочете видалити цю послугу?')) return;

    try {
      await api.delete(`/api/admin/services/${id}`);
      loadServices();
    } catch (_error) {
      alert('Помилка видалення');
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      await api.patch(`/api/admin/services/${id}`, { isActive: !isActive });
      loadServices();
    } catch (_error) {
      alert('Помилка оновлення');
    }
  };

  const moveUp = async (index: number) => {
    if (index === 0) return;
    const newServices = [...services];
    [newServices[index], newServices[index - 1]] = [newServices[index - 1], newServices[index]];
    setServices(newServices);

    try {
      await api.put('/api/admin/services/order', {
        ids: newServices.map((s) => s._id),
      });
    } catch (_error) {
      loadServices();
    }
  };

  const moveDown = async (index: number) => {
    if (index === services.length - 1) return;
    const newServices = [...services];
    [newServices[index], newServices[index + 1]] = [newServices[index + 1], newServices[index]];
    setServices(newServices);

    try {
      await api.put('/api/admin/services/order', {
        ids: newServices.map((s) => s._id),
      });
    } catch (_error) {
      loadServices();
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">Послуги</h1>
            <p className="text-secondary-600 mt-1">Управління послугами клініки</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Додати послугу
          </button>
        </div>

        {/* Add Form (simplified) */}
        {showForm && (
          <div className="card p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Нова послуга</h2>
            <p className="text-secondary-600 text-sm">
              Форма додавання послуги буде реалізована тут.
              <br />
              Для демо-цілей використовуйте API безпосередньо.
            </p>
            <button
              onClick={() => setShowForm(false)}
              className="mt-4 btn-secondary"
            >
              Закрити
            </button>
          </div>
        )}

        {/* Services Table */}
        <div className="card overflow-hidden">
          <table className="min-w-full divide-y divide-secondary-200">
            <thead className="bg-secondary-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Порядок
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Назва
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Категорія
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Ціна
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Дії
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-secondary-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-secondary-500">
                    Завантаження...
                  </td>
                </tr>
              ) : (
                services.map((service, index) => (
                  <tr key={service._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => moveUp(index)}
                          disabled={index === 0}
                          className="p-1 hover:bg-secondary-100 rounded disabled:opacity-30"
                        >
                          <ArrowUpIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => moveDown(index)}
                          disabled={index === services.length - 1}
                          className="p-1 hover:bg-secondary-100 rounded disabled:opacity-30"
                        >
                          <ArrowDownIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-secondary-900">{service.name}</div>
                        <div className="text-sm text-secondary-500">{service.slug}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-secondary-600">{service.category || '-'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-secondary-900">
                        {service.startingPrice.toLocaleString()} ₴
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleActive(service._id, service.isActive)}
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          service.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-secondary-100 text-secondary-600'
                        }`}
                      >
                        {service.isActive ? 'Активна' : 'Неактивна'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="p-2 hover:bg-secondary-100 rounded text-primary-600">
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(service._id)}
                          className="p-2 hover:bg-red-50 rounded text-red-600"
                        >
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
