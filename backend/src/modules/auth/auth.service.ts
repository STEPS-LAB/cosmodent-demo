import { Admin, IAdmin } from './admin.model';
import { FastifyInstance } from 'fastify';

export class AuthService {
  async login(
    email: string,
    password: string,
    fastify: FastifyInstance,
  ): Promise<{ token: string; admin: Omit<IAdmin, 'password'> }> {
    const admin = await Admin.findOne({ email, isActive: true }).select('+password');
    if (!admin) throw new Error('Невірний email або пароль');

    const valid = await admin.comparePassword(password);
    if (!valid) throw new Error('Невірний email або пароль');

    // Update last login timestamp
    admin.lastLoginAt = new Date();
    await admin.save();

    const token = fastify.jwt.sign({
      id:    admin._id.toString(),
      email: admin.email,
      role:  admin.role,
    });

    const { password: _pw, ...adminData } = admin.toObject();
    return { token, admin: adminData as unknown as Omit<IAdmin, 'password'> };
  }

  async me(id: string): Promise<IAdmin | null> {
    return Admin.findById(id).select('-password');
  }

  async createAdmin(data: {
    email: string;
    password: string;
    name: string;
    role?: 'admin' | 'superadmin';
  }): Promise<IAdmin> {
    const exists = await Admin.findOne({ email: data.email });
    if (exists) throw new Error('Адміністратор з таким email вже існує');
    const admin = new Admin(data);
    return admin.save();
  }
}

export const authService = new AuthService();
