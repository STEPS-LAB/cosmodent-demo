import { FastifyRequest, FastifyReply } from 'fastify';
import { serviceService } from '../../services/ServiceService';

/**
 * Get all services
 * GET /api/services
 */
export const getAllServices = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { isActive, category, search } = request.query as Record<string, string>;
    
    const filters: Record<string, unknown> = {};
    if (isActive !== undefined) {
      filters.isActive = isActive === 'true';
    }
    if (category) {
      filters.category = category;
    }
    if (search) {
      filters.search = search;
    }
    
    const services = await serviceService.getAll(filters);
    return reply.send(services);
  } catch (error) {
    throw error;
  }
};

/**
 * Get service by slug
 * GET /api/services/:slug
 */
export const getServiceBySlug = async (
  request: FastifyRequest<{ Params: { slug: string } }>,
  reply: FastifyReply
) => {
  try {
    const { slug } = request.params;
    const service = await serviceService.getBySlug(slug);
    
    if (!service) {
      return reply.code(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: 'Service not found',
      });
    }
    
    // Get AI optimization suggestions for admin users
    const suggestions = await serviceService.getOptimizationSuggestions(service);
    
    return reply.send({
      ...service,
      _meta: { suggestions },
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Get all categories
 * GET /api/services/categories
 */
export const getCategories = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const services = await serviceService.getAll({ isActive: true });
    const categories = [...new Set(services.map((s) => s.category).filter(Boolean))];
    return reply.send(categories);
  } catch (error) {
    throw error;
  }
};
