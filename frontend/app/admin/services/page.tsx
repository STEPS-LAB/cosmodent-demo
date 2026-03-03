'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { servicesApi } from '@/lib/api';
import { Service } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { formatPrice } from '@/lib/utils';
import { GripVertical, Pencil, Trash2, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function ServicesAdminPage() {
  const qc = useQueryClient();
  const [editTarget, setEditTarget] = useState<Service | null>(null);
  const [showForm, setShowForm]     = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-services'],
    queryFn:  () => servicesApi.adminList({ limit: 100 }),
  });
  const services: Service[] = data?.data?.data?.data ?? [];

  // ── Drag-and-drop reorder ─────────────────────────────────
  const reorder = useMutation({
    mutationFn: (ids: string[]) => servicesApi.adminReorder(ids),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-services'] }),
  });

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const ordered = Array.from(services);
    const [moved] = ordered.splice(result.source.index, 1);
    ordered.splice(result.destination.index, 0, moved);
    reorder.mutate(ordered.map((s) => s._id));
  };

  // ── Delete ─────────────────────────────────────────────────
  const del = useMutation({
    mutationFn: (id: string) => servicesApi.adminDelete(id),
    onSuccess: () => { toast.success('Послугу видалено'); qc.invalidateQueries({ queryKey: ['admin-services'] }); },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Послуги</h1>
          <p className="text-neutral-500 text-sm mt-1">Перетягуйте для зміни порядку</p>
        </div>
        <Button leftIcon={<Plus size={16} />} onClick={() => { setEditTarget(null); setShowForm(true); }}>
          Додати послугу
        </Button>
      </div>

      {isLoading ? (
        <p className="text-neutral-400 py-8">Завантаження…</p>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="services">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
                {services.map((service, index) => (
                  <Draggable key={service._id} draggableId={service._id} index={index}>
                    {(drag, snapshot) => (
                      <div
                        ref={drag.innerRef}
                        {...drag.draggableProps}
                        className={`bg-white rounded-xl border border-neutral-100 shadow-card transition-shadow ${snapshot.isDragging ? 'shadow-card-hover rotate-1' : ''}`}
                      >
                        <div className="flex items-center gap-3 p-4">
                          <div {...drag.dragHandleProps} className="text-neutral-300 hover:text-neutral-500 cursor-grab active:cursor-grabbing">
                            <GripVertical size={20} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-neutral-900">{service.name}</p>
                              {!service.isActive && <span className="badge-gray">Прихована</span>}
                            </div>
                            <p className="text-sm text-neutral-500 truncate">{service.shortDescription}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-semibold text-primary-600">{formatPrice(service.startingPrice)}</p>
                          </div>
                          <div className="flex gap-1 ml-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              leftIcon={<Pencil size={14} />}
                              onClick={() => { setEditTarget(service); setShowForm(true); }}
                            >
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-400 hover:text-red-600 hover:bg-red-50"
                              loading={del.isPending}
                              onClick={() => {
                                if (confirm(`Видалити "${service.name}"?`)) del.mutate(service._id);
                              }}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {/* Service form modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editTarget ? 'Редагувати послугу' : 'Нова послуга'} size="lg">
        <ServiceForm
          initial={editTarget}
          onClose={() => { setShowForm(false); qc.invalidateQueries({ queryKey: ['admin-services'] }); }}
        />
      </Modal>
    </div>
  );
}

// ── Inline form ───────────────────────────────────────────
function ServiceForm({ initial, onClose }: { initial: Service | null; onClose: () => void }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: initial ?? {
      name: '', slug: '', shortDescription: '', fullDescription: '',
      startingPrice: 0, duration: 60, isActive: true,
      seoTitle: '', seoDescription: '',
    },
  });

  const onSubmit = async (data: any) => {
    try {
      if (initial) await servicesApi.adminUpdate(initial._id, data);
      else await servicesApi.adminCreate(data);
      toast.success(initial ? 'Послугу оновлено' : 'Послугу створено');
      onClose();
    } catch {
      toast.error('Помилка збереження');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label">Назва</label>
          <input className="form-input" {...register('name', { required: true })} />
        </div>
        <div>
          <label className="form-label">Slug</label>
          <input className="form-input" {...register('slug', { required: true })} />
        </div>
      </div>
      <div>
        <label className="form-label">Короткий опис</label>
        <textarea className="form-input" rows={2} {...register('shortDescription', { required: true })} />
      </div>
      <div>
        <label className="form-label">Повний опис (HTML)</label>
        <textarea className="form-input" rows={5} {...register('fullDescription', { required: true })} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label">Ціна від (грн)</label>
          <input type="number" className="form-input" {...register('startingPrice', { valueAsNumber: true })} />
        </div>
        <div>
          <label className="form-label">Тривалість (хв)</label>
          <input type="number" className="form-input" {...register('duration', { valueAsNumber: true })} />
        </div>
      </div>
      <div>
        <label className="form-label">SEO Title</label>
        <input className="form-input" {...register('seoTitle', { required: true })} />
      </div>
      <div>
        <label className="form-label">SEO Description</label>
        <textarea className="form-input" rows={2} {...register('seoDescription', { required: true })} />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="isActive" {...register('isActive')} className="rounded" />
        <label htmlFor="isActive" className="text-sm font-medium text-neutral-700">Активна</label>
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={isSubmitting} className="flex-1 justify-center">Зберегти</Button>
        <Button type="button" variant="outline" onClick={onClose}>Скасувати</Button>
      </div>
    </form>
  );
}
