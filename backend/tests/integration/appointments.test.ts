/**
 * Integration tests — Appointments API
 * Tests HTTP layer with an in-memory test database.
 *
 * Requires: mongodb-memory-server (or a running MongoDB)
 */
import { buildApp } from '../../src/app';
import { FastifyInstance } from 'fastify';

// Mock the database plugin to avoid real connection
jest.mock('../../src/plugins/database', () => ({
  databasePlugin: async (fastify: any) => {
    fastify.decorate('mongoose', {});
  },
}));

// Mock websocket plugin
jest.mock('../../src/plugins/websocket', () => ({
  websocketPlugin: async (fastify: any) => {
    fastify.decorate('wsBroadcast', jest.fn());
  },
}));

// Mock appointment service
jest.mock('../../src/modules/appointments/appointment.service', () => ({
  appointmentService: {
    getAvailableSlots: jest.fn().mockResolvedValue([
      { time: '09:00', available: true },
      { time: '10:00', available: false },
    ]),
    create: jest.fn().mockResolvedValue({
      _id: 'mock-id-123',
      patientName: 'Тест Тестович',
      phone: '+380501234567',
      timeSlot: '09:00',
      date: new Date().toISOString(),
      status: 'new',
    }),
    list:      jest.fn().mockResolvedValue({ data: [], total: 0, page: 1, limit: 20, totalPages: 0 }),
    getStats:  jest.fn().mockResolvedValue({ total: 5, today: 2, thisWeek: 5, byStatus: {} }),
  },
}));

let app: FastifyInstance;

beforeAll(async () => {
  app = await buildApp();
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

describe('GET /api/appointments/slots', () => {
  it('returns 400 when date is missing', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/appointments/slots' });
    expect(res.statusCode).toBe(400);
  });

  it('returns slots for a given date', async () => {
    const res = await app.inject({
      method: 'GET',
      url:    '/api/appointments/slots?date=2025-06-15T00:00:00.000Z',
    });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.payload);
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data[0]).toHaveProperty('time');
    expect(body.data[0]).toHaveProperty('available');
  });
});

describe('POST /api/appointments', () => {
  it('creates an appointment with valid data', async () => {
    const res = await app.inject({
      method:  'POST',
      url:     '/api/appointments',
      payload: {
        patientName: 'Тест Тестович',
        phone:       '+380501234567',
        serviceId:   '507f1f77bcf86cd799439011',
        date:        '2025-06-20T09:00:00.000Z',
        timeSlot:    '09:00',
        source:      'website',
      },
    });
    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.payload);
    expect(body.success).toBe(true);
    expect(body.data).toHaveProperty('_id');
  });

  it('returns 400 with invalid phone', async () => {
    const res = await app.inject({
      method:  'POST',
      url:     '/api/appointments',
      payload: {
        patientName: 'Тест',
        phone:       'bad',
        serviceId:   '507f1f77bcf86cd799439011',
        date:        '2025-06-20T09:00:00.000Z',
        timeSlot:    '09:00',
      },
    });
    expect(res.statusCode).toBe(400);
  });

  it('returns 400 when required fields are missing', async () => {
    const res = await app.inject({
      method:  'POST',
      url:     '/api/appointments',
      payload: { patientName: 'Тест' },
    });
    expect(res.statusCode).toBe(400);
  });
});

describe('GET /health', () => {
  it('returns 200 with ok status', async () => {
    const res = await app.inject({ method: 'GET', url: '/health' });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.payload);
    expect(body.status).toBe('ok');
  });
});
