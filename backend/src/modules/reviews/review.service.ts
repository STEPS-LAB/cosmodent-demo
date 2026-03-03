import { Review, IReview } from './review.model';
import { doctorService } from '../doctors/doctor.service';
import { buildPaginatedResult, parsePagination } from '../../shared/utils/pagination';
import { PaginatedResult } from '../../shared/types';

export class ReviewService {
  async list(query: {
    isApproved?: boolean;
    doctorId?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResult<IReview>> {
    const { page, limit, skip } = parsePagination(query);
    const filter: Record<string, unknown> = {};
    if (query.isApproved !== undefined) filter['isApproved'] = query.isApproved;
    if (query.doctorId) filter['doctorId'] = query.doctorId;

    const [data, total] = await Promise.all([
      Review.find(filter)
        .populate('serviceId', 'name slug')
        .populate('doctorId', 'name photo')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Review.countDocuments(filter),
    ]);

    return buildPaginatedResult(data as unknown as IReview[], total, page, limit);
  }

  async create(data: Partial<IReview>): Promise<IReview> {
    const review = new Review(data);
    return review.save();
  }

  async approve(id: string): Promise<IReview | null> {
    const review = await Review.findByIdAndUpdate(
      id,
      { isApproved: true },
      { new: true },
    );
    // Recalculate doctor rating if linked
    if (review?.doctorId) {
      await this.recalculateDoctorRating(review.doctorId.toString());
    }
    return review;
  }

  async toggleHighlight(id: string): Promise<IReview | null> {
    const review = await Review.findById(id);
    if (!review) return null;
    review.isHighlighted = !review.isHighlighted;
    return review.save();
  }

  async delete(id: string): Promise<boolean> {
    const review = await Review.findByIdAndDelete(id);
    if (review?.doctorId) {
      await this.recalculateDoctorRating(review.doctorId.toString());
    }
    return !!review;
  }

  async getHighlighted(limit = 6): Promise<IReview[]> {
    return Review.find({ isApproved: true, isHighlighted: true })
      .populate('doctorId', 'name photo')
      .sort({ rating: -1, createdAt: -1 })
      .limit(limit)
      .lean() as unknown as Promise<IReview[]>;
  }

  private async recalculateDoctorRating(doctorId: string): Promise<void> {
    const result = await Review.aggregate([
      { $match: { doctorId: doctorId, isApproved: true } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    const avg   = result[0]?.avg ?? 0;
    const count = result[0]?.count ?? 0;
    await doctorService.recalculateRating(doctorId, Math.round(avg * 10) / 10, count);
  }
}

export const reviewService = new ReviewService();
