import { FastifyRequest, FastifyReply } from 'fastify';
import { blogService } from '../../services/BlogService';

/**
 * Get all blog posts (admin)
 * GET /api/admin/blog
 */
export const getAllBlogPosts = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { isActive, isFeatured, category, author, search } = request.query as Record<string, string>;
    
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
    if (author) {
      filters.author = author;
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
 * Get blog post by ID (admin)
 * GET /api/admin/blog/:id
 */
export const getBlogPostById = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params;
    const post = await blogService.getById(id);
    
    if (!post) {
      return reply.code(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: 'Blog post not found',
      });
    }
    
    const suggestions = await blogService.getContentSuggestions(post);
    
    return reply.send({
      ...post,
      _meta: { suggestions },
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Create new blog post
 * POST /api/admin/blog
 */
export const createBlogPost = async (
  request: FastifyRequest<{ Body: Record<string, unknown> }>,
  reply: FastifyReply
) => {
  try {
    const authorId = request.user?.id;
    const blog = await blogService.create({
      ...request.body,
      author: authorId,
    });
    return reply.code(201).send(blog);
  } catch (error) {
    throw error;
  }
};

/**
 * Update blog post
 * PATCH /api/admin/blog/:id
 */
export const updateBlogPost = async (
  request: FastifyRequest<{
    Params: { id: string };
    Body: Record<string, unknown>;
  }>,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params;
    const post = await blogService.update(id, request.body);
    
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
 * Delete blog post
 * DELETE /api/admin/blog/:id
 */
export const deleteBlogPost = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params;
    const deleted = await blogService.delete(id);
    
    if (!deleted) {
      return reply.code(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: 'Blog post not found',
      });
    }
    
    return reply.send({ message: 'Blog post deleted successfully' });
  } catch (error) {
    throw error;
  }
};

/**
 * Publish blog post
 * PATCH /api/admin/blog/:id/publish
 */
export const publishBlogPost = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params;
    const post = await blogService.publish(id);
    
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
 * Unpublish blog post
 * PATCH /api/admin/blog/:id/unpublish
 */
export const unpublishBlogPost = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params;
    const post = await blogService.unpublish(id);
    
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
