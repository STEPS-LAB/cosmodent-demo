import { Review, IReview } from '../models/Review';
import { logger } from '../config/logger';
import { Types } from 'mongoose';

interface ReviewFilter {
  isActive?: boolean;
  service?: string;
  doctor?: string;
  rating?: number;
}

interface ReviewSort {
  field?: string;
  order?: 'asc' | 'desc';
}

export class ReviewService {
  /**
   * Get all reviews with filtering and sorting
   */
  async getAll(filters: ReviewFilter = {}, sort: ReviewSort = {}): Promise<IReview[]> {
    const query: Record<string, unknown> = {};
    
    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }
    
    if (filters.service) {
      query.service = new Types.ObjectId(filters.service);
    }
    
    if (filters.doctor) {
      query.doctor = new Types.ObjectId(filters.doctor);
    }
    
    if (filters.rating) {
      query.rating = filters.rating;
    }
    
    const sortOptions: Record<string, number> = {};
    if (sort.field) {
      sortOptions[sort.field] = sort.order === 'desc' ? -1 : 1;
    } else {
      sortOptions.createdAt = -1;
    }
    
    try {
      const reviews = await Review.find(query)
        .populate('service doctor')
        .sort(sortOptions)
        .lean();
      
      logger.info(`Retrieved ${reviews.length} reviews`);
      return reviews;
    } catch (error) {
      logger.error(`Error retrieving reviews: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Get review by ID
   */
  async getById(id: string): Promise<IReview | null> {
    try {
      const review = await Review.findById(id)
        .populate('service doctor')
        .lean();
      
      if (!review) {
        logger.warn(`Review not found with id: ${id}`);
      }
      return review;
    } catch (error) {
      logger.error(`Error retrieving review: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Create new review
   */
  async create(data: Partial<IReview>): Promise<IReview> {
    try {
      const review = new Review(data);
      await review.save();
      logger.info(`Created review for patient: ${review.patientName}`);
      return review.populate('service doctor');
    } catch (error) {
      logger.error(`Error creating review: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Update review
   */
  async update(id: string, data: Partial<IReview>): Promise<IReview | null> {
    try {
      const review = await Review.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      }).populate('service doctor');
      
      if (review) {
        logger.info(`Updated review: ${review.title}`);
      }
      return review;
    } catch (error) {
      logger.error(`Error updating review: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Delete review
   */
  async delete(id: string): Promise<boolean> {
    try {
      const result = await Review.findByIdAndDelete(id);
      if (result) {
        logger.info(`Deleted review: ${result.title}`);
        return true;
      }
      return false;
    } catch (error) {
      logger.error(`Error deleting review: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Approve review (make active)
   */
  async approve(id: string): Promise<IReview | null> {
    return this.update(id, { isActive: true, isVerified: true });
  }

  /**
   * Reject review (make inactive)
   */
  async reject(id: string): Promise<IReview | null> {
    return this.update(id, { isActive: false });
  }

  /**
   * Get reviews statistics
   */
  async getStatistics(): Promise<{
    totalReviews: number;
    activeReviews: number;
    averageRating: number;
    ratingDistribution: { rating: number; count: number }[];
  }> {
    try {
      const totalReviews = await Review.countDocuments();
      const activeReviews = await Review.countDocuments({ isActive: true });
      
      const ratingStats = await Review.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: '$rating',
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);
      
      const averageResult = await Review.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: null,
            average: { $avg: '$rating' },
          },
        },
      ]);
      
      const averageRating = averageResult.length > 0 
        ? Math.round(averageResult[0].average * 10) / 10 
        : 0;
      
      const ratingDistribution = [1, 2, 3, 4, 5].map((rating) => ({
        rating,
        count: ratingStats.find((s) => s._id === rating)?.count || 0,
      }));
      
      return {
        totalReviews,
        activeReviews,
        averageRating,
        ratingDistribution,
      };
    } catch (error) {
      logger.error(`Error getting review statistics: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Get reviews for a specific doctor
   */
  async getByDoctor(doctorId: string, limit: number = 10): Promise<IReview[]> {
    try {
      const reviews = await Review.find({
        doctor: new Types.ObjectId(doctorId),
        isActive: true,
      })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('doctor')
        .lean();
      
      logger.info(`Retrieved ${reviews.length} reviews for doctor: ${doctorId}`);
      return reviews;
    } catch (error) {
      logger.error(`Error retrieving doctor reviews: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Get reviews for a specific service
   */
  async getByService(serviceId: string, limit: number = 10): Promise<IReview[]> {
    try {
      const reviews = await Review.find({
        service: new Types.ObjectId(serviceId),
        isActive: true,
      })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('service')
        .lean();
      
      logger.info(`Retrieved ${reviews.length} reviews for service: ${serviceId}`);
      return reviews;
    } catch (error) {
      logger.error(`Error retrieving service reviews: ${(error as Error).message}`);
      throw error;
    }
  }
}

export const reviewService = new ReviewService();
