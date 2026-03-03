import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import multipart from '@fastify/multipart';
import rateLimit from '@fastify/rate-limit';
import { Server } from 'socket.io';
import { config } from './config';
import { connectDatabase } from './config/database';
import { logger } from './config/logger';
import { publicRoutes } from './routes/publicRoutes';
import { adminRoutes } from './routes/adminRoutes';
import { setupWebSocket } from './websocket';
import { errorHandler } from './middleware/errorHandler';

const buildApp = async () => {
  const fastify = Fastify({
    logger: false,
    errorHandler: false,
  });

  // Register plugins
  await fastify.register(cors, {
    origin: config.cors.origin,
    credentials: true,
  });

  await fastify.register(helmet, {
    contentSecurityPolicy: false,
  });

  await fastify.register(jwt, {
    secret: config.jwt.secret,
    sign: {
      expiresIn: config.jwt.expiresIn,
    },
  });

  await fastify.register(multipart, {
    limits: {
      fileSize: config.upload.maxFileSize,
    },
  });

  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });

  // Register routes
  await fastify.register(publicRoutes, { prefix: '/api' });
  await fastify.register(adminRoutes, { prefix: '/api/admin' });

  // Health check
  fastify.get('/api/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  // 404 handler
  fastify.setNotFoundHandler((request, reply) => {
    reply.code(404).send({
      statusCode: 404,
      error: 'Not Found',
      message: 'Route not found',
    });
  });

  // Error handler
  fastify.setErrorHandler(errorHandler);

  return fastify;
};

const start = async () => {
  try {
    await connectDatabase();

    const fastify = await buildApp();

    // Start server first
    await fastify.listen({
      port: config.port,
      host: '0.0.0.0',
    });

    // Setup Socket.io on the same server using fastify.server
    const io = new Server(fastify.server, {
      cors: {
        origin: config.cors.origin,
        methods: ['GET', 'POST'],
      },
    });

    setupWebSocket(io);

    logger.info(`Server running at http://0.0.0.0:${config.port}`);
    logger.info(`WebSocket server running on same port`);
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();
