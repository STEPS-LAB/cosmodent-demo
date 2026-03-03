import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TimeSlotPicker } from '@/components/booking/TimeSlotPicker';

const slots = [
  { time: '09:00', available: true  },
  { time: '10:00', available: false },
  { time: '11:00', available: true  },
];

describe('TimeSlotPicker', () => {
  it('renders available and booked slots', () => {
    render(<TimeSlotPicker slots={slots} loading={false} selected={null} onSelect={vi.fn()} />);
    expect(screen.getByText('09:00')).toBeDefined();
    expect(screen.getByText('10:00')).toBeDefined();
    expect(screen.getByText('11:00')).toBeDefined();
  });

  it('shows loading state', () => {
    render(<TimeSlotPicker slots={[]} loading={true} selected={null} onSelect={vi.fn()} />);
    expect(screen.getByText(/завантаження/i)).toBeDefined();
  });

  it('shows empty state when no available slots', () => {
    const allBooked = [{ time: '09:00', available: false }];
    render(<TimeSlotPicker slots={allBooked} loading={false} selected={null} onSelect={vi.fn()} />);
    expect(screen.getByText(/немає вільних/i)).toBeDefined();
  });

  it('calls onSelect when available slot is clicked', () => {
    const onSelect = vi.fn();
    render(<TimeSlotPicker slots={slots} loading={false} selected={null} onSelect={onSelect} />);
    fireEvent.click(screen.getByText('09:00'));
    expect(onSelect).toHaveBeenCalledWith('09:00');
  });

  it('does NOT call onSelect when unavailable slot is clicked', () => {
    const onSelect = vi.fn();
    render(<TimeSlotPicker slots={slots} loading={false} selected={null} onSelect={onSelect} />);
    fireEvent.click(screen.getByText('10:00'));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('highlights the selected slot', () => {
    render(<TimeSlotPicker slots={slots} loading={false} selected="09:00" onSelect={vi.fn()} />);
    const btn = screen.getByRole('radio', { name: '09:00' });
    expect(btn.getAttribute('aria-checked')).toBe('true');
  });
});
