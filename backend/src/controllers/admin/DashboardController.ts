import { FastifyRequest, FastifyReply } from 'fastify';
import { appointmentService } from '../../services/AppointmentService';
import { reviewService } from '../../services/ReviewService';
import { Service } from '../../models/Service';
import { Doctor } from '../../models/Doctor';

/**
 * Get dashboard statistics
 * GET /api/admin/dashboard
 */
export const getDashboardStats = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const [
      appointmentStats,
      reviewStats,
      servicesCount,
      doctorsCount,
    ] = await Promise.all([
      appointmentService.getDashboardStats(),
      reviewService.getStatistics(),
      Service.countDocuments(),
      Doctor.countDocuments(),
    ]);
    
    return reply.send({
      appointments: appointmentStats,
      reviews: reviewStats,
      services: servicesCount,
      doctors: doctorsCount,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Get recent appointments for dashboard
 * GET /api/admin/dashboard/recent-appointments
 */
export const getRecentAppointments = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const appointments = await appointmentService.getAll();
    const recentAppointments = appointments.slice(0, 10);
    return reply.send(recentAppointments);
  } catch (error) {
    throw error;
  }
};
