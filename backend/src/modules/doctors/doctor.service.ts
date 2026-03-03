import { Doctor, IDoctor } from './doctor.model';
import { PaginatedResult } from '../../shared/types';
import { buildPaginatedResult, parsePagination } from '../../shared/utils/pagination';

export class DoctorService {
  async list(query: {
    isActive?: boolean;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResult<IDoctor>> {
    const { page, limit, skip } = parsePagination(query);
    const filter: Record<string, unknown> = {};
    if (query.isActive !== undefined) filter['isActive'] = query.isActive;

    const [data, total] = await Promise.all([
      Doctor.find(filter)
        .populate('services', 'name slug')
        .sort({ order: 1, name: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Doctor.countDocuments(filter),
    ]);

    return buildPaginatedResult(data as unknown as IDoctor[], total, page, limit);
  }

  async findBySlug(slug: string): Promise<IDoctor | null> {
    return Doctor.findOne({ slug, isActive: true }).populate('services', 'name slug');
  }

  async findById(id: string): Promise<IDoctor | null> {
    return Doctor.findById(id).populate('services', 'name slug');
  }

  async create(data: Partial<IDoctor>): Promise<IDoctor> {
    const maxOrder = await Doctor.findOne().sort({ order: -1 }).select('order');
    const doctor = new Doctor({ ...data, order: (maxOrder?.order ?? -1) + 1 });
    return doctor.save();
  }

  async update(id: string, data: Partial<IDoctor>): Promise<IDoctor | null> {
    return Doctor.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id: string): Promise<boolean> {
    const res = await Doctor.findByIdAndDelete(id);
    return !!res;
  }

  async getPublicList(): Promise<IDoctor[]> {
    return Doctor.find({ isActive: true })
      .populate('services', 'name slug')
      .sort({ order: 1 })
      .lean() as unknown as Promise<IDoctor[]>;
  }

  // Recalculate average rating after review added/removed
  async recalculateRating(doctorId: string, avgRating: number, count: number): Promise<void> {
    await Doctor.findByIdAndUpdate(doctorId, { rating: avgRating, reviewCount: count });
  }
}

export const doctorService = new DoctorService();
