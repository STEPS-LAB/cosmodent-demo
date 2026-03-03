import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IService extends Document {
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  startingPrice: number;
  isActive: boolean;
  sortOrder: number;
  seoTitle: string;
  seoDescription: string;
  imageUrl?: string;
  duration?: number;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService>(
  {
    name: {
      type: String,
      required: [true, 'Service name is required'],
      trim: true,
      maxlength: [200, 'Name cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Service slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      maxlength: [500, 'Short description cannot exceed 500 characters'],
    },
    fullDescription: {
      type: String,
      required: [true, 'Full description is required'],
    },
    startingPrice: {
      type: Number,
      required: [true, 'Starting price is required'],
      min: [0, 'Price cannot be negative'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    seoTitle: {
      type: String,
      maxlength: [70, 'SEO title cannot exceed 70 characters'],
    },
    seoDescription: {
      type: String,
      maxlength: [160, 'SEO description cannot exceed 160 characters'],
    },
    imageUrl: {
      type: String,
    },
    duration: {
      type: Number,
      min: [1, 'Duration must be at least 1 minute'],
    },
    category: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for optimized queries
serviceSchema.index({ slug: 1 });
serviceSchema.index({ isActive: 1, sortOrder: 1 });
serviceSchema.index({ category: 1, isActive: 1 });
serviceSchema.index({ name: 'text', shortDescription: 'text' });

// Virtual for appointments
serviceSchema.virtual('appointments', {
  ref: 'Appointment',
  localField: '_id',
  foreignField: 'service',
});

export const Service = mongoose.model<IService>('Service', serviceSchema);
