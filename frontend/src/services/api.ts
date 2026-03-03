/**
 * API Clients for the application
 *
 * Architecture:
 * - publicApiClient: For public endpoints (no auth, no interceptors)
 * - apiClient: For admin endpoints (with JWT auth, auto-refresh on 401)
 */

import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { useAdminStore } from '@/stores/adminStore';

// ============================================================================
// CONFIGURATION
// ============================================================================

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Token refresh lock to prevent parallel refresh requests
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Subscribe to token refresh
function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

// Execute all subscribers after refresh
function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

// ============================================================================
// TOKEN MANAGEMENT
// ============================================================================

/**
 * Get access token from Zustand store
 * Uses getState() to access latest value outside React context
 */
function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return useAdminStore.getState().token;
}

/**
 * Clear auth state on logout
 */
function clearAuthState() {
  if (typeof window === 'undefined') return;
  useAdminStore.getState().logout();
}

/**
 * Update access token in store
 */
function updateAccessToken(token: string) {
  if (typeof window === 'undefined') return;
  const state = useAdminStore.getState();
  if (state.user) {
    state.setAuth(token, state.user);
  }
}

// ============================================================================
// PUBLIC API CLIENT (no auth, no interceptors)
// ============================================================================

export const publicApiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30s timeout
});

// ============================================================================
// ADMIN API CLIENT (with JWT auth)
// ============================================================================

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable cookies for refresh token
  timeout: 30000, // 30s timeout
});

// Request interceptor for admin client
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor for admin client - auto refresh on 401
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<{ message?: string; statusCode?: number }>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If error is not 401 or request already retried, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // If refresh is in progress, queue this request
    if (isRefreshing) {
      return new Promise((resolve) => {
        subscribeTokenRefresh((token: string) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(apiClient(originalRequest));
        });
      });
    }

    // Mark as retrying and start refresh
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Attempt to refresh token
      const response = await apiClient.post<{ accessToken: string }>('/api/admin/auth/refresh');
      const { accessToken } = response.data;

      // Update token in store
      updateAccessToken(accessToken);

      // Notify all queued requests
      onTokenRefreshed(accessToken);

      // Retry original request with new token
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      // Refresh failed - clear auth and redirect to login
      clearAuthState();

      // Redirect to login (only in browser context)
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/login';
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

// ============================================================================
// DEFAULT RESPONSES FOR 401 (fallback for public endpoints)
// ============================================================================

const DEFAULT_STATISTICS = {
  totalReviews: 0,
  activeReviews: 0,
  averageRating: 0,
  ratingDistribution: [
    { rating: 1, count: 0 },
    { rating: 2, count: 0 },
    { rating: 3, count: 0 },
    { rating: 4, count: 0 },
    { rating: 5, count: 0 },
  ],
};

// ============================================================================
// API METHODS
// ============================================================================

export const api = {
  // ==========================================================================
  // GENERIC METHODS
  // ==========================================================================

  get: <T>(url: string, config?: { params?: Record<string, unknown> }) =>
    apiClient.get<T>(url, config).then((res) => res.data),

  post: <T>(url: string, data?: unknown) =>
    apiClient.post<T>(url, data).then((res) => res.data),

  patch: <T>(url: string, data?: unknown) =>
    apiClient.patch<T>(url, data).then((res) => res.data),

  put: <T>(url: string, data?: unknown) =>
    apiClient.put<T>(url, data).then((res) => res.data),

  delete: <T>(url: string) =>
    apiClient.delete<T>(url).then((res) => res.data),

  // ==========================================================================
  // PUBLIC: SERVICES (uses publicApiClient - no auth)
  // ==========================================================================

  getServices: async (params?: Record<string, string>) => {
    const response = await publicApiClient.get<any[]>('/api/services', { params });
    return response.data;
  },

  getServiceBySlug: async (slug: string) => {
    const response = await publicApiClient.get<any>(`/api/services/${slug}`);
    return response.data;
  },

  // ==========================================================================
  // PUBLIC: DOCTORS (uses publicApiClient - no auth)
  // ==========================================================================

  getDoctors: async (params?: Record<string, string>) => {
    const response = await publicApiClient.get<any[]>('/api/doctors', { params });
    return response.data;
  },

  getDoctorBySlug: async (slug: string) => {
    const response = await publicApiClient.get<any>(`/api/doctors/${slug}`);
    return response.data;
  },

  // ==========================================================================
  // PUBLIC: REVIEWS (uses publicApiClient - no auth)
  // ==========================================================================

  getReviews: async (params?: Record<string, string>) => {
    const response = await publicApiClient.get<any[]>('/api/reviews', { params });
    return response.data;
  },

  getReviewStatistics: async () => {
    try {
      const response = await publicApiClient.get<any>('/api/reviews/statistics');
      return response.data;
    } catch (error) {
      // For public endpoint, return default stats on error
      console.warn('Failed to fetch review statistics, using defaults');
      return DEFAULT_STATISTICS;
    }
  },

  createReview: async (data: {
    patientName: string;
    patientPhone?: string;
    service?: string;
    doctor?: string;
    rating: number;
    title: string;
    content: string;
  }) => {
    const response = await publicApiClient.post('/api/reviews', data);
    return response.data;
  },

  // ==========================================================================
  // PUBLIC: APPOINTMENTS (uses publicApiClient - no auth)
  // ==========================================================================

  getAvailableDates: async (days?: number) => {
    const response = await publicApiClient.get<any[]>('/api/appointments/available-dates', {
      params: { days },
    });
    return response.data;
  },

  getAvailableSlots: async (date: string, service?: string) => {
    const response = await publicApiClient.get<any[]>('/api/appointments/available-slots', {
      params: { date, service },
    });
    return response.data;
  },

  checkAvailability: async (date: string, timeSlot: string) => {
    const response = await publicApiClient.get('/api/appointments/check-availability', {
      params: { date, timeSlot },
    });
    return response.data;
  },

  createAppointment: async (data: {
    patientName: string;
    patientPhone: string;
    patientEmail?: string;
    patientNotes?: string;
    service: string;
    doctor?: string;
    date: string;
    timeSlot: string;
  }) => {
    const response = await publicApiClient.post('/api/appointments', data);
    return response.data;
  },

  // ==========================================================================
  // PUBLIC: BLOG (uses publicApiClient - no auth)
  // ==========================================================================

  getBlogPosts: async (params?: Record<string, string>) => {
    const response = await publicApiClient.get<any[]>('/api/blog', { params });
    return response.data;
  },

  getBlogPostBySlug: async (slug: string) => {
    const response = await publicApiClient.get<any>(`/api/blog/${slug}`);
    return response.data;
  },

  getFeaturedPosts: async () => {
    const response = await publicApiClient.get<any[]>('/api/blog/featured');
    return response.data;
  },

  // ==========================================================================
  // PUBLIC: SETTINGS (uses publicApiClient - no auth)
  // ==========================================================================

  getSettings: async () => {
    const response = await publicApiClient.get('/api/settings');
    return response.data;
  },

  getContactInfo: async () => {
    const response = await publicApiClient.get('/api/settings/contact');
    return response.data;
  },

  // ==========================================================================
  // ADMIN: AUTH
  // ==========================================================================

  adminLogin: async (email: string, password: string) => {
    const response = await apiClient.post<{
      accessToken: string;
      admin: { id: string; email: string; name: string; role: string };
    }>('/api/admin/auth/login', { email, password });
    return response.data;
  },

  adminRefresh: async () => {
    const response = await apiClient.post<{ accessToken: string }>(
      '/api/admin/auth/refresh'
    );
    return response.data;
  },

  adminLogout: async () => {
    try {
      await apiClient.post('/api/admin/auth/logout');
    } finally {
      clearAuthState();
    }
  },

  getMe: async () => {
    const response = await apiClient.get('/api/admin/auth/me');
    return response.data;
  },

  // ==========================================================================
  // ADMIN: DASHBOARD
  // ==========================================================================

  getDashboardStats: async () => {
    const response = await apiClient.get('/api/admin/dashboard');
    return response.data;
  },

  getRecentAppointments: async () => {
    const response = await apiClient.get('/api/admin/dashboard/recent-appointments');
    return response.data;
  },

  // ==========================================================================
  // ADMIN: SERVICES
  // ==========================================================================

  getAdminServices: async () => {
    const response = await apiClient.get<any[]>('/api/admin/services');
    return response.data;
  },

  getServiceById: async (id: string) => {
    const response = await apiClient.get<any>(`/api/admin/services/${id}`);
    return response.data;
  },

  createService: async (data: any) => {
    const response = await apiClient.post('/api/admin/services', data);
    return response.data;
  },

  updateService: async (id: string, data: any) => {
    const response = await apiClient.patch(`/api/admin/services/${id}`, data);
    return response.data;
  },

  deleteService: async (id: string) => {
    const response = await apiClient.delete(`/api/admin/services/${id}`);
    return response.data;
  },

  updateServicesOrder: async (ids: string[]) => {
    const response = await apiClient.put('/api/admin/services/order', { ids });
    return response.data;
  },

  // ==========================================================================
  // ADMIN: APPOINTMENTS
  // ==========================================================================

  getAllAppointments: async () => {
    const response = await apiClient.get<any[]>('/api/admin/appointments');
    return response.data;
  },

  getAdminAppointments: async (status?: string) => {
    const params = status && status !== 'all' ? { status } : undefined;
    const response = await apiClient.get<any[]>('/api/admin/appointments', { params });
    return response.data;
  },

  getAppointmentById: async (id: string) => {
    const response = await apiClient.get<any>(`/api/admin/appointments/${id}`);
    return response.data;
  },

  updateAppointmentStatus: async (id: string, status: string) => {
    const response = await apiClient.patch(`/api/admin/appointments/${id}/status`, {
      status,
    });
    return response.data;
  },

  cancelAppointment: async (id: string) => {
    const response = await apiClient.patch(`/api/admin/appointments/${id}/cancel`);
    return response.data;
  },

  // ==========================================================================
  // ADMIN: DOCTORS
  // ==========================================================================

  getAdminDoctors: async () => {
    const response = await apiClient.get<any[]>('/api/admin/doctors');
    return response.data;
  },

  getDoctorById: async (id: string) => {
    const response = await apiClient.get<any>(`/api/admin/doctors/${id}`);
    return response.data;
  },

  createDoctor: async (data: any) => {
    const response = await apiClient.post('/api/admin/doctors', data);
    return response.data;
  },

  updateDoctor: async (id: string, data: any) => {
    const response = await apiClient.patch(`/api/admin/doctors/${id}`, data);
    return response.data;
  },

  deleteDoctor: async (id: string) => {
    const response = await apiClient.delete(`/api/admin/doctors/${id}`);
    return response.data;
  },

  updateDoctorsOrder: async (ids: string[]) => {
    const response = await apiClient.put('/api/admin/doctors/order', { ids });
    return response.data;
  },

  // ==========================================================================
  // ADMIN: REVIEWS
  // ==========================================================================

  getAdminReviews: async () => {
    const response = await apiClient.get<any[]>('/api/admin/reviews');
    return response.data;
  },

  getReviewById: async (id: string) => {
    const response = await apiClient.get<any>(`/api/admin/reviews/${id}`);
    return response.data;
  },

  approveReview: async (id: string) => {
    const response = await apiClient.patch(`/api/admin/reviews/${id}/approve`);
    return response.data;
  },

  rejectReview: async (id: string) => {
    const response = await apiClient.patch(`/api/admin/reviews/${id}/reject`);
    return response.data;
  },

  updateReview: async (id: string, data: any) => {
    const response = await apiClient.patch(`/api/admin/reviews/${id}`, data);
    return response.data;
  },

  deleteReview: async (id: string) => {
    const response = await apiClient.delete(`/api/admin/reviews/${id}`);
    return response.data;
  },

  // ==========================================================================
  // ADMIN: BLOG
  // ==========================================================================

  getAdminBlogPosts: async () => {
    const response = await apiClient.get<any[]>('/api/admin/blog');
    return response.data;
  },

  getBlogPostById: async (id: string) => {
    const response = await apiClient.get<any>(`/api/admin/blog/${id}`);
    return response.data;
  },

  createBlogPost: async (data: any) => {
    const response = await apiClient.post('/api/admin/blog', data);
    return response.data;
  },

  updateBlogPost: async (id: string, data: any) => {
    const response = await apiClient.patch(`/api/admin/blog/${id}`, data);
    return response.data;
  },

  deleteBlogPost: async (id: string) => {
    const response = await apiClient.delete(`/api/admin/blog/${id}`);
    return response.data;
  },

  publishBlogPost: async (id: string) => {
    const response = await apiClient.patch(`/api/admin/blog/${id}/publish`);
    return response.data;
  },

  unpublishBlogPost: async (id: string) => {
    const response = await apiClient.patch(`/api/admin/blog/${id}/unpublish`);
    return response.data;
  },

  // ==========================================================================
  // ADMIN: SETTINGS
  // ==========================================================================

  getAdminSettings: async () => {
    const response = await apiClient.get('/api/admin/settings');
    return response.data;
  },

  updateSettings: async (data: any) => {
    const response = await apiClient.patch('/api/admin/settings', data);
    return response.data;
  },

  updateClinicInfo: async (data: any) => {
    const response = await apiClient.patch('/api/admin/settings/clinic-info', data);
    return response.data;
  },

  updateWorkingHours: async (data: any) => {
    const response = await apiClient.patch('/api/admin/settings/working-hours', data);
    return response.data;
  },

  updateSocialLinks: async (data: any) => {
    const response = await apiClient.patch('/api/admin/settings/social-links', data);
    return response.data;
  },

  updateSeo: async (data: any) => {
    const response = await apiClient.patch('/api/admin/settings/seo', data);
    return response.data;
  },

  updateBookingSettings: async (data: any) => {
    const response = await apiClient.patch('/api/admin/settings/booking', data);
    return response.data;
  },
};

export default api;
