import { FastifyPluginAsync } from 'fastify';
import * as controller from '../controllers/admin';
import { authMiddleware } from '../middleware/auth';

export const adminRoutes: FastifyPluginAsync = async (fastify) => {
  // Auth routes (no auth required) - register BEFORE middleware hook
  fastify.post('/auth/login', {
    schema: {
      tags: ['Admin Auth'],
      summary: 'Admin login',
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string' },
          password: { type: 'string' },
        },
      },
    },
  }, controller.login);

  fastify.post('/auth/refresh', {
    schema: {
      tags: ['Admin Auth'],
      summary: 'Refresh token',
      body: {
        type: 'object',
        required: ['refreshToken'],
        properties: {
          refreshToken: { type: 'string' },
        },
      },
    },
  }, controller.refreshToken);

  // Protected routes - add middleware hook BEFORE registering protected routes
  fastify.addHook('preHandler', async (request, reply) => {
    await authMiddleware(request, reply);
  });

  // Auth (protected)
  fastify.get('/auth/me', controller.getMe);
  fastify.patch('/auth/profile', controller.updateProfile);
  fastify.post('/auth/change-password', controller.changePassword);

  // Dashboard
  fastify.get('/dashboard', controller.getDashboardStats);
  fastify.get('/dashboard/recent-appointments', controller.getRecentAppointments);

  // Services
  fastify.get('/services', controller.getAllServices);
  fastify.get('/services/:id', {
    schema: {
      tags: ['Admin Services'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
      },
    },
  }, controller.getServiceById);
  fastify.post('/services', controller.createService);
  fastify.patch('/services/:id', controller.updateService);
  fastify.delete('/services/:id', controller.deleteService);
  fastify.put('/services/order', controller.updateOrder);

  // Appointments
  fastify.get('/appointments', controller.getAllAppointments);
  fastify.get('/appointments/:id', {
    schema: {
      tags: ['Admin Appointments'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
      },
    },
  }, controller.getAppointmentById);
  fastify.patch('/appointments/:id/status', controller.updateStatus);
  fastify.patch('/appointments/:id/cancel', controller.cancelAppointment);

  // Doctors
  fastify.get('/doctors', controller.getAllDoctors);
  fastify.get('/doctors/:id', {
    schema: {
      tags: ['Admin Doctors'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
      },
    },
  }, controller.getDoctorById);
  fastify.post('/doctors', controller.createDoctor);
  fastify.patch('/doctors/:id', controller.updateDoctor);
  fastify.delete('/doctors/:id', controller.deleteDoctor);
  fastify.put('/doctors/order', controller.updateOrder);

  // Reviews
  fastify.get('/reviews', controller.getAllReviews);
  fastify.get('/reviews/:id', {
    schema: {
      tags: ['Admin Reviews'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
      },
    },
  }, controller.getReviewById);
  fastify.patch('/reviews/:id/approve', controller.approveReview);
  fastify.patch('/reviews/:id/reject', controller.rejectReview);
  fastify.patch('/reviews/:id', controller.updateReview);
  fastify.delete('/reviews/:id', controller.deleteReview);
  fastify.get('/reviews/statistics', controller.getReviewStatistics);

  // Blog
  fastify.get('/blog', controller.getAllBlogPosts);
  fastify.get('/blog/:id', {
    schema: {
      tags: ['Admin Blog'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
      },
    },
  }, controller.getBlogPostById);
  fastify.post('/blog', controller.createBlogPost);
  fastify.patch('/blog/:id', controller.updateBlogPost);
  fastify.delete('/blog/:id', controller.deleteBlogPost);
  fastify.patch('/blog/:id/publish', controller.publishBlogPost);
  fastify.patch('/blog/:id/unpublish', controller.unpublishBlogPost);

  // Settings
  fastify.get('/settings', controller.getSettings);
  fastify.patch('/settings', controller.updateSettings);
  fastify.patch('/settings/clinic-info', controller.updateClinicInfo);
  fastify.patch('/settings/working-hours', controller.updateWorkingHours);
  fastify.patch('/settings/social-links', controller.updateSocialLinks);
  fastify.patch('/settings/seo', controller.updateSeo);
  fastify.patch('/settings/booking', controller.updateBookingSettings);
};
