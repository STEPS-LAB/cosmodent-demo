/**
 * Admin Authentication Store
 * 
 * Production-ready Zustand store with:
 * - Persistent auth state in localStorage
 * - Proper initialization to prevent race conditions
 * - Type-safe auth state management
 * - Clean logout handling
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ============================================================================
// TYPES
// ============================================================================

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthState {
  token: string | null;
  user: AdminUser | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
}

export interface AuthActions {
  setAuth: (token: string, user: AdminUser) => void;
  logout: () => void;
  updateToken: (token: string) => void;
  updateUser: (user: Partial<AdminUser>) => void;
  initialize: () => void;
}

export type AdminStoreState = AuthState & AuthActions;

// ============================================================================
// STORE
// ============================================================================

export const useAdminStore = create<AdminStoreState>()(
  persist(
    (set, _get) => ({
      // Initial state
      token: null,
      user: null,
      isAuthenticated: false,
      isInitialized: false,

      // Set authentication
      setAuth: (token, user) =>
        set({
          token,
          user,
          isAuthenticated: true,
          isInitialized: true,
        }),

      // Update token only (for refresh)
      updateToken: (token) =>
        set((state) => ({
          ...state,
          token,
        })),

      // Update user data
      updateUser: (userData) =>
        set((state) => ({
          ...state,
          user: state.user ? { ...state.user, ...userData } : null,
        })),

      // Logout - clear all auth state
      logout: () =>
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          isInitialized: true,
        }),

      // Mark store as initialized (called after hydration)
      initialize: () =>
        set((state) => ({
          ...state,
          isInitialized: true,
        })),
    }),
    {
      name: 'admin-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist token and user, not actions
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      // Handle hydration
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Failed to rehydrate admin store:', error);
          // Clear corrupted storage
          localStorage.removeItem('admin-storage');
          return;
        }

        if (state) {
          // Validate persisted state
          if (!state.token || !state.user) {
            state.logout();
          } else {
            state.isInitialized = true;
          }
        }
      },
    }
  )
);

// ============================================================================
// SELECTORS (for use outside React components)
// ============================================================================

/**
 * Get current auth token (for API client)
 */
export const selectAuthToken = (): string | null => {
  return useAdminStore.getState().token;
};

/**
 * Check if user is authenticated
 */
export const selectIsAuthenticated = (): boolean => {
  const state = useAdminStore.getState();
  return state.isAuthenticated && !!state.token;
};

/**
 * Get current user
 */
export const selectCurrentUser = (): AdminUser | null => {
  return useAdminStore.getState().user;
};

// ============================================================================
// HOOKS (for use in React components)
// ============================================================================

/**
 * Hook to check if store is initialized
 * Prevents race conditions during SSR/hydration
 */
export const useStoreInitialized = () => {
  const isInitialized = useAdminStore((state) => state.isInitialized);
  return isInitialized;
};
