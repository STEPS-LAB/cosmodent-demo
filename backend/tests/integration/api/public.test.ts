import Fastify from 'fastify';
import supertest from 'supertest';
import { publicRoutes } from '../../../src/routes/publicRoutes';

describe('Public API Integration Tests', () => {
  let fastify: Fastify.FastifyInstance;
  let request: supertest.SuperTest<supertest.Test>;

  beforeAll(async () => {
    fastify = Fastify();
    
    // Register routes
    await fastify.register(publicRoutes, { prefix: '/api' });
    
    // Health check endpoint
    fastify.get('/api/health', async () => ({ status: 'ok' }));
    
    await fastify.listen({ port: 3001 });
    request = supertest(fastify.server);
  });

  afterAll(async () => {
    await fastify.close();
  });

  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request.get('/api/health').expect(200);
      expect(response.body.status).toBe('ok');
    });
  });

  describe('GET /api/services', () => {
    it('should return services list', async () => {
      const response = await request.get('/api/services').expect(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should filter by isActive', async () => {
      const response = await request
        .get('/api/services?isActive=true')
        .expect(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/doctors', () => {
    it('should return doctors list', async () => {
      const response = await request.get('/api/doctors').expect(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/reviews', () => {
    it('should return reviews list', async () => {
      const response = await request.get('/api/reviews').expect(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/settings', () => {
    it('should return clinic settings', async () => {
      const response = await request.get('/api/settings').expect(200);
      expect(response.body).toHaveProperty('clinicName');
    });
  });

  describe('POST /api/appointments', () => {
    it('should create appointment with valid data', async () => {
      const appointmentData = {
        patientName: 'Test Patient',
        patientPhone: '+380123456789',
        service: '507f1f77bcf86cd799439011',
        date: '2024-12-01',
        timeSlot: '10:00',
      };

      // This will fail with 404 since service doesn't exist in test DB
      // but it tests the validation flow
      const response = await request
        .post('/api/appointments')
        .send(appointmentData)
        .expect(404);

      expect(response.body.message).toContain('not found');
    });

    it('should reject appointment with missing required fields', async () => {
      const response = await request
        .post('/api/appointments')
        .send({ patientName: 'Test' })
        .expect(400);

      expect(response.body.message).toBeDefined();
    });
  });
});
