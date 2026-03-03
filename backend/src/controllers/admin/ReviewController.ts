import { FastifyRequest, FastifyReply } from 'fastify';
import { reviewService } from '../../services/ReviewService';
import { logger } from '../../config/logger';

/**
 * Get all reviews (admin)
 * GET /api/admin/reviews
 */
export const getAllReviews = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { isActive, service, doctor, rating } = request.query as Record<string, string>;
    
    const filters: Record<string, unknown> = {};
    if (isActive !== undefined) {
      filters.isActive = isActive === 'true';
    }
    if (service) {
      filters.service = service;
    }
    if (doctor) {
      filters.doctor = doctor;
    }
    if (rating) {
      filters.rating = parseInt(rating, 10);
    }
    
    const reviews = await reviewService.getAll(filters);
    return reply.send(reviews);
  } catch (error) {
    throw error;
  }
};

/**
 * Get review by ID (admin)
 * GET /api/admin/reviews/:id
 */
export const getReviewById = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params;
    const review = await reviewService.getById(id);
    
    if (!review) {
      return reply.code(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: 'Review not found',
      });
    }
    
    return reply.send(review);
  } catch (error) {
    throw error;
  }
};

/**
 * Approve review
 * PATCH /api/admin/reviews/:id/approve
 */
export const approveReview = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params;
    const review = await reviewService.approve(id);
    
    if (!review) {
      return reply.code(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: 'Review not found',
      });
    }
    
    return reply.send(review);
  } catch (error) {
    throw error;
  }
};

/**
 * Reject review
 * PATCH /api/admin/reviews/:id/reject
 */
export const rejectReview = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params;
    const review = await reviewService.reject(id);
    
    if (!review) {
      return reply.code(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: 'Review not found',
      });
    }
    
    return reply.send(review);
  } catch (error) {
    throw error;
  }
};

/**
 * Update review
 * PATCH /api/admin/reviews/:id
 */
export const updateReview = async (
  request: FastifyRequest<{
    Params: { id: string };
    Body: Record<string, unknown>;
  }>,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params;
    const review = await reviewService.update(id, request.body);
    
    if (!review) {
      return reply.code(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: 'Review not found',
      });
    }
    
    return reply.send(review);
  } catch (error) {
    throw error;
  }
};

/**
 * Delete review
 * DELETE /api/admin/reviews/:id
 */
export const deleteReview = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params;
    const deleted = await reviewService.delete(id);
    
    if (!deleted) {
      return reply.code(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: 'Review not found',
      });
    }
    
    return reply.send({ message: 'Review deleted successfully' });
  } catch (error) {
    throw error;
  }
};

/**
 * Get review statistics (admin)
 * GET /api/admin/reviews/statistics
 */
export const getStatistics = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const statistics = await reviewService.getStatistics();
    return reply.send(statistics);
  } catch (error) {
    logger.error('Error getting review statistics:', error);
    throw error;
  }
};

// Export alias for consistency
export { getStatistics as getReviewStatistics };
