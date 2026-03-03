'use client';

import { TimeSlot } from '@/types';
import { cn } from '@/lib/utils';
import { Clock, Loader2 } from 'lucide-react';

interface TimeSlotPickerProps {
  slots:    TimeSlot[];
  loading:  boolean;
  selected: string | null;
  onSelect: (time: string) => void;
}

export function TimeSlotPicker({ slots, loading, selected, onSelect }: TimeSlotPickerProps) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 text-neutral-500 text-sm py-2">
        <Loader2 className="animate-spin" size={16} />
        Завантаження вільних слотів…
      </div>
    );
  }

  const available = slots.filter((s) => s.available);

  if (available.length === 0) {
    return (
      <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
        На цю дату немає вільних записів. Оберіть іншу дату.
      </p>
    );
  }

  return (
    <fieldset>
      <legend className="form-label mb-2">
        <Clock size={14} className="inline mr-1.5" />
        Оберіть час *
        <span className="ml-2 text-xs text-neutral-400 font-normal">
          {available.length} вільних слотів
        </span>
      </legend>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2" role="radiogroup">
        {slots.map((slot) => (
          <button
            key={slot.time}
            type="button"
            role="radio"
            aria-checked={selected === slot.time}
            disabled={!slot.available}
            onClick={() => slot.available && onSelect(slot.time)}
            className={cn(
              'px-3 py-2 rounded-xl text-sm font-medium border-2 transition-all duration-150',
              slot.available
                ? selected === slot.time
                  ? 'bg-primary-600 border-primary-600 text-white shadow-button'
                  : 'border-neutral-200 text-neutral-700 hover:border-primary-400 hover:text-primary-700 hover:bg-primary-50'
                : 'border-neutral-100 text-neutral-300 cursor-not-allowed bg-neutral-50 line-through',
            )}
          >
            {slot.time}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
