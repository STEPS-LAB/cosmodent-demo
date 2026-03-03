/**
 * Unit tests — AppointmentService
 * Tests business logic in isolation (no DB connection).
 */
import { AppointmentService } from '../../src/modules/appointments/appointment.service';

// ── Mock Mongoose model ───────────────────────────────────
jest.mock('../../src/modules/appointments/appointment.model', () => ({
  Appointment: {
    find:              jest.fn(),
    findOne:           jest.fn(),
    findById:          jest.fn(),
    findByIdAndUpdate: jest.fn(),
    countDocuments:    jest.fn(),
    aggregate:         jest.fn(),
    prototype: {
      save: jest.fn(),
    },
  },
}));

import { Appointment } from '../../src/modules/appointments/appointment.model';

const service = new AppointmentService();

describe('AppointmentService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── generateSlots ─────────────────────────────────────────
  describe('generateSlots()', () => {
    it('generates slots from 09:00 to 19:00', () => {
      const slots = service.generateSlots(new Date());
      expect(slots).toContain('09:00');
      expect(slots).toContain('19:00');
      expect(slots).not.toContain('20:00');
      expect(slots.length).toBe(11);
    });

    it('generates slots in HH:MM format', () => {
      const slots = service.generateSlots(new Date());
      slots.forEach((s) => {
        expect(s).toMatch(/^([01]\d|2[0-3]):[0-5]\d$/);
      });
    });
  });

  // ── getAvailableSlots ─────────────────────────────────────
  describe('getAvailableSlots()', () => {
    it('marks booked slots as unavailable', async () => {
      (Appointment.find as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue([{ timeSlot: '10:00' }, { timeSlot: '11:00' }]),
        }),
      });

      const slots = await service.getAvailableSlots(new Date('2025-06-15'));

      const slot10 = slots.find((s) => s.time === '10:00');
      const slot11 = slots.find((s) => s.time === '11:00');
      const slot12 = slots.find((s) => s.time === '12:00');

      expect(slot10?.available).toBe(false);
      expect(slot11?.available).toBe(false);
      expect(slot12?.available).toBe(true);
    });

    it('returns all slots as available when nothing is booked', async () => {
      (Appointment.find as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue([]),
        }),
      });

      const slots = await service.getAvailableSlots(new Date('2025-06-15'));
      expect(slots.every((s) => s.available)).toBe(true);
    });
  });

  // ── create (conflict guard) ───────────────────────────────
  describe('create()', () => {
    it('throws when the time slot is already booked', async () => {
      (Appointment.findOne as jest.Mock).mockResolvedValue({ _id: 'existing-id' });

      await expect(
        service.create({
          patientName: 'Тест',
          phone: '+380501234567',
          date: new Date(),
          timeSlot: '10:00',
        }),
      ).rejects.toThrow('Цей час вже зайнятий');
    });
  });

  // ── getStats ──────────────────────────────────────────────
  describe('getStats()', () => {
    it('returns correct stat shape', async () => {
      (Appointment.countDocuments as jest.Mock).mockResolvedValue(42);
      (Appointment.aggregate as jest.Mock).mockResolvedValue([
        { _id: 'new',       count: 10 },
        { _id: 'confirmed', count: 20 },
        { _id: 'completed', count: 12 },
      ]);

      const stats = await service.getStats();

      expect(stats).toHaveProperty('total');
      expect(stats).toHaveProperty('today');
      expect(stats).toHaveProperty('thisWeek');
      expect(stats).toHaveProperty('byStatus');
      expect(stats.byStatus['new']).toBe(10);
    });
  });
});
