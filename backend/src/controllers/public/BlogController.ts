import { FastifyRequest, FastifyReply } from 'fastify';
import { blogService } from '../../services/BlogService';

/**
 * Get all blog posts
 * GET /api/blog
 */
export const getAllBlogPosts = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { isActive, isFeatured, category, tag, search } = request.query as Record<string, string>;
    
    const filters: Record<string, unknown> = {};
    if (isActive !== undefined) {
      filters.isActive = isActive === 'true';
    }
    if (isFeatured !== undefined) {
      filters.isFeatured = isFeatured === 'true';
    }
    if (category) {
      filters.category = category;
    }
    if (tag) {
      filters.tag = tag;
    }
    if (search) {
      filters.search = search;
    }
    
    const posts = await blogService.getAll(filters);
    return reply.send(posts);
  } catch (error) {
    throw error;
  }
};

/**
 * Get blog post by slug
 * GET /api/blog/:slug
 */
export const getBlogPostBySlug = async (
  request: FastifyRequest<{ Params: { slug: string } }>,
  reply: FastifyReply
) => {
  try {
    const { slug } = request.params;
    const post = await blogService.getBySlug(slug);
    
    if (!post) {
      return reply.code(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: 'Blog post not found',
      });
    }
    
    return reply.send(post);
  } catch (error) {
    throw error;
  }
};

/**
 * Get featured blog posts
 * GET /api/blog/featured
 */
export const getFeaturedPosts = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { limit } = request.query as { limit?: string };
    const posts = await blogService.getFeatured(limit ? parseInt(limit, 10) : 3);
    return reply.send(posts);
  } catch (error) {
    throw error;
  }
};

/**
 * Get recent blog posts
 * GET /api/blog/recent
 */
export const getRecentPosts = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { limit } = request.query as { limit?: string };
    const posts = await blogService.getRecent(limit ? parseInt(limit, 10) : 5);
    return reply.send(posts);
  } catch (error) {
    throw error;
  }
};

/**
 * Get all categories
 * GET /api/blog/categories
 */
export const getCategories = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const categories = await blogService.getCategories();
    return reply.send(categories);
  } catch (error) {
    throw error;
  }
};

/**
 * Get all tags
 * GET /api/blog/tags
 */
export const getTags = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const tags = await blogService.getTags();
    return reply.send(tags);
  } catch (error) {
    throw error;
  }
};
