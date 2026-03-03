import mongoose, { Document, Schema, Types } from 'mongoose';

export type AppointmentStatus = 'new' | 'confirmed' | 'completed' | 'cancelled';

export interface IAppointment extends Document {
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  patientNotes?: string;
  service: Types.ObjectId;
  doctor?: Types.ObjectId;
  date: Date;
  timeSlot: string;
  status: AppointmentStatus;
  statusHistory: Array<{
    status: AppointmentStatus;
    changedAt: Date;
    changedBy?: Types.ObjectId;
    reason?: string;
  }>;
  reminderSent?: boolean;
  confirmationSent?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const appointmentSchema = new Schema<IAppointment>(
  {
    patientName: {
      type: String,
      required: [true, 'Patient name is required'],
      trim: true,
      maxlength: [200, 'Name cannot exceed 200 characters'],
    },
    patientPhone: {
      type: String,
      required: [true, 'Patient phone is required'],
      trim: true,
    },
    patientEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    patientNotes: {
      type: String,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },
    service: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
      required: [true, 'Service is required'],
      index: true,
    },
    doctor: {
      type: Schema.Types.ObjectId,
      ref: 'Doctor',
      index: true,
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      index: true,
    },
    timeSlot: {
      type: String,
      required: [true, 'Time slot is required'],
      index: true,
    },
    status: {
      type: String,
      enum: ['new', 'confirmed', 'completed', 'cancelled'],
      default: 'new',
      index: true,
    },
    statusHistory: {
      type: [
        {
          status: {
            type: String,
            enum: ['new', 'confirmed', 'completed', 'cancelled'],
          },
          changedAt: {
            type: Date,
            default: Date.now,
          },
          changedBy: {
            type: Schema.Types.ObjectId,
            ref: 'Admin',
          },
          reason: String,
        },
      ],
      default: [],
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
    confirmationSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound index for availability checking
appointmentSchema.index({ date: 1, timeSlot: 1, status: 1 });
appointmentSchema.index({ patientPhone: 1 });
appointmentSchema.index({ status: 1, date: 1 });

// Pre-save hook to add initial status to history
appointmentSchema.pre('save', function (next) {
  if (this.isNew) {
    this.statusHistory.push({
      status: this.status,
      changedAt: new Date(),
    });
  }
  next();
});

// Method to update status
appointmentSchema.methods.updateStatus = async function (
  status: AppointmentStatus,
  adminId?: Types.ObjectId,
  reason?: string
) {
  this.status = status;
  this.statusHistory.push({
    status,
    changedAt: new Date(),
    changedBy: adminId,
    reason,
  });
  return this.save();
};

export const Appointment = mongoose.model<IAppointment>(
  'Appointment',
  appointmentSchema
);
