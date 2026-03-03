'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { doctorsApi } from '@/lib/api';
import { Doctor } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { StarRating } from '@/components/ui/StarRating';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function DoctorsAdminPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm]     = useState(false);
  const [editTarget, setEditTarget] = useState<Doctor | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-doctors'],
    queryFn:  () => doctorsApi.adminList({ limit: 100 }),
  });

  const doctors: Doctor[] = data?.data?.data?.data ?? [];

  const del = useMutation({
    mutationFn: (id: string) => doctorsApi.adminDelete(id),
    onSuccess: () => { toast.success('Лікаря видалено'); qc.invalidateQueries({ queryKey: ['admin-doctors'] }); },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Лікарі</h1>
        <Button leftIcon={<Plus size={16} />} onClick={() => { setEditTarget(null); setShowForm(true); }}>
          Додати лікаря
        </Button>
      </div>

      {isLoading ? <p className="text-neutral-400">Завантаження…</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {doctors.map((doctor) => (
            <Card key={doctor._id} className="p-5">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center shrink-0">
                  {doctor.photo ? (
                    <img src={doctor.photo} alt={doctor.name} className="w-full h-full rounded-xl object-cover" />
                  ) : (
                    <span className="text-primary-600 text-xl font-bold">{doctor.name[0]}</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-neutral-900">{doctor.name}</p>
                  <p className="text-sm text-primary-600">{doctor.specialization}</p>
                  <StarRating rating={doctor.rating} size={12} className="mt-1" />
                </div>
              </div>
              <p className="text-xs text-neutral-500 line-clamp-2 mb-4">{doctor.bio}</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" leftIcon={<Pencil size={13} />} onClick={() => { setEditTarget(doctor); setShowForm(true); }}>
                  Редагувати
                </Button>
                <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-600 ml-auto" onClick={() => { if (confirm('Видалити?')) del.mutate(doctor._id); }}>
                  <Trash2 size={14} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editTarget ? 'Редагувати лікаря' : 'Новий лікар'} size="lg">
        <DoctorForm initial={editTarget} onClose={() => { setShowForm(false); qc.invalidateQueries({ queryKey: ['admin-doctors'] }); }} />
      </Modal>
    </div>
  );
}

function DoctorForm({ initial, onClose }: { initial: Doctor | null; onClose: () => void }) {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: initial ?? { name: '', slug: '', specialization: '', bio: '', experience: 0, isActive: true },
  });

  const onSubmit = async (data: any) => {
    try {
      if (initial) await doctorsApi.adminUpdate(initial._id, data);
      else await doctorsApi.adminCreate(data);
      toast.success(initial ? 'Оновлено' : 'Лікаря створено');
      onClose();
    } catch { toast.error('Помилка збереження'); }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label">Ім'я</label>
          <input className="form-input" {...register('name', { required: true })} />
        </div>
        <div>
          <label className="form-label">Slug</label>
          <input className="form-input" {...register('slug', { required: true })} />
        </div>
      </div>
      <div>
        <label className="form-label">Спеціалізація</label>
        <input className="form-input" {...register('specialization', { required: true })} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label">Досвід (роки)</label>
          <input type="number" className="form-input" {...register('experience', { valueAsNumber: true })} />
        </div>
        <div>
          <label className="form-label">Фото URL</label>
          <input className="form-input" {...register('photo')} />
        </div>
      </div>
      <div>
        <label className="form-label">Біографія</label>
        <textarea className="form-input" rows={4} {...register('bio', { required: true })} />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="docIsActive" {...register('isActive')} className="rounded" />
        <label htmlFor="docIsActive" className="text-sm font-medium text-neutral-700">Активний</label>
      </div>
      <div className="flex gap-3">
        <Button type="submit" loading={isSubmitting} className="flex-1 justify-center">Зберегти</Button>
        <Button type="button" variant="outline" onClick={onClose}>Скасувати</Button>
      </div>
    </form>
  );
}
