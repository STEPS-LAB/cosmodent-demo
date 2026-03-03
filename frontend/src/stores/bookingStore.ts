import { create } from 'zustand';

interface BookingState {
  selectedService: string | null;
  selectedDoctor: string | null;
  selectedDate: string | null;
  selectedTimeSlot: string | null;
  setService: (serviceId: string | null) => void;
  setDoctor: (doctorId: string | null) => void;
  setDate: (date: string | null) => void;
  setTimeSlot: (timeSlot: string | null) => void;
  clear: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  selectedService: null,
  selectedDoctor: null,
  selectedDate: null,
  selectedTimeSlot: null,
  setService: (serviceId) => set({ selectedService: serviceId }),
  setDoctor: (doctorId) => set({ selectedDoctor: doctorId }),
  setDate: (date) => set({ selectedDate: date }),
  setTimeSlot: (timeSlot) => set({ selectedTimeSlot: timeSlot }),
  clear: () => set({
    selectedService: null,
    selectedDoctor: null,
    selectedDate: null,
    selectedTimeSlot: null,
  }),
}));
