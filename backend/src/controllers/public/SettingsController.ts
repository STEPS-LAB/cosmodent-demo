import { FastifyRequest, FastifyReply } from 'fastify';
import { settingsService } from '../../services/SettingsService';

/**
 * Get clinic settings
 * GET /api/settings
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
 * Get clinic contact info
 * GET /api/settings/contact
 */
export const getContactInfo = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const contactInfo = await settingsService.getContactInfo();
    return reply.send(contactInfo);
  } catch (error) {
    throw error;
  }
};

/**
 * Check if clinic is open
 * GET /api/settings/is-open
 */
export const checkIfOpen = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const isOpen = await settingsService.isClinicOpen();
    return reply.send({ isOpen });
  } catch (error) {
    throw error;
  }
};
