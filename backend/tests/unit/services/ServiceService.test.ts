import { ServiceService } from '../../src/services/ServiceService';
import { Service } from '../../src/models/Service';

// Mock the Service model
jest.mock('../../src/models/Service');

describe('ServiceService', () => {
  let serviceService: ServiceService;

  beforeEach(() => {
    serviceService = new ServiceService();
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all active services', async () => {
      const mockServices = [
        {
          _id: '1',
          name: 'Test Service',
          slug: 'test-service',
          isActive: true,
          startingPrice: 1000,
        },
      ];

      (Service.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockServices),
      });

      const result = await serviceService.getAll({ isActive: true });

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Test Service');
    });

    it('should filter by category', async () => {
      const mockServices = [
        {
          _id: '1',
          name: 'Implantology',
          category: 'Імплантація',
          isActive: true,
        },
      ];

      (Service.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockServices),
      });

      const result = await serviceService.getAll({
        isActive: true,
        category: 'Імплантація',
      });

      expect(result).toHaveLength(1);
      expect(result[0].category).toBe('Імплантація');
    });
  });

  describe('getBySlug', () => {
    it('should return service by slug', async () => {
      const mockService = {
        _id: '1',
        name: 'Test Service',
        slug: 'test-service',
        isActive: true,
      };

      (Service.findOne as jest.Mock).mockResolvedValue(mockService);

      const result = await serviceService.getBySlug('test-service');

      expect(result).toEqual(mockService);
      expect(Service.findOne).toHaveBeenCalledWith({ slug: 'test-service' });
    });

    it('should return null if service not found', async () => {
      (Service.findOne as jest.Mock).mockResolvedValue(null);

      const result = await serviceService.getBySlug('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new service', async () => {
      const mockService = {
        _id: '1',
        name: 'New Service',
        slug: 'new-service',
        save: jest.fn().mockResolvedValue(true),
      };

      (Service as jest.Mock).mockImplementation(() => mockService);

      const result = await serviceService.create({
        name: 'New Service',
        slug: 'new-service',
        startingPrice: 1000,
      });

      expect(result.name).toBe('New Service');
      expect(mockService.save).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update existing service', async () => {
      const mockService = {
        _id: '1',
        name: 'Updated Service',
        slug: 'test-service',
      };

      (Service.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockService);

      const result = await serviceService.update('1', {
        name: 'Updated Service',
      });

      expect(result).toEqual(mockService);
      expect(Service.findByIdAndUpdate).toHaveBeenCalledWith(
        '1',
        { name: 'Updated Service' },
        { new: true, runValidators: true }
      );
    });

    it('should return null if service not found', async () => {
      (Service.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

      const result = await serviceService.update('non-existent', {
        name: 'Updated',
      });

      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete service', async () => {
      (Service.findByIdAndDelete as jest.Mock).mockResolvedValue({
        _id: '1',
        name: 'Deleted Service',
      });

      const result = await serviceService.delete('1');

      expect(result).toBe(true);
    });

    it('should return false if service not found', async () => {
      (Service.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      const result = await serviceService.delete('non-existent');

      expect(result).toBe(false);
    });
  });
});
