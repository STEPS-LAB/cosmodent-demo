import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import rateLimit from '@fastify/rate-limit';
import multipart from '@fastify/multipart';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import websocket from '@fastify/websocket';

import { databasePlugin } from './plugins/database';
import { websocketPlugin } from './plugins/websocket';
import { authRoutes } from './modules/auth/auth.routes';
import { appointmentRoutes } from './modules/appointments/appointment.routes';
import { serviceRoutes } from './modules/services/service.routes';
import { doctorRoutes } from './modules/doctors/doctor.routes';
import { reviewRoutes } from './modules/reviews/review.routes';
import { blogRoutes } from './modules/blog/blog.routes';
import { settingsRoutes } from './modules/settings/settings.routes';

const API_PREFIX = '/api';

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      level: process.env.LOG_LEVEL ?? 'info',
      transport:
        process.env.NODE_ENV !== 'production'
          ? { target: 'pino-pretty', options: { colorize: true } }
          : undefined,
    },
    trustProxy: true,
  });

  // ── Security ─────────────────────────────────────────────
  await app.register(helmet, { contentSecurityPolicy: false });
  await app.register(cors, {
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
    credentials: true,
  });
  await app.register(rateLimit, { max: 100, timeWindow: '1 minute' });

  // ── Auth ─────────────────────────────────────────────────
  await app.register(jwt, {
    secret: process.env.JWT_SECRET ?? 'fallback-secret-change-me',
    sign: { expiresIn: process.env.JWT_EXPIRES_IN ?? '7d' },
  });

  // ── Multipart (file uploads) ──────────────────────────────
  await app.register(multipart, {
    limits: { fileSize: (parseInt(process.env.MAX_FILE_SIZE_MB ?? '5')) * 1024 * 1024 },
  });

  // ── WebSocket ─────────────────────────────────────────────
  await app.register(websocket);

  // ── Swagger API Docs ──────────────────────────────────────
  await app.register(swagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'Cosmodent API',
        description: 'Dental Clinic Management System — REST API + WebSocket',
        version: '1.0.0',
      },
      components: {
        securitySchemes: {
          bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        },
      },
    },
  });

  await app.register(swaggerUi, {
    routePrefix: '/documentation',
    uiConfig: { docExpansion: 'list', deepLinking: false },
  });

  // ── Plugins ───────────────────────────────────────────────
  await app.register(databasePlugin);
  await app.register(websocketPlugin);

  // ── Routes ────────────────────────────────────────────────
  await app.register(authRoutes,        { prefix: `${API_PREFIX}/auth` });
  await app.register(appointmentRoutes, { prefix: `${API_PREFIX}/appointments` });
  await app.register(serviceRoutes,     { prefix: `${API_PREFIX}/services` });
  await app.register(doctorRoutes,      { prefix: `${API_PREFIX}/doctors` });
  await app.register(reviewRoutes,      { prefix: `${API_PREFIX}/reviews` });
  await app.register(blogRoutes,        { prefix: `${API_PREFIX}/blog` });
  await app.register(settingsRoutes,    { prefix: `${API_PREFIX}/settings` });

  // ── Health check ──────────────────────────────────────────
  app.get('/health', async () => ({
    status: 'ok',
    service: 'cosmodent-api',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  }));

  return app;
}
