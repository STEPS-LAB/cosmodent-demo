'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminStore } from '@/stores/adminStore';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { api } from '@/services/api';
import { PencilIcon, TrashIcon, PlusIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  isPublished: boolean;
  createdAt: string;
}

export function AdminBlogPage() {
  const router = useRouter();
  const { isAuthenticated } = useAdminStore();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin/login');
      return;
    }
    loadPosts();
  }, [isAuthenticated, router]);

  const loadPosts = () => {
    api.getAdminBlogPosts()
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch(() => {
        setPosts([]);
        setLoading(false);
      });
  };

  const togglePublish = async (id: string, isPublished: boolean) => {
    try {
      if (isPublished) {
        await api.unpublishBlogPost(id);
      } else {
        await api.publishBlogPost(id);
      }
      loadPosts();
    } catch {
      alert('Помилка публікації');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Ви впевнені, що хочете видалити цю статтю?')) return;
    try {
      await api.deleteBlogPost(id);
      loadPosts();
    } catch {
      alert('Помилка видалення');
    }
  };

  if (!isAuthenticated) return null;

  return (
    <AdminLayout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">Блог</h1>
            <p className="text-secondary-600 mt-1">Управління статтями блогу</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center">
            <PlusIcon className="w-5 h-5 mr-2" />
            Додати статтю
          </button>
        </div>

        {showForm && (
          <div className="card p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Нова стаття</h2>
            <p className="text-secondary-600 text-sm">Форма додавання статті буде реалізована тут.</p>
            <button onClick={() => setShowForm(false)} className="mt-4 btn-secondary">Закрити</button>
          </div>
        )}

        <div className="card overflow-hidden">
          <table className="min-w-full divide-y divide-secondary-200">
            <thead className="bg-secondary-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Назва</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Дата</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Статус</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase">Дії</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-secondary-200">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-secondary-500">Завантаження...</td></tr>
              ) : posts.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-secondary-500">Статей не знайдено</td></tr>
              ) : (
                posts.map((post) => (
                  <tr key={post._id}>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-secondary-900">{post.title}</div>
                      <div className="text-sm text-secondary-500">{post.slug}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-secondary-600">{new Date(post.createdAt).toLocaleDateString('uk-UA')}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        post.isPublished ? 'bg-green-100 text-green-700' : 'bg-secondary-100 text-secondary-600'
                      }`}>
                        {post.isPublished ? 'Опубліковано' : 'Чернетка'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => togglePublish(post._id, post.isPublished)}
                          className="p-2 hover:bg-secondary-100 rounded text-primary-600"
                        >
                          {post.isPublished ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                        </button>
                        <button className="p-2 hover:bg-secondary-100 rounded text-primary-600">
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(post._id)} className="p-2 hover:bg-red-50 rounded text-red-600">
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
