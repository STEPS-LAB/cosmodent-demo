import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AdminState {
  token: string | null;
  user: AdminUser | null;
  setAuth: (token: string, user: AdminUser) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user, isAuthenticated: true }),
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
      isAuthenticated: false,
    }),
    {
      name: 'admin-storage',
    }
  )
);
