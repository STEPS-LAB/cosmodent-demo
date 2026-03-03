import mongoose, { Document, Schema, Model } from 'mongoose';
import { AppointmentStatus } from '../../shared/types';

// ── Interface ─────────────────────────────────────────────
export interface IAppointment extends Document {
  patientName: string;
  phone: string;
  serviceId: mongoose.Types.ObjectId;
  doctorId?: mongoose.Types.ObjectId;
  date: Date;
  timeSlot: string;          // "HH:MM"
  status: AppointmentStatus;
  notes?: string;
  aiSuggestedServices?: string[];
  source: 'website' | 'admin' | 'phone';
  createdAt: Date;
  updatedAt: Date;
}

// ── Schema ────────────────────────────────────────────────
const AppointmentSchema = new Schema<IAppointment>(
  {
    patientName: { type: String, required: true, trim: true, maxlength: 100 },
    phone: {
      type: String,
      required: true,
      trim: true,
      match: [/^\+?[\d\s\-()]{7,20}$/, 'Invalid phone number'],
    },
    serviceId: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
    doctorId:  { type: Schema.Types.ObjectId, ref: 'Doctor' },
    date:      { type: Date, required: true },
    timeSlot:  {
      type: String,
      required: true,
      match: [/^([01]\d|2[0-3]):[0-5]\d$/, 'timeSlot must be HH:MM'],
    },
    status: {
      type: String,
      enum: ['new', 'confirmed', 'completed', 'cancelled'],
      default: 'new',
    },
    notes:               { type: String, maxlength: 1000 },
    aiSuggestedServices: [{ type: String }],
    source: {
      type: String,
      enum: ['website', 'admin', 'phone'],
      default: 'website',
    },
  },
  { timestamps: true },
);

// ── Indexes ───────────────────────────────────────────────
// Compound index: check slot availability in O(1)
AppointmentSchema.index({ date: 1, timeSlot: 1, doctorId: 1 });
// Admin list queries
AppointmentSchema.index({ status: 1, createdAt: -1 });
// Search by patient phone
AppointmentSchema.index({ phone: 1 });

// ── Model ─────────────────────────────────────────────────
export const Appointment: Model<IAppointment> = mongoose.models.Appointment
  ?? mongoose.model<IAppointment>('Appointment', AppointmentSchema);
