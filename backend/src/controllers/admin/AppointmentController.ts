import { FastifyRequest, FastifyReply } from 'fastify';
import { appointmentService } from '../../services/AppointmentService';
import { AppointmentStatus } from '../../models/Appointment';

/**
 * Get all appointments (admin)
 * GET /api/admin/appointments
 */
export const getAllAppointments = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { status, dateFrom, dateTo, service } = request.query as Record<string, string>;
    
    const filters: Record<string, unknown> = {};
    if (status) {
      filters.status = status as AppointmentStatus;
    }
    if (dateFrom) {
      filters.dateFrom = dateFrom;
    }
    if (dateTo) {
      filters.dateTo = dateTo;
    }
    if (service) {
      filters.service = service;
    }
    
    const appointments = await appointmentService.getAll(filters);
    return reply.send(appointments);
  } catch (error) {
    throw error;
  }
};

/**
 * Get appointment by ID (admin)
 * GET /api/admin/appointments/:id
 */
export const getAppointmentById = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params;
    const appointment = await appointmentService.getById(id);
    
    if (!appointment) {
      return reply.code(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: 'Appointment not found',
      });
    }
    
    return reply.send(appointment);
  } catch (error) {
    throw error;
  }
};

/**
 * Update appointment status
 * PATCH /api/admin/appointments/:id/status
 */
export const updateStatus = async (
  request: FastifyRequest<{
    Params: { id: string };
    Body: { status: AppointmentStatus; reason?: string };
  }>,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params;
    const { status, reason } = request.body;
    
    const adminId = request.user?.id;
    const appointment = await appointmentService.updateStatus(
      id,
      status,
      adminId,
      reason
    );
    
    if (!appointment) {
      return reply.code(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: 'Appointment not found',
      });
    }

    // WebSocket event would be emitted here in production

    return reply.send(appointment);
  } catch (error) {
    throw error;
  }
};

/**
 * Cancel appointment
 * PATCH /api/admin/appointments/:id/cancel
 */
export const cancelAppointment = async (
  request: FastifyRequest<{
    Params: { id: string };
    Body: { reason?: string };
  }>,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params;
    const { reason } = request.body;
    
    const appointment = await appointmentService.cancel(id, reason);
    
    if (!appointment) {
      return reply.code(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: 'Appointment not found',
      });
    }

    // WebSocket event would be emitted here in production

    return reply.send(appointment);
  } catch (error) {
    throw error;
  }
};
