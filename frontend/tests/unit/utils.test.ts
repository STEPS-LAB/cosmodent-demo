import { describe, it, expect } from 'vitest';
import { cn, formatPrice, statusLabel, statusBadgeClass, slugify, truncate, starsArray } from '@/lib/utils';

describe('cn()', () => {
  it('merges class names', () => {
    expect(cn('a', 'b')).toBe('a b');
  });
  it('resolves tailwind conflicts', () => {
    expect(cn('px-4', 'px-6')).toBe('px-6');
  });
  it('ignores falsy values', () => {
    expect(cn('a', false, undefined, null as any)).toBe('a');
  });
});

describe('formatPrice()', () => {
  it('formats UAH price correctly', () => {
    expect(formatPrice(18000)).toBe('від 18\u202f000 грн');
  });
  it('formats non-UAH currency', () => {
    expect(formatPrice(500, 'USD')).toContain('USD');
  });
});

describe('statusLabel()', () => {
  it('maps statuses to Ukrainian labels', () => {
    expect(statusLabel('new')).toBe('Новий');
    expect(statusLabel('confirmed')).toBe('Підтверджено');
    expect(statusLabel('completed')).toBe('Завершено');
    expect(statusLabel('cancelled')).toBe('Скасовано');
  });
  it('returns the status as-is for unknown values', () => {
    expect(statusLabel('unknown')).toBe('unknown');
  });
});

describe('statusBadgeClass()', () => {
  it('returns correct badge class for each status', () => {
    expect(statusBadgeClass('new')).toContain('yellow');
    expect(statusBadgeClass('confirmed')).toContain('green');
    expect(statusBadgeClass('completed')).toContain('gray');
    expect(statusBadgeClass('cancelled')).toContain('red');
  });
});

describe('slugify()', () => {
  it('converts text to slug', () => {
    expect(slugify('Implantologiya Kyiv')).toBe('implantologiya-kyiv');
  });
  it('removes special characters', () => {
    expect(slugify('Зуб & Здоров\'я!')).toBe('');
  });
});

describe('truncate()', () => {
  it('truncates long strings', () => {
    const result = truncate('Hello World', 5);
    expect(result).toBe('Hello…');
  });
  it('does not truncate short strings', () => {
    expect(truncate('Hi', 10)).toBe('Hi');
  });
});

describe('starsArray()', () => {
  it('returns correct filled/empty pattern', () => {
    expect(starsArray(3)).toEqual([true, true, true, false, false]);
    expect(starsArray(5)).toEqual([true, true, true, true, true]);
    expect(starsArray(0)).toEqual([false, false, false, false, false]);
  });
});
