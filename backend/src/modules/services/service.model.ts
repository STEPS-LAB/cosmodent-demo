import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IService extends Document {
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  startingPrice: number;
  currency: string;
  duration: number;           // minutes per session
  category: string;
  isActive: boolean;
  order: number;              // drag-and-drop sort order
  image?: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    name:             { type: String, required: true, trim: true },
    slug:             { type: String, required: true, unique: true, lowercase: true, trim: true },
    shortDescription: { type: String, required: true, maxlength: 300 },
    fullDescription:  { type: String, required: true },
    startingPrice:    { type: Number, required: true, min: 0 },
    currency:         { type: String, default: 'UAH' },
    duration:         { type: Number, default: 60 },
    category:         { type: String, default: 'general' },
    isActive:         { type: Boolean, default: true },
    order:            { type: Number, default: 0 },
    image:            { type: String },
    seoTitle:         { type: String, required: true, maxlength: 70 },
    seoDescription:   { type: String, required: true, maxlength: 160 },
    seoKeywords:      [{ type: String }],
  },
  { timestamps: true },
);

// ── Indexes ───────────────────────────────────────────────
ServiceSchema.index({ slug: 1 }, { unique: true });
ServiceSchema.index({ isActive: 1, order: 1 });
ServiceSchema.index({ category: 1, isActive: 1 });

export const Service: Model<IService> = mongoose.models.Service
  ?? mongoose.model<IService>('Service', ServiceSchema);
