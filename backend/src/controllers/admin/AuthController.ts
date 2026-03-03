import { FastifyRequest, FastifyReply } from 'fastify';
import { authService } from '../../services/AuthService';
import { config } from '../../config';

// Custom JWT payload type
interface CustomJwtPayload {
  id: string;
  email: string;
  role: string;
  name: string;
  type?: string;
}

/**
 * Admin login
 * POST /api/admin/auth/login
 * 
 * Returns access token (short-lived) and refresh token (httpOnly cookie)
 */
export const login = async (
  request: FastifyRequest<{
    Body: { email: string; password: string };
  }>,
  reply: FastifyReply
) => {
  try {
    const { email, password } = request.body;

    // Validate admin credentials
    const result = await authService.login({ email, password });

    // Generate short-lived access token (15min by default)
    const accessToken = await reply.jwtSign(
      {
        id: result.admin._id,
        email: result.admin.email,
        role: result.admin.role,
        name: result.admin.name,
      },
      { expiresIn: config.jwt.expiresIn }
    );

    // Generate long-lived refresh token (30d by default)
    const refreshToken = await reply.jwtSign(
      {
        id: result.admin._id,
        type: 'refresh',
      },
      { expiresIn: config.jwt.refreshExpiresIn }
    );

    // Set refresh token as httpOnly cookie (secure, sameSite)
    reply.setCookie('refreshToken', refreshToken, {
      path: '/',
      httpOnly: true,
      secure: config.env === 'production', // HTTPS only in production
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
    });

    return reply.send({
      admin: {
        id: result.admin._id,
        email: result.admin.email,
        name: result.admin.name,
        role: result.admin.role,
      },
      accessToken,
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    
    if (errorMessage.includes('Invalid') || errorMessage.includes('deactivated')) {
      return reply.code(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        message: errorMessage,
      });
    }

    throw error;
  }
};

/**
 * Refresh access token
 * POST /api/admin/auth/refresh
 * 
 * Uses refresh token from httpOnly cookie to generate new access token
 */
export const refreshToken = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    // Get refresh token from cookie (preferred) or body (fallback)
    const cookies = request.cookies as { refreshToken?: string };
    const refreshToken = cookies?.refreshToken || 
                         (request.body as { refreshToken?: string })?.refreshToken;

    if (!refreshToken) {
      return reply.code(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Refresh token is required',
      });
    }

    // Verify refresh token
    const decoded = await reply.jwtVerify(refreshToken) as CustomJwtPayload;

    // Check token type
    if (decoded.type !== 'refresh') {
      return reply.code(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid token type',
      });
    }

    // Verify admin still exists
    const admin = await authService.getAdminById(decoded.id);

    if (!admin) {
      // Clear invalid cookie
      reply.clearCookie('refreshToken', { path: '/' });
      
      return reply.code(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Admin not found',
      });
    }

    // Generate new access token
    const newAccessToken = await reply.jwtSign(
      {
        id: admin._id,
        email: admin.email,
        role: admin.role,
        name: admin.name,
      },
      { expiresIn: config.jwt.expiresIn }
    );

    return reply.send({
      accessToken: newAccessToken,
    });
  } catch (error) {
    // Clear invalid cookie
    reply.clearCookie('refreshToken', { path: '/' });

    return reply.code(401).send({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Invalid or expired refresh token',
    });
  }
};

/**
 * Logout
 * POST /api/admin/auth/logout
 * 
 * Clears refresh token cookie
 */
export const logout = async (
  _request: FastifyRequest,
  reply: FastifyReply
) => {
  // Clear refresh token cookie
  reply.clearCookie('refreshToken', { path: '/' });

  return reply.send({
    message: 'Logged out successfully',
  });
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

    // Get fresh admin data from database
    const admin = await authService.getAdminById(request.user.id);

    if (!admin) {
      return reply.code(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: 'Admin not found',
      });
    }

    return reply.send({
      id: admin._id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });
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
