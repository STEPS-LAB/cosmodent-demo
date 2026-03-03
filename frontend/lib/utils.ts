import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO } from 'date-fns';
import { uk } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency = 'UAH'): string {
  if (currency === 'UAH') return `від ${price.toLocaleString('uk-UA')} грн`;
  return `${price.toLocaleString()} ${currency}`;
}

export function formatDate(dateStr: string, fmt = 'd MMMM yyyy'): string {
  return format(parseISO(dateStr), fmt, { locale: uk });
}

export function formatDateTime(dateStr: string): string {
  return format(parseISO(dateStr), 'd MMM yyyy, HH:mm', { locale: uk });
}

export function statusLabel(status: string): string {
  const map: Record<string, string> = {
    new:       'Новий',
    confirmed: 'Підтверджено',
    completed: 'Завершено',
    cancelled: 'Скасовано',
  };
  return map[status] ?? status;
}

export function statusBadgeClass(status: string): string {
  const map: Record<string, string> = {
    new:       'badge-yellow',
    confirmed: 'badge-green',
    completed: 'badge-gray',
    cancelled: 'badge-red',
  };
  return map[status] ?? 'badge-gray';
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .trim();
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

// Star rating helper
export function starsArray(rating: number): boolean[] {
  return Array.from({ length: 5 }, (_, i) => i < Math.round(rating));
}
