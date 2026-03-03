import { FastifyRequest, FastifyReply } from 'fastify';
import { reviewService } from '../../services/ReviewService';

/**
 * Get all reviews
 * GET /api/reviews
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
 * Get review statistics
 * GET /api/reviews/statistics
 */
export const getReviewStatistics = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const statistics = await reviewService.getStatistics();
    return reply.send(statistics);
  } catch (error) {
    throw error;
  }
};

/**
 * Create new review
 * POST /api/reviews
 */
export const createReview = async (
  request: FastifyRequest<{
    Body: {
      patientName: string;
      patientPhone?: string;
      service?: string;
      doctor?: string;
      rating: number;
      title: string;
      content: string;
    };
  }>,
  reply: FastifyReply
) => {
  try {
    const review = await reviewService.create({
      ...request.body,
      isActive: false, // Reviews need approval
    });
    return reply.code(201).send(review);
  } catch (error) {
    throw error;
  }
};
