import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ISettings extends Document {
  key: string;
  clinicName: string;
  phone: string;
  email: string;
  address: string;
  workingHours: {
    weekdays: string;
    saturday: string;
    sunday:   string;
  };
  socialLinks: {
    instagram?: string;
    facebook?:  string;
    telegram?:  string;
    youtube?:   string;
  };
  seo: {
    defaultTitle:       string;
    defaultDescription: string;
    defaultKeywords:    string[];
    googleAnalyticsId?: string;
  };
  heroHeading:    string;
  heroSubheading: string;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>(
  {
    key:        { type: String, required: true, unique: true, default: 'clinic' },
    clinicName: { type: String, required: true, default: 'Cosmodent' },
    phone:      { type: String, required: true },
    email:      { type: String, required: true },
    address:    { type: String, required: true },
    workingHours: {
      weekdays: { type: String, default: '09:00–20:00' },
      saturday: { type: String, default: '09:00–17:00' },
      sunday:   { type: String, default: 'Вихідний' },
    },
    socialLinks: {
      instagram: String,
      facebook:  String,
      telegram:  String,
      youtube:   String,
    },
    seo: {
      defaultTitle:       { type: String, default: 'Cosmodent — Стоматологічна клініка у Києві' },
      defaultDescription: { type: String, default: 'Сучасна стоматологічна клініка Cosmodent. Лікування, імплантація, ортодонтія.' },
      defaultKeywords:    [{ type: String }],
      googleAnalyticsId:  String,
    },
    heroHeading:    { type: String, default: 'Ваша усмішка — наша місія' },
    heroSubheading: { type: String, default: 'Сучасна стоматологія з турботою про кожного пацієнта' },
  },
  { timestamps: true },
);

SettingsSchema.index({ key: 1 }, { unique: true });

export const Settings: Model<ISettings> = mongoose.models.Settings
  ?? mongoose.model<ISettings>('Settings', SettingsSchema);
