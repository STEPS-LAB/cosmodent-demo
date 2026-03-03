import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAdmin extends Document {
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'superadmin';
  isActive: boolean;
  lastLoginAt?: Date;
  comparePassword(candidate: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    email:       { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:    { type: String, required: true, minlength: 8, select: false },
    name:        { type: String, required: true, trim: true },
    role:        { type: String, enum: ['admin', 'superadmin'], default: 'admin' },
    isActive:    { type: Boolean, default: true },
    lastLoginAt: { type: Date },
  },
  { timestamps: true },
);

// ── Hash password before save ─────────────────────────────
AdminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── Instance method: compare passwords ────────────────────
AdminSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

AdminSchema.index({ email: 1 }, { unique: true });

export const Admin: Model<IAdmin> = mongoose.models.Admin
  ?? mongoose.model<IAdmin>('Admin', AdminSchema);
