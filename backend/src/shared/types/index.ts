import { Types } from 'mongoose';

// ── Pagination ────────────────────────────────────────────
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ── JWT Payload ───────────────────────────────────────────
export interface JwtPayload {
  id: string;
  email: string;
  role: 'admin' | 'superadmin';
}

// ── API Response wrapper ──────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// ── Mongoose helpers ──────────────────────────────────────
export type ObjectId = Types.ObjectId;
export type WithId<T> = T & { _id: ObjectId };

// ── Appointment enums ─────────────────────────────────────
export type AppointmentStatus = 'new' | 'confirmed' | 'completed' | 'cancelled';

// ── Time slot ─────────────────────────────────────────────
export interface TimeSlot {
  time: string;    // "HH:MM"
  available: boolean;
  appointmentId?: string;
}

// ── AI Suggestion ─────────────────────────────────────────
export interface AiSuggestion {
  type: 'service' | 'content' | 'seo';
  title: string;
  description: string;
  confidence: number; // 0-1
}
