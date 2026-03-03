import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import {
  ApiResponse, PaginatedResult,
  Service, Doctor, Review, Appointment,
  AppointmentStatus, TimeSlot, BlogPost,
  ClinicSettings, BookingFormData, DashboardStats,
} from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

// ── Axios instance ────────────────────────────────────────
export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Auth token injection (admin) ──────────────────────────
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('cosmodent_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor: normalize errors ────────────────
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('cosmodent_token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(err);
  },
);

// ── API helper ────────────────────────────────────────────
async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const res = await apiClient.get<ApiResponse<T>>(url, config);
  return res.data.data as T;
}

// ── Services API ──────────────────────────────────────────
export const servicesApi = {
  getAll:    ()           => get<Service[]>('/services/public'),
  getBySlug: (slug: string) => get<Service>(`/services/public/${slug}`),

  // Admin
  adminList:   (params?: Record<string, unknown>)      => apiClient.get('/services', { params }),
  adminCreate: (data: Partial<Service>)                 => apiClient.post('/services', data),
  adminUpdate: (id: string, data: Partial<Service>)    => apiClient.put(`/services/${id}`, data),
  adminDelete: (id: string)                             => apiClient.delete(`/services/${id}`),
  adminReorder: (ids: string[])                         => apiClient.post('/services/reorder', { ids }),
};

// ── Doctors API ───────────────────────────────────────────
export const doctorsApi = {
  getAll:    ()           => get<Doctor[]>('/doctors/public'),
  getBySlug: (slug: string) => get<Doctor>(`/doctors/public/${slug}`),

  // Admin
  adminList:   (params?: Record<string, unknown>) => apiClient.get('/doctors', { params }),
  adminCreate: (data: Partial<Doctor>)             => apiClient.post('/doctors', data),
  adminUpdate: (id: string, data: Partial<Doctor>) => apiClient.put(`/doctors/${id}`, data),
  adminDelete: (id: string)                        => apiClient.delete(`/doctors/${id}`),
};

// ── Appointments API ──────────────────────────────────────
export const appointmentsApi = {
  getSlots: (date: string, doctorId?: string) =>
    get<TimeSlot[]>('/appointments/slots', { params: { date, doctorId } }),

  book: (data: BookingFormData) =>
    apiClient.post<ApiResponse<Appointment>>('/appointments', data),

  // Admin
  adminList: (params?: {
    status?: AppointmentStatus;
    page?: number;
    limit?: number;
    search?: string;
  }) => apiClient.get<ApiResponse<PaginatedResult<Appointment>>>('/appointments', { params }),

  adminStats:        ()                                 => get<DashboardStats>('/appointments/stats/summary'),
  adminUpdateStatus: (id: string, status: AppointmentStatus, notes?: string) =>
    apiClient.patch(`/appointments/${id}/status`, { status, notes }),
};

// ── Reviews API ───────────────────────────────────────────
export const reviewsApi = {
  getHighlighted: (limit = 6) => get<Review[]>(`/reviews/public?limit=${limit}`),
  submit:         (data: Partial<Review>) => apiClient.post('/reviews', data),

  // Admin
  adminList:          (params?: Record<string, unknown>) => apiClient.get('/reviews', { params }),
  adminApprove:       (id: string)                       => apiClient.patch(`/reviews/${id}/approve`),
  adminToggleHighlight: (id: string)                     => apiClient.patch(`/reviews/${id}/highlight`),
  adminDelete:        (id: string)                       => apiClient.delete(`/reviews/${id}`),
};

// ── Blog API ──────────────────────────────────────────────
export const blogApi = {
  getAll:    (params?: { tag?: string; page?: number; limit?: number }) =>
    apiClient.get<ApiResponse<PaginatedResult<BlogPost>>>('/blog/public', { params }),
  getBySlug: (slug: string) => get<BlogPost>(`/blog/public/${slug}`),

  // Admin
  adminList:   (params?: Record<string, unknown>)      => apiClient.get('/blog', { params }),
  adminCreate: (data: Partial<BlogPost>)                => apiClient.post('/blog', data),
  adminUpdate: (id: string, data: Partial<BlogPost>)   => apiClient.put(`/blog/${id}`, data),
  adminDelete: (id: string)                             => apiClient.delete(`/blog/${id}`),
};

// ── Settings API ──────────────────────────────────────────
export const settingsApi = {
  get:         () => get<ClinicSettings>('/settings/public'),
  adminGet:    () => apiClient.get<ApiResponse<ClinicSettings>>('/settings'),
  adminUpdate: (data: Partial<ClinicSettings>) => apiClient.put('/settings', data),
};

// ── Auth API ──────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post<{ success: boolean; token: string; admin: { name: string; email: string; role: string } }>(
      '/auth/login',
      { email, password },
    ),
  me: () => apiClient.get('/auth/me'),
};
