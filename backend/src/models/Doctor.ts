import mongoose, { Document, Schema } from 'mongoose';

export interface IDoctor extends Document {
  name: string;
  slug: string;
  position: string;
  specialization: string[];
  bio: string;
  imageUrl?: string;
  experience: number;
  education: string[];
  isActive: boolean;
  sortOrder: number;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  rating?: number;
  reviewsCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

const doctorSchema = new Schema<IDoctor>(
  {
    name: {
      type: String,
      required: [true, 'Doctor name is required'],
      trim: true,
      maxlength: [200, 'Name cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Doctor slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    position: {
      type: String,
      required: [true, 'Position is required'],
      trim: true,
    },
    specialization: {
      type: [String],
      required: [true, 'At least one specialization is required'],
    },
    bio: {
      type: String,
      required: [true, 'Bio is required'],
    },
    imageUrl: {
      type: String,
    },
    experience: {
      type: Number,
      required: [true, 'Experience is required'],
      min: [0, 'Experience cannot be negative'],
    },
    education: {
      type: [String],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    socialLinks: {
      facebook: String,
      instagram: String,
      linkedin: String,
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot exceed 5'],
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for optimized queries
doctorSchema.index({ slug: 1 });
doctorSchema.index({ isActive: 1, sortOrder: 1 });
doctorSchema.index({ specialization: 1 });
doctorSchema.index({ name: 'text', position: 'text' });

// Virtual for appointments
doctorSchema.virtual('appointments', {
  ref: 'Appointment',
  localField: '_id',
  foreignField: 'doctor',
});

export const Doctor = mongoose.model<IDoctor>('Doctor', doctorSchema);
