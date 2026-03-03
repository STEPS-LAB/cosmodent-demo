const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Отримуємо токен з localStorage
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  const adminStorage = localStorage.getItem('admin-storage');
  if (adminStorage) {
    try {
      const parsed = JSON.parse(adminStorage);
      return parsed.state?.token || null;
    } catch {
      return null;
    }
  }
  return null;
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  const token = getAuthToken();

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

export const api = {
  // Helper for generic requests
  get: <T>(url: string) => fetchApi<T>(url),
  post: <T>(url: string, data: unknown) => 
    fetchApi<T>(url, { method: 'POST', body: JSON.stringify(data) }),
  patch: <T>(url: string, data: unknown) => 
    fetchApi<T>(url, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: <T>(url: string) => fetchApi<T>(url, { method: 'DELETE' }),
  put: <T>(url: string, data: unknown) => 
    fetchApi<T>(url, { method: 'PUT', body: JSON.stringify(data) }),

  // Services
  getServices: async (params?: Record<string, string>) => {
    const query = params ? new URLSearchParams(params).toString() : '';
    return fetchApi(`/api/services${query ? `?${query}` : ''}`);
  },

  getServiceBySlug: (slug: string) =>
    fetchApi(`/api/services/${slug}`),

  // Doctors
  getDoctors: async (params?: Record<string, string>) => {
    const query = params ? new URLSearchParams(params).toString() : '';
    return fetchApi(`/api/doctors${query ? `?${query}` : ''}`);
  },

  getDoctorBySlug: (slug: string) =>
    fetchApi(`/api/doctors/${slug}`),

  // Reviews
  getReviews: async (params?: Record<string, string>) => {
    const query = params ? new URLSearchParams(params).toString() : '';
    return fetchApi(`/api/reviews${query ? `?${query}` : ''}`);
  },

  getReviewStatistics: () =>
    fetchApi('/api/reviews/statistics'),

  createReview: (data: {
    patientName: string;
    patientPhone?: string;
    service?: string;
    doctor?: string;
    rating: number;
    title: string;
    content: string;
  }) =>
    fetchApi('/api/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Appointments
  getAvailableDates: async (days?: number) => {
    const query = days ? `?days=${days}` : '';
    return fetchApi(`/api/appointments/available-dates${query}`);
  },

  getAvailableSlots: async (date: string, service?: string) => {
    const query = new URLSearchParams({ date });
    if (service) query.append('service', service);
    return fetchApi(`/api/appointments/available-slots?${query.toString()}`);
  },

  checkAvailability: (date: string, timeSlot: string) =>
    fetchApi(`/api/appointments/check-availability?date=${date}&timeSlot=${timeSlot}`),

  createAppointment: (data: {
    patientName: string;
    patientPhone: string;
    patientEmail?: string;
    patientNotes?: string;
    service: string;
    doctor?: string;
    date: string;
    timeSlot: string;
  }) =>
    fetchApi('/api/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Blog
  getBlogPosts: async (params?: Record<string, string>) => {
    const query = params ? new URLSearchParams(params).toString() : '';
    return fetchApi(`/api/blog${query ? `?${query}` : ''}`);
  },

  getBlogPostBySlug: (slug: string) =>
    fetchApi(`/api/blog/${slug}`),

  getFeaturedPosts: () =>
    fetchApi('/api/blog/featured'),

  // Settings
  getSettings: () =>
    fetchApi('/api/settings'),

  getContactInfo: () =>
    fetchApi('/api/settings/contact'),

  // Admin Auth
  adminLogin: (email: string, password: string) =>
    fetchApi('/api/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  // Admin Dashboard
  getDashboardStats: () =>
    fetchApi('/api/admin/dashboard'),

  // Admin Services
  getAdminServices: () =>
    fetchApi('/api/admin/services'),
  createService: (data: any) =>
    fetchApi('/api/admin/services', { method: 'POST', body: JSON.stringify(data) }),
  updateService: (id: string, data: any) =>
    fetchApi(`/api/admin/services/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteService: (id: string) =>
    fetchApi(`/api/admin/services/${id}`, { method: 'DELETE' }),
  updateServicesOrder: (ids: string[]) =>
    fetchApi('/api/admin/services/order', { method: 'PUT', body: JSON.stringify({ ids }) }),

  // Admin Appointments
  getAdminAppointments: (status?: string) => {
    const query = status && status !== 'all' ? `?status=${status}` : '';
    return fetchApi(`/api/admin/appointments${query}`);
  },
  updateAppointmentStatus: (id: string, status: string) =>
    fetchApi(`/api/admin/appointments/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  cancelAppointment: (id: string) =>
    fetchApi(`/api/admin/appointments/${id}/cancel`, { method: 'PATCH' }),

  // Admin Doctors
  getAdminDoctors: () =>
    fetchApi('/api/admin/doctors'),
  createDoctor: (data: any) =>
    fetchApi('/api/admin/doctors', { method: 'POST', body: JSON.stringify(data) }),
  updateDoctor: (id: string, data: any) =>
    fetchApi(`/api/admin/doctors/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteDoctor: (id: string) =>
    fetchApi(`/api/admin/doctors/${id}`, { method: 'DELETE' }),

  // Admin Reviews
  getAdminReviews: () =>
    fetchApi('/api/admin/reviews'),
  approveReview: (id: string) =>
    fetchApi(`/api/admin/reviews/${id}/approve`, { method: 'PATCH' }),
  rejectReview: (id: string) =>
    fetchApi(`/api/admin/reviews/${id}/reject`, { method: 'PATCH' }),
  deleteReview: (id: string) =>
    fetchApi(`/api/admin/reviews/${id}`, { method: 'DELETE' }),
  getReviewStatistics: () =>
    fetchApi('/api/admin/reviews/statistics'),

  // Admin Blog
  getAdminBlogPosts: () =>
    fetchApi('/api/admin/blog'),
  createBlogPost: (data: any) =>
    fetchApi('/api/admin/blog', { method: 'POST', body: JSON.stringify(data) }),
  updateBlogPost: (id: string, data: any) =>
    fetchApi(`/api/admin/blog/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteBlogPost: (id: string) =>
    fetchApi(`/api/admin/blog/${id}`, { method: 'DELETE' }),
  publishBlogPost: (id: string) =>
    fetchApi(`/api/admin/blog/${id}/publish`, { method: 'PATCH' }),
  unpublishBlogPost: (id: string) =>
    fetchApi(`/api/admin/blog/${id}/unpublish`, { method: 'PATCH' }),

  // Admin Settings
  getAdminSettings: () =>
    fetchApi('/api/admin/settings'),
  updateSettings: (data: any) =>
    fetchApi('/api/admin/settings', { method: 'PATCH', body: JSON.stringify(data) }),
};
