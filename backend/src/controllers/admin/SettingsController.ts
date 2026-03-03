import { FastifyRequest, FastifyReply } from 'fastify';
import { settingsService } from '../../services/SettingsService';

/**
 * Get settings (admin)
 * GET /api/admin/settings
 */
export const getSettings = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const settings = await settingsService.getSettings();
    return reply.send(settings);
  } catch (error) {
    throw error;
  }
};

/**
 * Update settings
 * PATCH /api/admin/settings
 */
export const updateSettings = async (
  request: FastifyRequest<{ Body: Record<string, unknown> }>,
  reply: FastifyReply
) => {
  try {
    const settings = await settingsService.updateSettings(request.body);
    return reply.send(settings);
  } catch (error) {
    throw error;
  }
};

/**
 * Update clinic info
 * PATCH /api/admin/settings/clinic-info
 */
export const updateClinicInfo = async (
  request: FastifyRequest<{ Body: Record<string, unknown> }>,
  reply: FastifyReply
) => {
  try {
    const settings = await settingsService.updateClinicInfo(request.body);
    return reply.send(settings);
  } catch (error) {
    throw error;
  }
};

/**
 * Update working hours
 * PATCH /api/admin/settings/working-hours
 */
export const updateWorkingHours = async (
  request: FastifyRequest<{ Body: Record<string, unknown> }>,
  reply: FastifyReply
) => {
  try {
    const settings = await settingsService.updateWorkingHours(request.body);
    return reply.send(settings);
  } catch (error) {
    throw error;
  }
};

/**
 * Update social links
 * PATCH /api/admin/settings/social-links
 */
export const updateSocialLinks = async (
  request: FastifyRequest<{ Body: Record<string, unknown> }>,
  reply: FastifyReply
) => {
  try {
    const settings = await settingsService.updateSocialLinks(request.body);
    return reply.send(settings);
  } catch (error) {
    throw error;
  }
};

/**
 * Update SEO settings
 * PATCH /api/admin/settings/seo
 */
export const updateSeo = async (
  request: FastifyRequest<{ Body: Record<string, unknown> }>,
  reply: FastifyReply
) => {
  try {
    const settings = await settingsService.updateSeo(request.body);
    return reply.send(settings);
  } catch (error) {
    throw error;
  }
};

/**
 * Update booking settings
 * PATCH /api/admin/settings/booking
 */
export const updateBookingSettings = async (
  request: FastifyRequest<{ Body: Record<string, unknown> }>,
  reply: FastifyReply
) => {
  try {
    const settings = await settingsService.updateBookingSettings(request.body);
    return reply.send(settings);
  } catch (error) {
    throw error;
  }
};
