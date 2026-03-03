import { Service, IService } from '../models/Service';
import { logger } from '../config/logger';

interface ServiceFilter {
  isActive?: boolean;
  category?: string;
  search?: string;
}

interface ServiceSort {
  field?: string;
  order?: 'asc' | 'desc';
}

export class ServiceService {
  /**
   * Get all services with filtering and sorting
   */
  async getAll(filters: ServiceFilter = {}, sort: ServiceSort = {}): Promise<IService[]> {
    const query: Record<string, unknown> = {};
    
    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }
    
    if (filters.category) {
      query.category = filters.category;
    }
    
    if (filters.search) {
      query.$text = { $search: filters.search };
    }
    
    const sortOptions: Record<string, number> = {};
    if (sort.field) {
      sortOptions[sort.field] = sort.order === 'desc' ? -1 : 1;
    } else {
      sortOptions.sortOrder = 1;
    }
    
    try {
      const services = await Service.find(query).sort(sortOptions).lean();
      logger.info(`Retrieved ${services.length} services`);
      return services;
    } catch (error) {
      logger.error(`Error retrieving services: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Get service by slug
   */
  async getBySlug(slug: string): Promise<IService | null> {
    try {
      const service = await Service.findOne({ slug }).lean();
      if (!service) {
        logger.warn(`Service not found with slug: ${slug}`);
      }
      return service;
    } catch (error) {
      logger.error(`Error retrieving service by slug: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Get service by ID
   */
  async getById(id: string): Promise<IService | null> {
    try {
      const service = await Service.findById(id).lean();
      if (!service) {
        logger.warn(`Service not found with id: ${id}`);
      }
      return service;
    } catch (error) {
      logger.error(`Error retrieving service by ID: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Create new service
   */
  async create(data: Partial<IService>): Promise<IService> {
    try {
      const service = new Service(data);
      await service.save();
      logger.info(`Created service: ${service.name}`);
      return service;
    } catch (error) {
      logger.error(`Error creating service: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Update service
   */
  async update(id: string, data: Partial<IService>): Promise<IService | null> {
    try {
      const service = await Service.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });
      
      if (service) {
        logger.info(`Updated service: ${service.name}`);
      }
      return service;
    } catch (error) {
      logger.error(`Error updating service: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Delete service
   */
  async delete(id: string): Promise<boolean> {
    try {
      const result = await Service.findByIdAndDelete(id);
      if (result) {
        logger.info(`Deleted service: ${result.name}`);
        return true;
      }
      return false;
    } catch (error) {
      logger.error(`Error deleting service: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Update services order (for drag-and-drop)
   */
  async updateOrder(ids: string[]): Promise<void> {
    try {
      const bulkOps = ids.map((id, index) => ({
        updateOne: {
          filter: { _id: id },
          update: { sortOrder: index },
        },
      }));
      
      await Service.bulkWrite(bulkOps);
      logger.info(`Updated order for ${ids.length} services`);
    } catch (error) {
      logger.error(`Error updating service order: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Get AI suggestions for service optimization
   */
  async getOptimizationSuggestions(service: IService): Promise<{
    priceOptimization?: string;
    seoSuggestions?: string[];
    contentSuggestions?: string[];
  }> {
    const suggestions: {
      priceOptimization?: string;
      seoSuggestions?: string[];
      contentSuggestions?: string[];
    } = {};
    
    // Price optimization hint
    if (service.startingPrice < 500) {
      suggestions.priceOptimization = 'Consider reviewing pricing - below market average';
    } else if (service.startingPrice > 5000) {
      suggestions.priceOptimization = 'Premium pricing - ensure value proposition is clear';
    }
    
    // SEO suggestions
    suggestions.seoSuggestions = [];
    if (!service.seoTitle) {
      suggestions.seoSuggestions.push('Add SEO title for better search visibility');
    }
    if (!service.seoDescription) {
      suggestions.seoSuggestions.push('Add SEO description for better search visibility');
    }
    if (service.seoDescription && service.seoDescription.length < 100) {
      suggestions.seoSuggestions.push('Expand SEO description to 120-160 characters');
    }
    
    // Content suggestions
    suggestions.contentSuggestions = [];
    if (!service.fullDescription || service.fullDescription.length < 200) {
      suggestions.contentSuggestions.push('Expand service description for better user understanding');
    }
    if (!service.imageUrl) {
      suggestions.contentSuggestions.push('Add service image for better visual appeal');
    }
    if (!service.duration) {
      suggestions.contentSuggestions.push('Add estimated duration for patient planning');
    }
    
    return suggestions;
  }
}

export const serviceService = new ServiceService();
