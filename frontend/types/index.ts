// ── Service ───────────────────────────────────────────────
export interface Service {
  _id:              string;
  name:             string;
  slug:             string;
  shortDescription: string;
  fullDescription:  string;
  startingPrice:    number;
  currency:         string;
  duration:         number;
  category:         string;
  isActive:         boolean;
  order:            number;
  image?:           string;
  seoTitle:         string;
  seoDescription:   string;
  seoKeywords?:     string[];
  createdAt:        string;
  updatedAt:        string;
}

// ── Doctor ────────────────────────────────────────────────
export interface Doctor {
  _id:            string;
  name:           string;
  slug:           string;
  specialization: string;
  bio:            string;
  experience:     number;
  photo?:         string;
  services:       Pick<Service, '_id' | 'name' | 'slug'>[];
  rating:         number;
  reviewCount:    number;
  isActive:       boolean;
  order:          number;
  socials?:       { instagram?: string; linkedin?: string };
  createdAt:      string;
  updatedAt:      string;
}

// ── Review ────────────────────────────────────────────────
export interface Review {
  _id:           string;
  patientName:   string;
  rating:        number;
  text:          string;
  serviceId?:    Pick<Service, '_id' | 'name'>;
  doctorId?:     Pick<Doctor, '_id' | 'name' | 'photo'>;
  isApproved:    boolean;
  isHighlighted: boolean;
  source:        'website' | 'google' | 'admin';
  createdAt:     string;
  updatedAt:     string;
}

// ── Appointment ───────────────────────────────────────────
export type AppointmentStatus = 'new' | 'confirmed' | 'completed' | 'cancelled';

export interface Appointment {
  _id:         string;
  patientName: string;
  phone:       string;
  serviceId:   Pick<Service, '_id' | 'name' | 'slug' | 'startingPrice'>;
  doctorId?:   Pick<Doctor, '_id' | 'name' | 'photo'>;
  date:        string;
  timeSlot:    string;
  status:      AppointmentStatus;
  notes?:      string;
  source:      'website' | 'admin' | 'phone';
  createdAt:   string;
  updatedAt:   string;
}

// ── TimeSlot ──────────────────────────────────────────────
export interface TimeSlot {
  time:      string;
  available: boolean;
}

// ── Blog Post ─────────────────────────────────────────────
export interface BlogPost {
  _id:            string;
  title:          string;
  slug:           string;
  excerpt:        string;
  content:        string;
  coverImage?:    string;
  authorId:       Pick<Doctor, '_id' | 'name' | 'photo'>;
  tags:           string[];
  isPublished:    boolean;
  publishedAt?:   string;
  seoTitle:       string;
  seoDescription: string;
  viewCount:      number;
  createdAt:      string;
}

// ── Settings ──────────────────────────────────────────────
export interface ClinicSettings {
  clinicName: string;
  phone:      string;
  email:      string;
  address:    string;
  workingHours: { weekdays: string; saturday: string; sunday: string };
  socialLinks:  { instagram?: string; facebook?: string; telegram?: string; youtube?: string };
  seo: {
    defaultTitle:       string;
    defaultDescription: string;
    defaultKeywords:    string[];
    googleAnalyticsId?: string;
  };
  heroHeading:    string;
  heroSubheading: string;
}

// ── Paginated ─────────────────────────────────────────────
export interface PaginatedResult<T> {
  data:       T[];
  total:      number;
  page:       number;
  limit:      number;
  totalPages: number;
}

// ── API Response ──────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data?:   T;
  message?: string;
  error?:   string;
}

// ── Booking Form ──────────────────────────────────────────
export interface BookingFormData {
  patientName: string;
  phone:       string;
  serviceId:   string;
  doctorId?:   string;
  date:        string;
  timeSlot:    string;
  notes?:      string;
}

// ── AI Suggestion ─────────────────────────────────────────
export interface AiSuggestion {
  type:        'service' | 'content' | 'seo';
  title:       string;
  description: string;
  confidence:  number;
}

// ── Dashboard Stats ───────────────────────────────────────
export interface DashboardStats {
  total:    number;
  today:    number;
  thisWeek: number;
  byStatus: Record<AppointmentStatus, number>;
}
