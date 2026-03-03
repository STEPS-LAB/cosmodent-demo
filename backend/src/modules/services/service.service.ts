import { Service, IService } from './service.model';
import { PaginatedResult } from '../../shared/types';
import { buildPaginatedResult, parsePagination } from '../../shared/utils/pagination';

export class ServiceService {
  async list(query: {
    isActive?: boolean;
    category?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResult<IService>> {
    const { page, limit, skip } = parsePagination(query);
    const filter: Record<string, unknown> = {};
    if (query.isActive !== undefined) filter['isActive'] = query.isActive;
    if (query.category) filter['category'] = query.category;

    const [data, total] = await Promise.all([
      Service.find(filter).sort({ order: 1, name: 1 }).skip(skip).limit(limit).lean(),
      Service.countDocuments(filter),
    ]);

    return buildPaginatedResult(data as unknown as IService[], total, page, limit);
  }

  async findBySlug(slug: string): Promise<IService | null> {
    return Service.findOne({ slug, isActive: true });
  }

  async findById(id: string): Promise<IService | null> {
    return Service.findById(id);
  }

  async create(data: Partial<IService>): Promise<IService> {
    const maxOrder = await Service.findOne().sort({ order: -1 }).select('order');
    const service = new Service({ ...data, order: (maxOrder?.order ?? -1) + 1 });
    return service.save();
  }

  async update(id: string, data: Partial<IService>): Promise<IService | null> {
    return Service.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id: string): Promise<boolean> {
    const res = await Service.findByIdAndDelete(id);
    return !!res;
  }

  // ── Drag-and-drop reorder ─────────────────────────────────
  async reorder(orderedIds: string[]): Promise<void> {
    const ops = orderedIds.map((id, index) => ({
      updateOne: { filter: { _id: id }, update: { $set: { order: index } } },
    }));
    await Service.bulkWrite(ops);
  }

  async getPublicList(): Promise<IService[]> {
    return Service.find({ isActive: true }).sort({ order: 1 }).lean() as unknown as Promise<IService[]>;
  }
}

export const serviceService = new ServiceService();
