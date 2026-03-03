import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { logger } from '../config/logger';
import { ZodError } from 'zod';
import { JsonWebTokenError, TokenExpiredError } from '@fastify/jwt';

export const errorHandler = (
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  logger.error(`Error: ${error.message}`, {
    stack: error.stack,
    url: request.url,
    method: request.method,
  });

  // Zod validation errors
  if (error instanceof ZodError) {
    return reply.code(400).send({
      statusCode: 400,
      error: 'Bad Request',
      message: error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  // JWT errors
  if (error instanceof TokenExpiredError) {
    return reply.code(401).send({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Token expired',
    });
  }

  if (error instanceof JsonWebTokenError) {
    return reply.code(401).send({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Invalid token',
    });
  }

  // Mongoose validation errors
  if ((error as any).name === 'ValidationError') {
    return reply.code(400).send({
      statusCode: 400,
      error: 'Bad Request',
      message: Object.values((error as any).errors || {})
        .map((e: any) => e.message)
        .join(', '),
    });
  }

  // Mongoose duplicate key error
  if ((error as any).code === 11000) {
    const field = Object.keys((error as any).keyPattern || {})[0];
    return reply.code(409).send({
      statusCode: 409,
      error: 'Conflict',
      message: `${field} already exists`,
    });
  }

  // Mongoose cast error (invalid ObjectId)
  if ((error as any).name === 'CastError') {
    return reply.code(400).send({
      statusCode: 400,
      error: 'Bad Request',
      message: `Invalid ${error.message.split('for').pop()?.trim() || 'ID'}`,
    });
  }

  // Default error response
  const statusCode = (error as any).statusCode || 500;
  const message = statusCode === 500 ? 'Internal Server Error' : error.message;

  reply.code(statusCode).send({
    statusCode,
    error: (error as any).name || 'Error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};
