import { FastifyRequest, FastifyReply } from 'fastify';
import { ZodSchema, ZodError } from 'zod';

export const validateBody = (schema: ZodSchema) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      schema.parse(request.body);
    } catch (error) {
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
      throw error;
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      schema.parse(request.query);
    } catch (error) {
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
      throw error;
    }
  };
};

export const validateParams = (schema: ZodSchema) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      schema.parse(request.params);
    } catch (error) {
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
      throw error;
    }
  };
};
