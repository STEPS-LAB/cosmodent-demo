'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blogApi } from '@/lib/api';
import { BlogPost } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { formatDateTime } from '@/lib/utils';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function BlogAdminPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm]     = useState(false);
  const [editTarget, setEditTarget] = useState<BlogPost | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-blog'],
    queryFn:  () => blogApi.adminList({ limit: 50 }),
  });

  const posts: BlogPost[] = data?.data?.data?.data ?? [];

  const del = useMutation({
    mutationFn: (id: string) => blogApi.adminDelete(id),
    onSuccess: () => { toast.success('Статтю видалено'); qc.invalidateQueries({ queryKey: ['admin-blog'] }); },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Блог</h1>
        <Button leftIcon={<Plus size={16} />} onClick={() => { setEditTarget(null); setShowForm(true); }}>
          Нова стаття
        </Button>
      </div>

      {isLoading ? <p className="text-neutral-400">Завантаження…</p> : (
        <Card padding="none" className="overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-100">
                <th className="text-left px-5 py-3 font-medium text-neutral-500">Заголовок</th>
                <th className="text-left px-5 py-3 font-medium text-neutral-500">Статус</th>
                <th className="text-left px-5 py-3 font-medium text-neutral-500">Перегляди</th>
                <th className="text-left px-5 py-3 font-medium text-neutral-500">Дата</th>
                <th className="text-left px-5 py-3 font-medium text-neutral-500">Дії</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {posts.map((post) => (
                <tr key={post._id} className="hover:bg-neutral-50">
                  <td className="px-5 py-3">
                    <p className="font-medium text-neutral-900">{post.title}</p>
                    <p className="text-xs text-neutral-400">/{post.slug}</p>
                  </td>
                  <td className="px-5 py-3">
                    <span className={post.isPublished ? 'badge-green' : 'badge-gray'}>
                      {post.isPublished ? 'Опубліковано' : 'Чернетка'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-neutral-600">
                    <span className="flex items-center gap-1"><Eye size={13} /> {post.viewCount}</span>
                  </td>
                  <td className="px-5 py-3 text-neutral-500 text-xs">
                    {post.publishedAt ? formatDateTime(post.publishedAt) : '—'}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => { setEditTarget(post); setShowForm(true); }}>
                        <Pencil size={13} />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-600" onClick={() => { if (confirm('Видалити?')) del.mutate(post._id); }}>
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-neutral-400">Статті відсутні</td></tr>
              )}
            </tbody>
          </table>
        </Card>
      )}

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editTarget ? 'Редагувати статтю' : 'Нова стаття'} size="xl">
        <BlogForm initial={editTarget} onClose={() => { setShowForm(false); qc.invalidateQueries({ queryKey: ['admin-blog'] }); }} />
      </Modal>
    </div>
  );
}

function BlogForm({ initial, onClose }: { initial: BlogPost | null; onClose: () => void }) {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: initial ?? {
      title: '', slug: '', excerpt: '', content: '',
      seoTitle: '', seoDescription: '', isPublished: false,
      authorId: '',
    },
  });

  const onSubmit = async (data: any) => {
    try {
      if (initial) await blogApi.adminUpdate(initial._id, data);
      else await blogApi.adminCreate(data);
      toast.success(initial ? 'Статтю оновлено' : 'Статтю створено');
      onClose();
    } catch { toast.error('Помилка збереження'); }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label">Заголовок</label>
          <input className="form-input" {...register('title', { required: true })} />
        </div>
        <div>
          <label className="form-label">Slug</label>
          <input className="form-input" {...register('slug', { required: true })} />
        </div>
      </div>
      <div>
        <label className="form-label">Анонс</label>
        <textarea className="form-input" rows={2} {...register('excerpt', { required: true })} />
      </div>
      <div>
        <label className="form-label">Контент (HTML)</label>
        <textarea className="form-input" rows={8} {...register('content', { required: true })} />
      </div>
      <div>
        <label className="form-label">ID автора (Doctor ID)</label>
        <input className="form-input" {...register('authorId', { required: true })} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label">SEO Title</label>
          <input className="form-input" {...register('seoTitle', { required: true })} />
        </div>
        <div>
          <label className="form-label">SEO Description</label>
          <input className="form-input" {...register('seoDescription', { required: true })} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="isPublished" {...register('isPublished')} className="rounded" />
        <label htmlFor="isPublished" className="text-sm font-medium">Опублікувати</label>
      </div>
      <div className="flex gap-3">
        <Button type="submit" loading={isSubmitting} className="flex-1 justify-center">Зберегти</Button>
        <Button type="button" variant="outline" onClick={onClose}>Скасувати</Button>
      </div>
    </form>
  );
}
