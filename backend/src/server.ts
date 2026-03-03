import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import multipart from '@fastify/multipart';
import rateLimit from '@fastify/rate-limit';
import cookie from '@fastify/cookie';
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
  });

  // Register cookie parser (must be before CORS for credentials)
  await fastify.register(cookie, {
    secret: config.jwt.secret, // For signed cookies if needed
  });

  // Register CORS with proper configuration
  await fastify.register(cors, {
    origin: config.cors.origin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Set-Cookie'], // Allow frontend to read Set-Cookie header
  });

  // Security headers
  await fastify.register(helmet, {
    contentSecurityPolicy: false, // Disable for development, enable in production with proper config
    crossOriginEmbedderPolicy: false,
  });

  // JWT configuration
  await fastify.register(jwt, {
    secret: config.jwt.secret,
    sign: {
      expiresIn: config.jwt.expiresIn,
    },
  });

  // Multipart for file uploads
  await fastify.register(multipart, {
    limits: {
      fileSize: config.upload.maxFileSize,
    },
  });

  // Rate limiting
  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
    allowList: ['127.0.0.1', '::1'], // Whitelist localhost
  });

  // Register routes
  await fastify.register(publicRoutes, { prefix: '/api' });
  await fastify.register(adminRoutes, { prefix: '/api/admin' });

  // Health check
  fastify.get('/api/health', async () => {
    return { 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      env: config.env,
    };
  });

  // 404 handler
  fastify.setNotFoundHandler((request, reply) => {
    reply.code(404).send({
      statusCode: 404,
      error: 'Not Found',
      message: `Route ${request.method} ${request.url} not found`,
    });
  });

  // Global error handler
  fastify.setErrorHandler(errorHandler);

  return fastify;
};

const start = async () => {
  try {
    await connectDatabase();

    const fastify = await buildApp();

    // Start server
    await fastify.listen({
      port: config.port,
      host: '0.0.0.0',
    });

    // Setup Socket.io on the same server
    const io = new Server(fastify.server, {
      cors: {
        origin: config.cors.origin,
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    setupWebSocket(io);

    logger.info(`🚀 Server running at http://0.0.0.0:${config.port}`);
    logger.info(`🔌 WebSocket server running on same port`);
    logger.info(`📝 Environment: ${config.env}`);
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

start();
