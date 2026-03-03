'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminStore } from '@/stores/adminStore';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { api } from '@/services/api';
import { TrashIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface Review {
  _id: string;
  patientName: string;
  rating: number;
  title: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

const statusLabels: Record<string, string> = {
  pending: 'На модерації',
  approved: 'Схвалено',
  rejected: 'Відхилено',
};

export function AdminReviewsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAdminStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin/login');
      return;
    }
    loadReviews();
  }, [isAuthenticated, router]);

  const loadReviews = () => {
    api.getAdminReviews().then((data) => {
      setReviews(data);
      setLoading(false);
    }).catch(() => {
      setReviews([]);
      setLoading(false);
    });
  };

  const approveReview = async (id: string) => {
    try {
      await api.approveReview(id);
      loadReviews();
    } catch (_error) {
      alert('Помилка схвалення');
    }
  };

  const rejectReview = async (id: string) => {
    try {
      await api.rejectReview(id);
      loadReviews();
    } catch (_error) {
      alert('Помилка відхилення');
    }
  };

  const deleteReview = async (id: string) => {
    if (!confirm('Ви впевнені, що хочете видалити цей відгук?')) return;
    try {
      await api.deleteReview(id);
      loadReviews();
    } catch (_error) {
      alert('Помилка видалення');
    }
  };

  if (!isAuthenticated) return null;

  return (
    <AdminLayout>
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-secondary-900">Відгуки</h1>
          <p className="text-secondary-600 mt-1">Управління відгуками пацієнтів</p>
        </div>

        <div className="card overflow-hidden">
          <table className="min-w-full divide-y divide-secondary-200">
            <thead className="bg-secondary-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Пацієнт</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Відгук</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Рейтинг</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Статус</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase">Дії</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-secondary-200">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-secondary-500">Завантаження...</td></tr>
              ) : reviews.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-secondary-500">Відгуків не знайдено</td></tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review._id}>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-secondary-900">{review.patientName}</div>
                      <div className="text-sm text-secondary-500">{new Date(review.createdAt).toLocaleDateString('uk-UA')}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-secondary-900">{review.title}</div>
                      <div className="text-sm text-secondary-600 truncate max-w-xs">{review.content}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-secondary-300'}>★</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[review.status]}`}>
                        {statusLabels[review.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {review.status !== 'approved' && (
                          <button onClick={() => approveReview(review._id)} className="p-2 hover:bg-green-50 rounded text-green-600" title="Схвалити">
                            <CheckCircleIcon className="w-5 h-5" />
                          </button>
                        )}
                        {review.status !== 'rejected' && (
                          <button onClick={() => rejectReview(review._id)} className="p-2 hover:bg-red-50 rounded text-red-600" title="Відхилити">
                            <XCircleIcon className="w-5 h-5" />
                          </button>
                        )}
                        <button onClick={() => deleteReview(review._id)} className="p-2 hover:bg-red-50 rounded text-red-600" title="Видалити">
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
