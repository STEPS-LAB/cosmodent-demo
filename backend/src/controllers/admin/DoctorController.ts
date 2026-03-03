import { FastifyRequest, FastifyReply } from 'fastify';
import { doctorService } from '../../services/DoctorService';

/**
 * Get all doctors (admin)
 * GET /api/admin/doctors
 */
export const getAllDoctors = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { isActive, specialization, search } = request.query as Record<string, string>;
    
    const filters: Record<string, unknown> = {};
    if (isActive !== undefined) {
      filters.isActive = isActive === 'true';
    }
    if (specialization) {
      filters.specialization = specialization;
    }
    if (search) {
      filters.search = search;
    }
    
    const doctors = await doctorService.getAll(filters);
    return reply.send(doctors);
  } catch (error) {
    throw error;
  }
};

/**
 * Get doctor by ID (admin)
 * GET /api/admin/doctors/:id
 */
export const getDoctorById = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params;
    const doctor = await doctorService.getById(id);
    
    if (!doctor) {
      return reply.code(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: 'Doctor not found',
      });
    }
    
    return reply.send(doctor);
  } catch (error) {
    throw error;
  }
};

/**
 * Create new doctor
 * POST /api/admin/doctors
 */
export const createDoctor = async (
  request: FastifyRequest<{ Body: Record<string, unknown> }>,
  reply: FastifyReply
) => {
  try {
    const doctor = await doctorService.create(request.body);
    return reply.code(201).send(doctor);
  } catch (error) {
    throw error;
  }
};

/**
 * Update doctor
 * PATCH /api/admin/doctors/:id
 */
export const updateDoctor = async (
  request: FastifyRequest<{
    Params: { id: string };
    Body: Record<string, unknown>;
  }>,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params;
    const doctor = await doctorService.update(id, request.body);
    
    if (!doctor) {
      return reply.code(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: 'Doctor not found',
      });
    }
    
    return reply.send(doctor);
  } catch (error) {
    throw error;
  }
};

/**
 * Delete doctor
 * DELETE /api/admin/doctors/:id
 */
export const deleteDoctor = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params;
    const deleted = await doctorService.delete(id);
    
    if (!deleted) {
      return reply.code(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: 'Doctor not found',
      });
    }
    
    return reply.send({ message: 'Doctor deleted successfully' });
  } catch (error) {
    throw error;
  }
};

/**
 * Update doctors order
 * PUT /api/admin/doctors/order
 */
export const updateOrder = async (
  request: FastifyRequest<{ Body: { ids: string[] } }>,
  reply: FastifyReply
) => {
  try {
    const { ids } = request.body;
    await doctorService.updateOrder(ids);
    return reply.send({ message: 'Order updated successfully' });
  } catch (error) {
    throw error;
  }
};
