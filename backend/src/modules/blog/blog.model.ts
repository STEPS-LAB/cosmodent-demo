import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  authorId: mongoose.Types.ObjectId;
  tags: string[];
  isPublished: boolean;
  publishedAt?: Date;
  seoTitle: string;
  seoDescription: string;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title:       { type: String, required: true, trim: true, maxlength: 200 },
    slug:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt:     { type: String, required: true, maxlength: 500 },
    content:     { type: String, required: true },
    coverImage:  { type: String },
    authorId:    { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
    tags:        [{ type: String, trim: true }],
    isPublished: { type: Boolean, default: false },
    publishedAt: { type: Date },
    seoTitle:    { type: String, required: true, maxlength: 70 },
    seoDescription: { type: String, required: true, maxlength: 160 },
    viewCount:   { type: Number, default: 0 },
  },
  { timestamps: true },
);

BlogPostSchema.index({ slug: 1 }, { unique: true });
BlogPostSchema.index({ isPublished: 1, publishedAt: -1 });
BlogPostSchema.index({ tags: 1, isPublished: 1 });

export const BlogPost: Model<IBlogPost> = mongoose.models.BlogPost
  ?? mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);
