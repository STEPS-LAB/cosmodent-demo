/**
 * Unit tests — ServiceService
 */
import { ServiceService } from '../../src/modules/services/service.service';

jest.mock('../../src/modules/services/service.model', () => ({
  Service: {
    find:            jest.fn(),
    findOne:         jest.fn(),
    findById:        jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    countDocuments:  jest.fn(),
    bulkWrite:       jest.fn(),
    insertMany:      jest.fn(),
    prototype: { save: jest.fn() },
  },
}));

import { Service } from '../../src/modules/services/service.model';

const service = new ServiceService();

const mockService = {
  _id: '507f1f77bcf86cd799439011',
  name: 'Імплантологія',
  slug: 'implantology',
  startingPrice: 18000,
  isActive: true,
  order: 0,
};

describe('ServiceService', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('findBySlug()', () => {
    it('returns service for valid slug', async () => {
      (Service.findOne as jest.Mock).mockResolvedValue(mockService);
      const result = await service.findBySlug('implantology');
      expect(result).toEqual(mockService);
      expect(Service.findOne).toHaveBeenCalledWith({ slug: 'implantology', isActive: true });
    });

    it('returns null for unknown slug', async () => {
      (Service.findOne as jest.Mock).mockResolvedValue(null);
      const result = await service.findBySlug('unknown-service');
      expect(result).toBeNull();
    });
  });

  describe('delete()', () => {
    it('returns true when service is deleted', async () => {
      (Service.findByIdAndDelete as jest.Mock).mockResolvedValue(mockService);
      const result = await service.delete('507f1f77bcf86cd799439011');
      expect(result).toBe(true);
    });

    it('returns false when service not found', async () => {
      (Service.findByIdAndDelete as jest.Mock).mockResolvedValue(null);
      const result = await service.delete('nonexistent-id');
      expect(result).toBe(false);
    });
  });

  describe('reorder()', () => {
    it('calls bulkWrite with correct order updates', async () => {
      (Service.bulkWrite as jest.Mock).mockResolvedValue({ ok: 1 });
      const ids = ['id-1', 'id-2', 'id-3'];
      await service.reorder(ids);

      expect(Service.bulkWrite).toHaveBeenCalledWith([
        { updateOne: { filter: { _id: 'id-1' }, update: { $set: { order: 0 } } } },
        { updateOne: { filter: { _id: 'id-2' }, update: { $set: { order: 1 } } } },
        { updateOne: { filter: { _id: 'id-3' }, update: { $set: { order: 2 } } } },
      ]);
    });
  });
});
