import { FastifyRequest, FastifyReply } from 'fastify';
import { serviceService } from '../../services/ServiceService';

/**
 * Get all services (admin)
 * GET /api/admin/services
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
 * Get service by ID (admin)
 * GET /api/admin/services/:id
 */
export const getServiceById = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params;
    const service = await serviceService.getById(id);
    
    if (!service) {
      return reply.code(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: 'Service not found',
      });
    }
    
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
 * Create new service
 * POST /api/admin/services
 */
export const createService = async (
  request: FastifyRequest<{ Body: Record<string, unknown> }>,
  reply: FastifyReply
) => {
  try {
    const service = await serviceService.create(request.body);
    return reply.code(201).send(service);
  } catch (error) {
    throw error;
  }
};

/**
 * Update service
 * PATCH /api/admin/services/:id
 */
export const updateService = async (
  request: FastifyRequest<{
    Params: { id: string };
    Body: Record<string, unknown>;
  }>,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params;
    const service = await serviceService.update(id, request.body);
    
    if (!service) {
      return reply.code(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: 'Service not found',
      });
    }
    
    return reply.send(service);
  } catch (error) {
    throw error;
  }
};

/**
 * Delete service
 * DELETE /api/admin/services/:id
 */
export const deleteService = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params;
    const deleted = await serviceService.delete(id);
    
    if (!deleted) {
      return reply.code(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: 'Service not found',
      });
    }
    
    return reply.send({ message: 'Service deleted successfully' });
  } catch (error) {
    throw error;
  }
};

/**
 * Update services order
 * PUT /api/admin/services/order
 */
export const updateOrder = async (
  request: FastifyRequest<{ Body: { ids: string[] } }>,
  reply: FastifyReply
) => {
  try {
    const { ids } = request.body;
    await serviceService.updateOrder(ids);
    return reply.send({ message: 'Order updated successfully' });
  } catch (error) {
    throw error;
  }
};
