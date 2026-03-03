import { Doctor, IDoctor } from '../models/Doctor';
import { Review } from '../models/Review';
import { logger } from '../config/logger';

interface DoctorFilter {
  isActive?: boolean;
  specialization?: string;
  search?: string;
}

interface DoctorSort {
  field?: string;
  order?: 'asc' | 'desc';
}

export class DoctorService {
  /**
   * Get all doctors with filtering and sorting
   */
  async getAll(filters: DoctorFilter = {}, sort: DoctorSort = {}): Promise<IDoctor[]> {
    const query: Record<string, unknown> = {};
    
    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }
    
    if (filters.specialization) {
      query.specialization = filters.specialization;
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
      const doctors = await Doctor.find(query).sort(sortOptions).lean();
      
      // Calculate ratings for each doctor
      const doctorsWithRatings = await Promise.all(
        doctors.map(async (doctor) => {
          const avgRating = await Review.calculateAverageRating('doctor', doctor._id);
          const reviewsCount = await Review.countDocuments({
            doctor: doctor._id,
            isActive: true,
          });
          
          return {
            ...doctor,
            rating: avgRating,
            reviewsCount,
          };
        })
      );
      
      logger.info(`Retrieved ${doctorsWithRatings.length} doctors`);
      return doctorsWithRatings;
    } catch (error) {
      logger.error(`Error retrieving doctors: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Get doctor by slug
   */
  async getBySlug(slug: string): Promise<IDoctor | null> {
    try {
      const doctor = await Doctor.findOne({ slug }).lean();
      if (!doctor) {
        logger.warn(`Doctor not found with slug: ${slug}`);
        return null;
      }
      
      // Calculate rating
      const avgRating = await Review.calculateAverageRating('doctor', doctor._id);
      const reviewsCount = await Review.countDocuments({
        doctor: doctor._id,
        isActive: true,
      });
      
      return {
        ...doctor,
        rating: avgRating,
        reviewsCount,
      } as IDoctor;
    } catch (error) {
      logger.error(`Error retrieving doctor by slug: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Get doctor by ID
   */
  async getById(id: string): Promise<IDoctor | null> {
    try {
      const doctor = await Doctor.findById(id).lean();
      if (!doctor) {
        logger.warn(`Doctor not found with id: ${id}`);
        return null;
      }
      
      // Calculate rating
      const avgRating = await Review.calculateAverageRating('doctor', doctor._id);
      const reviewsCount = await Review.countDocuments({
        doctor: doctor._id,
        isActive: true,
      });
      
      return {
        ...doctor,
        rating: avgRating,
        reviewsCount,
      } as IDoctor;
    } catch (error) {
      logger.error(`Error retrieving doctor by ID: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Create new doctor
   */
  async create(data: Partial<IDoctor>): Promise<IDoctor> {
    try {
      const doctor = new Doctor(data);
      await doctor.save();
      logger.info(`Created doctor: ${doctor.name}`);
      return doctor;
    } catch (error) {
      logger.error(`Error creating doctor: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Update doctor
   */
  async update(id: string, data: Partial<IDoctor>): Promise<IDoctor | null> {
    try {
      const doctor = await Doctor.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });
      
      if (doctor) {
        logger.info(`Updated doctor: ${doctor.name}`);
      }
      return doctor;
    } catch (error) {
      logger.error(`Error updating doctor: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Delete doctor
   */
  async delete(id: string): Promise<boolean> {
    try {
      const result = await Doctor.findByIdAndDelete(id);
      if (result) {
        logger.info(`Deleted doctor: ${result.name}`);
        return true;
      }
      return false;
    } catch (error) {
      logger.error(`Error deleting doctor: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Update doctors order
   */
  async updateOrder(ids: string[]): Promise<void> {
    try {
      const bulkOps = ids.map((id, index) => ({
        updateOne: {
          filter: { _id: id },
          update: { sortOrder: index },
        },
      }));
      
      await Doctor.bulkWrite(bulkOps);
      logger.info(`Updated order for ${ids.length} doctors`);
    } catch (error) {
      logger.error(`Error updating doctor order: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Get doctors by specialization
   */
  async getBySpecialization(specialization: string): Promise<IDoctor[]> {
    try {
      const doctors = await Doctor.find({
        specialization,
        isActive: true,
      })
        .sort({ sortOrder: 1 })
        .lean();
      
      logger.info(`Retrieved ${doctors.length} doctors for specialization: ${specialization}`);
      return doctors;
    } catch (error) {
      logger.error(`Error retrieving doctors by specialization: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Get all specializations
   */
  async getSpecializations(): Promise<string[]> {
    try {
      const specializations = await Doctor.distinct('specialization', {
        isActive: true,
      });
      
      return specializations.filter(Boolean);
    } catch (error) {
      logger.error(`Error retrieving specializations: ${(error as Error).message}`);
      throw error;
    }
  }
}

export const doctorService = new DoctorService();
