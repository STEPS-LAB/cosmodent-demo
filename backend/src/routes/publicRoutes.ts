import { FastifyPluginAsync } from 'fastify';
import * as controller from '../controllers/public';

export const publicRoutes: FastifyPluginAsync = async (fastify) => {
  // Services
  fastify.get('/services', {
    schema: {
      tags: ['Public'],
      summary: 'Get all services',
      querystring: {
        type: 'object',
        properties: {
          isActive: { type: 'string' },
          category: { type: 'string' },
          search: { type: 'string' },
        },
      },
    },
  }, controller.getAllServices);

  fastify.get('/services/categories', controller.getCategories);

  fastify.get('/services/:slug', {
    schema: {
      tags: ['Public'],
      summary: 'Get service by slug',
      params: {
        type: 'object',
        properties: {
          slug: { type: 'string' },
        },
      },
    },
  }, controller.getServiceBySlug);

  // Appointments
  fastify.get('/appointments/available-dates', controller.getAvailableDates);

  fastify.get('/appointments/available-slots', controller.getAvailableSlots);

  fastify.get('/appointments/check-availability', controller.checkAvailability);

  fastify.post('/appointments', {
    schema: {
      tags: ['Public'],
      summary: 'Create appointment',
      body: {
        type: 'object',
        required: ['patientName', 'patientPhone', 'service', 'date', 'timeSlot'],
        properties: {
          patientName: { type: 'string' },
          patientPhone: { type: 'string' },
          patientEmail: { type: 'string' },
          patientNotes: { type: 'string' },
          service: { type: 'string' },
          doctor: { type: 'string' },
          date: { type: 'string' },
          timeSlot: { type: 'string' },
        },
      },
    },
  }, controller.createAppointment);

  // Doctors
  fastify.get('/doctors', {
    schema: {
      tags: ['Public'],
      summary: 'Get all doctors',
      querystring: {
        type: 'object',
        properties: {
          isActive: { type: 'string' },
          specialization: { type: 'string' },
          search: { type: 'string' },
        },
      },
    },
  }, controller.getAllDoctors);

  fastify.get('/doctors/specializations', controller.getSpecializations);

  fastify.get('/doctors/:slug', {
    schema: {
      tags: ['Public'],
      summary: 'Get doctor by slug',
      params: {
        type: 'object',
        properties: {
          slug: { type: 'string' },
        },
      },
    },
  }, controller.getDoctorBySlug);

  // Reviews
  fastify.get('/reviews', {
    schema: {
      tags: ['Public'],
      summary: 'Get all reviews',
      querystring: {
        type: 'object',
        properties: {
          isActive: { type: 'string' },
          service: { type: 'string' },
          doctor: { type: 'string' },
          rating: { type: 'string' },
        },
      },
    },
  }, controller.getAllReviews);

  fastify.get('/reviews/statistics', controller.getReviewStatistics);

  fastify.post('/reviews', {
    schema: {
      tags: ['Public'],
      summary: 'Create review',
      body: {
        type: 'object',
        required: ['patientName', 'rating', 'title', 'content'],
        properties: {
          patientName: { type: 'string' },
          patientPhone: { type: 'string' },
          service: { type: 'string' },
          doctor: { type: 'string' },
          rating: { type: 'number' },
          title: { type: 'string' },
          content: { type: 'string' },
        },
      },
    },
  }, controller.createReview);

  // Blog
  fastify.get('/blog', {
    schema: {
      tags: ['Public'],
      summary: 'Get all blog posts',
      querystring: {
        type: 'object',
        properties: {
          isActive: { type: 'string' },
          isFeatured: { type: 'string' },
          category: { type: 'string' },
          tag: { type: 'string' },
          search: { type: 'string' },
        },
      },
    },
  }, controller.getAllBlogPosts);

  fastify.get('/blog/featured', controller.getFeaturedPosts);
  fastify.get('/blog/recent', controller.getRecentPosts);
  fastify.get('/blog/categories', controller.getCategories);
  fastify.get('/blog/tags', controller.getTags);

  fastify.get('/blog/:slug', {
    schema: {
      tags: ['Public'],
      summary: 'Get blog post by slug',
      params: {
        type: 'object',
        properties: {
          slug: { type: 'string' },
        },
      },
    },
  }, controller.getBlogPostBySlug);

  // Settings
  fastify.get('/settings', controller.getSettings);
  fastify.get('/settings/contact', controller.getContactInfo);
  fastify.get('/settings/is-open', controller.checkIfOpen);
};
