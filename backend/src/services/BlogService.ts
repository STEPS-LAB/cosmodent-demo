import { Blog, IBlog } from '../models/Blog';
import { logger } from '../config/logger';
import { Types } from 'mongoose';

interface BlogFilter {
  isActive?: boolean;
  isFeatured?: boolean;
  category?: string;
  tag?: string;
  search?: string;
  author?: string;
}

interface BlogSort {
  field?: string;
  order?: 'asc' | 'desc';
}

export class BlogService {
  /**
   * Get all blog posts with filtering and sorting
   */
  async getAll(filters: BlogFilter = {}, sort: BlogSort = {}): Promise<IBlog[]> {
    const query: Record<string, unknown> = {};
    
    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }
    
    if (filters.isFeatured !== undefined) {
      query.isFeatured = filters.isFeatured;
    }
    
    if (filters.category) {
      query.category = filters.category;
    }
    
    if (filters.tag) {
      query.tags = filters.tag;
    }
    
    if (filters.author) {
      query.author = new Types.ObjectId(filters.author);
    }
    
    if (filters.search) {
      query.$text = { $search: filters.search };
    }
    
    const sortOptions: Record<string, number> = {};
    if (sort.field) {
      sortOptions[sort.field] = sort.order === 'desc' ? -1 : 1;
    } else {
      sortOptions.publishedAt = -1;
    }
    
    try {
      const blogs = await Blog.find(query)
        .populate('author', 'name email')
        .sort(sortOptions)
        .lean();
      
      logger.info(`Retrieved ${blogs.length} blog posts`);
      return blogs;
    } catch (error) {
      logger.error(`Error retrieving blog posts: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Get blog post by slug
   */
  async getBySlug(slug: string): Promise<IBlog | null> {
    try {
      const blog = await Blog.findOne({ slug })
        .populate('author', 'name email')
        .lean();
      
      if (blog) {
        // Increment views
        await Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } });
        blog.views += 1;
      } else {
        logger.warn(`Blog post not found with slug: ${slug}`);
      }
      
      return blog;
    } catch (error) {
      logger.error(`Error retrieving blog post by slug: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Get blog post by ID
   */
  async getById(id: string): Promise<IBlog | null> {
    try {
      const blog = await Blog.findById(id)
        .populate('author', 'name email')
        .lean();
      
      if (!blog) {
        logger.warn(`Blog post not found with id: ${id}`);
      }
      return blog;
    } catch (error) {
      logger.error(`Error retrieving blog post by ID: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Create new blog post
   */
  async create(data: Partial<IBlog>): Promise<IBlog> {
    try {
      const blog = new Blog(data);
      await blog.save();
      logger.info(`Created blog post: ${blog.title}`);
      return blog.populate('author', 'name email');
    } catch (error) {
      logger.error(`Error creating blog post: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Update blog post
   */
  async update(id: string, data: Partial<IBlog>): Promise<IBlog | null> {
    try {
      const blog = await Blog.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      }).populate('author', 'name email');
      
      if (blog) {
        logger.info(`Updated blog post: ${blog.title}`);
      }
      return blog;
    } catch (error) {
      logger.error(`Error updating blog post: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Delete blog post
   */
  async delete(id: string): Promise<boolean> {
    try {
      const result = await Blog.findByIdAndDelete(id);
      if (result) {
        logger.info(`Deleted blog post: ${result.title}`);
        return true;
      }
      return false;
    } catch (error) {
      logger.error(`Error deleting blog post: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Publish blog post
   */
  async publish(id: string): Promise<IBlog | null> {
    try {
      const blog = await Blog.findByIdAndUpdate(
        id,
        { 
          isActive: true,
          publishedAt: new Date(),
        },
        { new: true }
      ).populate('author', 'name email');
      
      if (blog) {
        logger.info(`Published blog post: ${blog.title}`);
      }
      return blog;
    } catch (error) {
      logger.error(`Error publishing blog post: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Unpublish blog post
   */
  async unpublish(id: string): Promise<IBlog | null> {
    return this.update(id, { isActive: false });
  }

  /**
   * Get featured blog posts
   */
  async getFeatured(limit: number = 3): Promise<IBlog[]> {
    try {
      const blogs = await Blog.find({
        isActive: true,
        isFeatured: true,
      })
        .populate('author', 'name email')
        .sort({ publishedAt: -1 })
        .limit(limit)
        .lean();
      
      logger.info(`Retrieved ${blogs.length} featured blog posts`);
      return blogs;
    } catch (error) {
      logger.error(`Error retrieving featured blog posts: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Get recent blog posts
   */
  async getRecent(limit: number = 5): Promise<IBlog[]> {
    try {
      const blogs = await Blog.find({ isActive: true })
        .populate('author', 'name email')
        .sort({ publishedAt: -1 })
        .limit(limit)
        .lean();
      
      logger.info(`Retrieved ${blogs.length} recent blog posts`);
      return blogs;
    } catch (error) {
      logger.error(`Error retrieving recent blog posts: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Get all categories
   */
  async getCategories(): Promise<string[]> {
    try {
      const categories = await Blog.distinct('category', {
        isActive: true,
      });
      
      return categories.filter(Boolean);
    } catch (error) {
      logger.error(`Error retrieving categories: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Get all tags
   */
  async getTags(): Promise<string[]> {
    try {
      const blogs = await Blog.find({ isActive: true }).select('tags').lean();
      const allTags = blogs.flatMap((blog) => blog.tags);
      return [...new Set(allTags)].filter(Boolean);
    } catch (error) {
      logger.error(`Error retrieving tags: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Get AI content suggestions
   */
  async getContentSuggestions(blog: IBlog): Promise<{
    seoSuggestions?: string[];
    contentSuggestions?: string[];
  }> {
    const suggestions: {
      seoSuggestions?: string[];
      contentSuggestions?: string[];
    } = {};
    
    // SEO suggestions
    suggestions.seoSuggestions = [];
    if (!blog.seoTitle) {
      suggestions.seoSuggestions.push('Add SEO title for better search visibility');
    }
    if (!blog.seoDescription) {
      suggestions.seoSuggestions.push('Add SEO description for better search visibility');
    }
    if (blog.tags.length < 3) {
      suggestions.seoSuggestions.push('Add more tags (at least 3) for better categorization');
    }
    
    // Content suggestions
    suggestions.contentSuggestions = [];
    if (!blog.coverImage) {
      suggestions.contentSuggestions.push('Add a cover image for better visual appeal');
    }
    if (blog.content.length < 500) {
      suggestions.contentSuggestions.push('Expand content for better SEO (minimum 500 words recommended)');
    }
    if (!blog.excerpt) {
      suggestions.contentSuggestions.push('Add an excerpt for better preview in listings');
    }
    
    return suggestions;
  }
}

export const blogService = new BlogService();
