import { FastifyRequest, FastifyReply } from 'fastify';
import { appointmentService } from '../../services/AppointmentService';

/**
 * Get available dates for booking
 * GET /api/appointments/available-dates
 */
export const getAvailableDates = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { days } = request.query as { days?: string };
    const dates = await appointmentService.getAvailableDates(
      days ? parseInt(days, 10) : 30
    );
    return reply.send(dates);
  } catch (error) {
    throw error;
  }
};

/**
 * Get available time slots for a date
 * GET /api/appointments/available-slots
 */
export const getAvailableSlots = async (
  request: FastifyRequest<{ Querystring: { date: string; service?: string } }>,
  reply: FastifyReply
) => {
  try {
    const { date, service } = request.query;
    const slots = await appointmentService.getAvailableSlots(date, service);
    return reply.send(slots);
  } catch (error) {
    throw error;
  }
};

/**
 * Create new appointment
 * POST /api/appointments
 */
export const createAppointment = async (
  request: FastifyRequest<{
    Body: {
      patientName: string;
      patientPhone: string;
      patientEmail?: string;
      patientNotes?: string;
      service: string;
      doctor?: string;
      date: string;
      timeSlot: string;
    };
  }>,
  reply: FastifyReply
) => {
  try {
    const appointment = await appointmentService.create(request.body);

    // WebSocket event emission would go here in production
    // For now, appointment is created successfully

    return reply.code(201).send(appointment);
  } catch (error) {
    if ((error as Error).message === 'Selected time slot is no longer available') {
      return reply.code(409).send({
        statusCode: 409,
        error: 'Conflict',
        message: (error as Error).message,
      });
    }
    if ((error as Error).message === 'Service not found') {
      return reply.code(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: (error as Error).message,
      });
    }
    throw error;
  }
};

/**
 * Check if slot is available
 * GET /api/appointments/check-availability
 */
export const checkAvailability = async (
  request: FastifyRequest<{
    Querystring: { date: string; timeSlot: string };
  }>,
  reply: FastifyReply
) => {
  try {
    const { date, timeSlot } = request.query;
    const available = await appointmentService.isSlotAvailable(date, timeSlot);
    return reply.send({ date, timeSlot, available });
  } catch (error) {
    throw error;
  }
};
