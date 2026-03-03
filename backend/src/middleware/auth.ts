import { FastifyRequest, FastifyReply } from 'fastify';
import { JwtPayload } from '@fastify/jwt';

// Extend Fastify types
declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      id: string;
      email: string;
      role: string;
      name: string;
    };
  }
}

// Custom JWT payload type
interface CustomJwtPayload extends JwtPayload {
  id: string;
  email: string;
  role: string;
  name: string;
  type?: string;
}

/**
 * Authentication Middleware
 * 
 * Verifies JWT token from Authorization header
 * Expected format: Authorization: Bearer <token>
 */
export const authMiddleware = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.code(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Missing or invalid Authorization header. Expected: Bearer <token>',
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      return reply.code(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Token is required',
      });
    }

    // Verify token using fastify-jwt
    const payload = await request.jwtVerify();

    if (!payload) {
      return reply.code(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid or expired token',
      });
    }

    // Attach user to request
    const jwtPayload = payload as CustomJwtPayload;
    request.user = {
      id: jwtPayload.id,
      email: jwtPayload.email,
      role: jwtPayload.role,
      name: jwtPayload.name,
    };
  } catch (error) {
    // Token verification failed
    return reply.code(401).send({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Invalid or expired token',
    });
  }
};

/**
 * Role-based Authorization Middleware
 * 
 * Checks if authenticated user has required role(s)
 */
export const roleMiddleware = (roles: string[]) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.user) {
      return reply.code(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Authentication required',
      });
    }

    if (!roles.includes(request.user.role)) {
      return reply.code(403).send({
        statusCode: 403,
        error: 'Forbidden',
        message: 'Insufficient permissions',
      });
    }
  };
};

/**
 * Optional Auth Middleware
 * 
 * Attaches user to request if token is valid, but doesn't require authentication
 * Useful for endpoints that show different content for authenticated users
 */
export const optionalAuthMiddleware = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const authHeader = request.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return; // Continue without authentication
    }

    const token = authHeader.substring(7);
    const payload = await request.jwtVerify();

    if (payload) {
      const jwtPayload = payload as CustomJwtPayload;
      request.user = {
        id: jwtPayload.id,
        email: jwtPayload.email,
        role: jwtPayload.role,
        name: jwtPayload.name,
      };
    }
  } catch {
    // Ignore errors - authentication is optional
  }
};
