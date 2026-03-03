import { FastifyRequest, FastifyReply } from 'fastify';
import { authService } from '../../services/AuthService';
import { config } from '../../config';

/**
 * Admin login
 * POST /api/admin/auth/login
 */
export const login = async (
  request: FastifyRequest<{
    Body: { email: string; password: string };
  }>,
  reply: FastifyReply
) => {
  try {
    const { email, password } = request.body;
    const result = await authService.login({ email, password });
    
    // Generate JWT tokens
    const accessToken = request.server.jwt.sign({
      id: result.admin._id,
      email: result.admin.email,
      role: result.admin.role,
      name: result.admin.name,
    }, { expiresIn: config.jwt.expiresIn });
    
    const refreshToken = request.server.jwt.sign({
      id: result.admin._id,
      type: 'refresh',
    }, { expiresIn: config.jwt.refreshExpiresIn });
    
    return reply.send({
      admin: result.admin,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    if ((error as Error).message.includes('Invalid') || 
        (error as Error).message.includes('deactivated')) {
      return reply.code(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        message: (error as Error).message,
      });
    }
    throw error;
  }
};

/**
 * Refresh token
 * POST /api/admin/auth/refresh
 */
export const refreshToken = async (
  request: FastifyRequest<{
    Body: { refreshToken: string };
  }>,
  reply: FastifyReply
) => {
  try {
    const { refreshToken } = request.body;
    
    const decoded = request.server.jwt.verify(refreshToken) as {
      id: string;
      type: string;
    };
    
    if (decoded.type !== 'refresh') {
      return reply.code(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid token type',
      });
    }
    
    const admin = await authService.getAdminById(decoded.id);
    
    if (!admin) {
      return reply.code(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Admin not found',
      });
    }
    
    const newAccessToken = request.server.jwt.sign({
      id: admin._id,
      email: admin.email,
      role: admin.role,
      name: admin.name,
    }, { expiresIn: config.jwt.expiresIn });
    
    return reply.send({
      accessToken: newAccessToken,
    });
  } catch (error) {
    return reply.code(401).send({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Invalid or expired refresh token',
    });
  }
};

/**
 * Get current admin profile
 * GET /api/admin/auth/me
 */
export const getMe = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    if (!request.user) {
      return reply.code(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Not authenticated',
      });
    }
    
    return reply.send(request.user);
  } catch (error) {
    throw error;
  }
};

/**
 * Update profile
 * PATCH /api/admin/auth/profile
 */
export const updateProfile = async (
  request: FastifyRequest<{
    Body: { name?: string; email?: string };
  }>,
  reply: FastifyReply
) => {
  try {
    if (!request.user) {
      return reply.code(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Not authenticated',
      });
    }
    
    const admin = await authService.updateProfile(request.user.id, request.body);
    return reply.send(admin);
  } catch (error) {
    throw error;
  }
};

/**
 * Change password
 * POST /api/admin/auth/change-password
 */
export const changePassword = async (
  request: FastifyRequest<{
    Body: { currentPassword: string; newPassword: string };
  }>,
  reply: FastifyReply
) => {
  try {
    if (!request.user) {
      return reply.code(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Not authenticated',
      });
    }
    
    const { currentPassword, newPassword } = request.body;
    await authService.changePassword(request.user.id, currentPassword, newPassword);
    
    return reply.send({ message: 'Password changed successfully' });
  } catch (error) {
    if ((error as Error).message.includes('incorrect')) {
      return reply.code(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: (error as Error).message,
      });
    }
    throw error;
  }
};
