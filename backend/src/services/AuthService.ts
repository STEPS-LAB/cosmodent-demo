import { Admin, IAdmin } from '../models/Admin';
import { logger } from '../config/logger';
import { config } from '../config';

interface LoginData {
  email: string;
  password: string;
}

export class AuthService {
  /**
   * Authenticate admin user
   */
  async login(data: LoginData): Promise<{
    admin: Omit<IAdmin, 'password'>;
    accessToken: string;
    refreshToken: string;
  }> {
    try {
      // Шукаємо адміна по email або username
      const admin = await Admin.findOne({
        $or: [
          { email: data.email },
          { username: data.email },
        ],
      }).select('+password');

      if (!admin) {
        throw new Error('Invalid email or password');
      }

      if (!admin.isActive) {
        throw new Error('Account is deactivated');
      }

      const isPasswordValid = await admin.comparePassword(data.password);

      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      // Update last login
      admin.lastLogin = new Date();
      await admin.save();

      // Generate tokens (using fastify-jwt in controller)
      const adminData = admin.toObject();
      delete (adminData as { password?: string }).password;

      logger.info(`Admin logged in: ${admin.email}`);

      return {
        admin: adminData as Omit<IAdmin, 'password'>,
        accessToken: '', // Will be set in controller
        refreshToken: '', // Will be set in controller
      };
    } catch (error) {
      logger.error(`Login error: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Get admin by ID
   */
  async getAdminById(id: string): Promise<Omit<IAdmin, 'password'> | null> {
    try {
      const admin = await Admin.findById(id).select('-password').lean();
      return admin as Omit<IAdmin, 'password'> | null;
    } catch (error) {
      logger.error(`Error retrieving admin: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Create admin user (for seeding)
   */
  async createAdmin(data: {
    email: string;
    password: string;
    name: string;
    role?: 'super-admin' | 'admin' | 'manager';
  }): Promise<Omit<IAdmin, 'password'>> {
    try {
      const existingAdmin = await Admin.findOne({ email: data.email });
      
      if (existingAdmin) {
        throw new Error('Admin with this email already exists');
      }
      
      const admin = new Admin(data);
      await admin.save();
      
      const adminData = admin.toObject();
      delete (adminData as { password?: string }).password;
      
      logger.info(`Created admin: ${admin.email}`);
      return adminData as Omit<IAdmin, 'password'>;
    } catch (error) {
      logger.error(`Error creating admin: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Update admin profile
   */
  async updateProfile(
    id: string,
    data: { name?: string; email?: string }
  ): Promise<Omit<IAdmin, 'password'> | null> {
    try {
      const admin = await Admin.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      }).select('-password');
      
      if (admin) {
        logger.info(`Updated admin profile: ${admin.email}`);
      }
      return admin as Omit<IAdmin, 'password'> | null;
    } catch (error) {
      logger.error(`Error updating admin profile: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Change password
   */
  async changePassword(
    id: string,
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> {
    try {
      const admin = await Admin.findById(id).select('+password');
      
      if (!admin) {
        throw new Error('Admin not found');
      }
      
      const isPasswordValid = await admin.comparePassword(currentPassword);
      
      if (!isPasswordValid) {
        throw new Error('Current password is incorrect');
      }
      
      admin.password = newPassword;
      await admin.save();
      
      logger.info(`Password changed for admin: ${admin.email}`);
      return true;
    } catch (error) {
      logger.error(`Error changing password: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Deactivate admin
   */
  async deactivate(id: string): Promise<boolean> {
    try {
      const admin = await Admin.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
      );
      
      if (admin) {
        logger.info(`Deactivated admin: ${admin.email}`);
        return true;
      }
      return false;
    } catch (error) {
      logger.error(`Error deactivating admin: ${(error as Error).message}`);
      throw error;
    }
  }
}

export const authService = new AuthService();
