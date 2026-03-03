'use client';

import { useState, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { appointmentsApi } from '@/lib/api';
import { BookingFormData, TimeSlot } from '@/types';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

/**
 * useBooking
 *
 * Encapsulates full booking flow state:
 *  1. Date selection → fetch available slots (real-time)
 *  2. Slot selection
 *  3. Form submit
 */
export function useBooking() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [doctorId,     setDoctorId]     = useState<string | undefined>();

  // ── Fetch slots when date changes ─────────────────────────
  const { data: slots = [], isLoading: slotsLoading } = useQuery<TimeSlot[]>({
    queryKey: ['slots', selectedDate?.toISOString(), doctorId],
    queryFn: () =>
      appointmentsApi.getSlots(
        format(selectedDate!, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
        doctorId,
      ),
    enabled: !!selectedDate,
    refetchInterval: 30_000, // Poll every 30s for real-time updates
    staleTime: 0,
  });

  // ── Submit booking ────────────────────────────────────────
  const mutation = useMutation({
    mutationFn: (data: BookingFormData) => appointmentsApi.book(data),
    onSuccess: () => {
      toast.success('Запис успішно створено! Очікуйте підтвердження.');
      setSelectedDate(null);
      setSelectedSlot(null);
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.error ?? 'Помилка запису. Спробуйте ще раз.';
      toast.error(msg);
    },
  });

  const selectDate = useCallback((date: Date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  }, []);

  const selectSlot = useCallback((time: string) => {
    setSelectedSlot(time);
  }, []);

  const submitBooking = useCallback(
    (data: Omit<BookingFormData, 'date' | 'timeSlot'>) => {
      if (!selectedDate || !selectedSlot) return;
      mutation.mutate({
        ...data,
        date:     selectedDate.toISOString(),
        timeSlot: selectedSlot,
        doctorId,
      });
    },
    [selectedDate, selectedSlot, doctorId, mutation],
  );

  return {
    selectedDate,
    selectedSlot,
    slots,
    slotsLoading,
    isSubmitting: mutation.isPending,
    isSuccess:    mutation.isSuccess,
    selectDate,
    selectSlot,
    setDoctorId,
    submitBooking,
  };
}
