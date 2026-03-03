import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating:   number;
  max?:     number;
  size?:    number;
  className?: string;
}

export function StarRating({ rating, max = 5, size = 16, className }: StarRatingProps) {
  return (
    <div className={cn('flex items-center gap-0.5', className)} aria-label={`Рейтинг: ${rating} з ${max}`}>
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          size={size}
          className={i < Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-300'}
        />
      ))}
    </div>
  );
}
