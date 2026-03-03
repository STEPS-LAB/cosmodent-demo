import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IReview extends Document {
  patientName: string;
  rating: number;
  text: string;
  serviceId?: mongoose.Types.ObjectId;
  doctorId?:  mongoose.Types.ObjectId;
  isApproved: boolean;
  isHighlighted: boolean;
  source: 'website' | 'google' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    patientName:   { type: String, required: true, trim: true, maxlength: 100 },
    rating:        { type: Number, required: true, min: 1, max: 5 },
    text:          { type: String, required: true, maxlength: 2000 },
    serviceId:     { type: Schema.Types.ObjectId, ref: 'Service' },
    doctorId:      { type: Schema.Types.ObjectId, ref: 'Doctor' },
    isApproved:    { type: Boolean, default: false },
    isHighlighted: { type: Boolean, default: false },
    source:        { type: String, enum: ['website', 'google', 'admin'], default: 'website' },
  },
  { timestamps: true },
);

ReviewSchema.index({ isApproved: 1, createdAt: -1 });
ReviewSchema.index({ rating: -1, isApproved: 1 });
ReviewSchema.index({ doctorId: 1, isApproved: 1 });

export const Review: Model<IReview> = mongoose.models.Review
  ?? mongoose.model<IReview>('Review', ReviewSchema);
