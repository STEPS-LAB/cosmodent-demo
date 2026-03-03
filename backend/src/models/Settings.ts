import mongoose, { Document, Schema } from 'mongoose';

export interface ISettings extends Document {
  clinicName: string;
  clinicDescription: string;
  phone: string;
  email: string;
  address: {
    street: string;
    city: string;
    state?: string;
    zipCode: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  workingHours: {
    monday: { open: string; close: string; isClosed: boolean };
    tuesday: { open: string; close: string; isClosed: boolean };
    wednesday: { open: string; close: string; isClosed: boolean };
    thursday: { open: string; close: string; isClosed: boolean };
    friday: { open: string; close: string; isClosed: boolean };
    saturday: { open: string; close: string; isClosed: boolean };
    sunday: { open: string; close: string; isClosed: boolean };
  };
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    tiktok?: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage?: string;
  };
  bookingSettings: {
    slotDuration: number;
    advanceBookingDays: number;
    minBookingHours: number;
    maxAppointmentsPerSlot: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const settingsSchema = new Schema<ISettings>(
  {
    clinicName: {
      type: String,
      required: [true, 'Clinic name is required'],
      trim: true,
    },
    clinicDescription: {
      type: String,
      required: [true, 'Clinic description is required'],
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    address: {
      street: {
        type: String,
        required: [true, 'Street is required'],
      },
      city: {
        type: String,
        required: [true, 'City is required'],
      },
      state: String,
      zipCode: {
        type: String,
        required: [true, 'Zip code is required'],
      },
      country: {
        type: String,
        default: 'Ukraine',
      },
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    workingHours: {
      monday: {
        open: { type: String, default: '09:00' },
        close: { type: String, default: '18:00' },
        isClosed: { type: Boolean, default: false },
      },
      tuesday: {
        open: { type: String, default: '09:00' },
        close: { type: String, default: '18:00' },
        isClosed: { type: Boolean, default: false },
      },
      wednesday: {
        open: { type: String, default: '09:00' },
        close: { type: String, default: '18:00' },
        isClosed: { type: Boolean, default: false },
      },
      thursday: {
        open: { type: String, default: '09:00' },
        close: { type: String, default: '18:00' },
        isClosed: { type: Boolean, default: false },
      },
      friday: {
        open: { type: String, default: '09:00' },
        close: { type: String, default: '18:00' },
        isClosed: { type: Boolean, default: false },
      },
      saturday: {
        open: { type: String, default: '10:00' },
        close: { type: String, default: '15:00' },
        isClosed: { type: Boolean, default: false },
      },
      sunday: {
        open: { type: String, default: '09:00' },
        close: { type: String, default: '18:00' },
        isClosed: { type: Boolean, default: true },
      },
    },
    socialLinks: {
      facebook: String,
      instagram: String,
      twitter: String,
      youtube: String,
      tiktok: String,
    },
    seo: {
      title: {
        type: String,
        required: [true, 'SEO title is required'],
      },
      description: {
        type: String,
        required: [true, 'SEO description is required'],
      },
      keywords: {
        type: [String],
        default: [],
      },
      ogImage: String,
    },
    bookingSettings: {
      slotDuration: {
        type: Number,
        default: 30,
        min: [15, 'Minimum slot duration is 15 minutes'],
      },
      advanceBookingDays: {
        type: Number,
        default: 30,
        min: [1, 'Minimum advance booking is 1 day'],
      },
      minBookingHours: {
        type: Number,
        default: 2,
        min: [0, 'Minimum booking hours cannot be negative'],
      },
      maxAppointmentsPerSlot: {
        type: Number,
        default: 1,
        min: [1, 'Maximum appointments per slot must be at least 1'],
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const Settings = mongoose.model<ISettings>('Settings', settingsSchema);
