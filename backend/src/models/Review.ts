import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IReview extends Document {
  patientName: string;
  patientPhone?: string;
  service?: Types.ObjectId;
  doctor?: Types.ObjectId;
  rating: number;
  title: string;
  content: string;
  isActive: boolean;
  isVerified: boolean;
  appointment?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    patientName: {
      type: String,
      required: [true, 'Patient name is required'],
      trim: true,
      maxlength: [200, 'Name cannot exceed 200 characters'],
    },
    patientPhone: {
      type: String,
      trim: true,
    },
    service: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
      index: true,
    },
    doctor: {
      type: Schema.Types.ObjectId,
      ref: 'Doctor',
      index: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Review title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
      type: String,
      required: [true, 'Review content is required'],
      maxlength: [2000, 'Content cannot exceed 2000 characters'],
    },
    isActive: {
      type: Boolean,
      default: false,
      index: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
      index: true,
    },
    appointment: {
      type: Schema.Types.ObjectId,
      ref: 'Appointment',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for optimized queries
reviewSchema.index({ isActive: 1, rating: -1, createdAt: -1 });
reviewSchema.index({ doctor: 1, isActive: 1 });
reviewSchema.index({ service: 1, isActive: 1 });
reviewSchema.index({ patientPhone: 1 });

// Static method to calculate average rating
reviewSchema.statics.calculateAverageRating = async function (
  model: string,
  modelId: Types.ObjectId
): Promise<number> {
  const result = await this.aggregate([
    {
      $match: {
        [model.toLowerCase()]: modelId,
        isActive: true,
      },
    },
    {
      $group: {
        _id: null,
        average: { $avg: '$rating' },
        count: { $sum: 1 },
      },
    },
  ]);
  
  return result.length > 0 ? Math.round(result[0].average * 10) / 10 : 0;
};

export const Review = mongoose.model<IReview>('Review', reviewSchema);
