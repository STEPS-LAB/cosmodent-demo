import { FastifyRequest, FastifyReply } from 'fastify';
import { doctorService } from '../../services/DoctorService';

/**
 * Get all doctors
 * GET /api/doctors
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
 * Get doctor by slug
 * GET /api/doctors/:slug
 */
export const getDoctorBySlug = async (
  request: FastifyRequest<{ Params: { slug: string } }>,
  reply: FastifyReply
) => {
  try {
    const { slug } = request.params;
    const doctor = await doctorService.getBySlug(slug);
    
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
 * Get all specializations
 * GET /api/doctors/specializations
 */
export const getSpecializations = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const specializations = await doctorService.getSpecializations();
    return reply.send(specializations);
  } catch (error) {
    throw error;
  }
};
