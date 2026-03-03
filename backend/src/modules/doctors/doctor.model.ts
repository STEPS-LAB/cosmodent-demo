import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IDoctor extends Document {
  name: string;
  slug: string;
  specialization: string;
  bio: string;
  experience: number;        // years
  photo?: string;
  services: mongoose.Types.ObjectId[];
  rating: number;
  reviewCount: number;
  schedule: DoctorSchedule;
  isActive: boolean;
  order: number;
  socials?: { instagram?: string; linkedin?: string };
  createdAt: Date;
  updatedAt: Date;
}

export interface DoctorSchedule {
  [day: string]: { start: string; end: string; isWorking: boolean };
}

const DoctorSchema = new Schema<IDoctor>(
  {
    name:           { type: String, required: true, trim: true },
    slug:           { type: String, required: true, unique: true, lowercase: true, trim: true },
    specialization: { type: String, required: true },
    bio:            { type: String, required: true },
    experience:     { type: Number, required: true, min: 0 },
    photo:          { type: String },
    services:       [{ type: Schema.Types.ObjectId, ref: 'Service' }],
    rating:         { type: Number, default: 0, min: 0, max: 5 },
    reviewCount:    { type: Number, default: 0, min: 0 },
    schedule: {
      type: Schema.Types.Mixed,
      default: () => ({
        monday:    { start: '09:00', end: '18:00', isWorking: true },
        tuesday:   { start: '09:00', end: '18:00', isWorking: true },
        wednesday: { start: '09:00', end: '18:00', isWorking: true },
        thursday:  { start: '09:00', end: '18:00', isWorking: true },
        friday:    { start: '09:00', end: '17:00', isWorking: true },
        saturday:  { start: '10:00', end: '15:00', isWorking: false },
        sunday:    { start: '00:00', end: '00:00', isWorking: false },
      }),
    },
    isActive:    { type: Boolean, default: true },
    order:       { type: Number, default: 0 },
    socials:     { instagram: String, linkedin: String },
  },
  { timestamps: true },
);

DoctorSchema.index({ slug: 1 }, { unique: true });
DoctorSchema.index({ isActive: 1, order: 1 });
DoctorSchema.index({ rating: -1 });

export const Doctor: Model<IDoctor> = mongoose.models.Doctor
  ?? mongoose.model<IDoctor>('Doctor', DoctorSchema);
