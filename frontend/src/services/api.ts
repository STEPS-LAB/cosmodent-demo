const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
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
};
