import { BlogPost, IBlogPost } from './blog.model';
import { buildPaginatedResult, parsePagination } from '../../shared/utils/pagination';
import { PaginatedResult } from '../../shared/types';

export class BlogService {
  async list(query: {
    isPublished?: boolean;
    tag?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResult<IBlogPost>> {
    const { page, limit, skip } = parsePagination(query);
    const filter: Record<string, unknown> = {};
    if (query.isPublished !== undefined) filter['isPublished'] = query.isPublished;
    if (query.tag) filter['tags'] = query.tag;

    const [data, total] = await Promise.all([
      BlogPost.find(filter)
        .populate('authorId', 'name photo')
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      BlogPost.countDocuments(filter),
    ]);

    return buildPaginatedResult(data as IBlogPost[], total, page, limit);
  }

  async findBySlug(slug: string): Promise<IBlogPost | null> {
    const post = await BlogPost.findOneAndUpdate(
      { slug, isPublished: true },
      { $inc: { viewCount: 1 } },
      { new: true },
    ).populate('authorId', 'name photo bio');
    return post;
  }

  async findById(id: string): Promise<IBlogPost | null> {
    return BlogPost.findById(id).populate('authorId', 'name photo');
  }

  async create(data: Partial<IBlogPost>): Promise<IBlogPost> {
    if (data.isPublished && !data.publishedAt) {
      data.publishedAt = new Date();
    }
    const post = new BlogPost(data);
    return post.save();
  }

  async update(id: string, data: Partial<IBlogPost>): Promise<IBlogPost | null> {
    if (data.isPublished && !data.publishedAt) {
      data.publishedAt = new Date();
    }
    return BlogPost.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id: string): Promise<boolean> {
    const res = await BlogPost.findByIdAndDelete(id);
    return !!res;
  }
}

export const blogService = new BlogService();
