import { cn } from '@/lib/utils';

interface CardProps {
  className?: string;
  children:   React.ReactNode;
  hover?:     boolean;
  padding?:   'none' | 'sm' | 'md' | 'lg';
}

const paddings = {
  none: '',
  sm:   'p-4',
  md:   'p-6',
  lg:   'p-8',
};

export function Card({ className, children, hover = true, padding = 'md' }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl shadow-card border border-neutral-100',
        hover && 'hover:shadow-card-hover transition-shadow duration-300',
        paddings[padding],
        className,
      )}
    >
      {children}
    </div>
  );
}
