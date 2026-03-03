'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewsApi } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StarRating } from '@/components/ui/StarRating';
import { Review } from '@/types';
import { formatDateTime } from '@/lib/utils';
import { Check, Star, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ReviewsAdminPage() {
  const qc = useQueryClient();
  const [approved, setApproved] = useState<string | undefined>(undefined);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-reviews', approved],
    queryFn:  () => reviewsApi.adminList({ isApproved: approved }),
  });

  const reviews: Review[] = data?.data?.data?.data ?? [];

  const approveMut = useMutation({
    mutationFn: (id: string) => reviewsApi.adminApprove(id),
    onSuccess: () => { toast.success('Відгук схвалено'); qc.invalidateQueries({ queryKey: ['admin-reviews'] }); },
  });

  const highlightMut = useMutation({
    mutationFn: (id: string) => reviewsApi.adminToggleHighlight(id),
    onSuccess: () => { toast.success('Оновлено'); qc.invalidateQueries({ queryKey: ['admin-reviews'] }); },
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => reviewsApi.adminDelete(id),
    onSuccess: () => { toast.success('Відгук видалено'); qc.invalidateQueries({ queryKey: ['admin-reviews'] }); },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Відгуки</h1>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {[
          { label: 'Всі',         value: undefined   },
          { label: 'Очікують',    value: 'false'     },
          { label: 'Схвалені',    value: 'true'      },
        ].map(({ label, value }) => (
          <button
            key={label}
            onClick={() => setApproved(value)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              approved === value ? 'bg-primary-600 text-white' : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {isLoading ? <p className="text-neutral-400">Завантаження…</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((review) => (
            <Card key={review._id} className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-neutral-900">{review.patientName}</p>
                  <p className="text-xs text-neutral-400">{formatDateTime(review.createdAt)}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <StarRating rating={review.rating} size={14} />
                  <div className="flex gap-1">
                    {review.isHighlighted && <span className="badge-green text-xs">Виділений</span>}
                    {review.isApproved    && <span className="badge-green text-xs">Схвалений</span>}
                    {!review.isApproved   && <span className="badge-yellow text-xs">Очікує</span>}
                  </div>
                </div>
              </div>
              <p className="text-sm text-neutral-700 leading-relaxed mb-4">"{review.text}"</p>
              <div className="flex gap-2 flex-wrap">
                {!review.isApproved && (
                  <Button size="sm" leftIcon={<Check size={14} />} loading={approveMut.isPending} onClick={() => approveMut.mutate(review._id)}>
                    Схвалити
                  </Button>
                )}
                <Button size="sm" variant="outline" leftIcon={<Star size={14} />} loading={highlightMut.isPending} onClick={() => highlightMut.mutate(review._id)}>
                  {review.isHighlighted ? 'Зняти виділення' : 'Виділити'}
                </Button>
                <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-600" onClick={() => { if (confirm('Видалити?')) deleteMut.mutate(review._id); }}>
                  <Trash2 size={14} />
                </Button>
              </div>
            </Card>
          ))}
          {reviews.length === 0 && <p className="col-span-2 text-center text-neutral-400 py-8">Відгуки відсутні</p>}
        </div>
      )}
    </div>
  );
}
