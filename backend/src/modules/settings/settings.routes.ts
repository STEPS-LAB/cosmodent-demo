import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { settingsService } from './settings.service';
import { authenticate } from '../../plugins/auth';

const SettingsUpdateSchema = z.object({
  clinicName:  z.string().optional(),
  phone:       z.string().optional(),
  email:       z.string().email().optional(),
  address:     z.string().optional(),
  workingHours: z.object({
    weekdays: z.string(),
    saturday: z.string(),
    sunday:   z.string(),
  }).optional(),
  socialLinks: z.object({
    instagram: z.string().optional(),
    facebook:  z.string().optional(),
    telegram:  z.string().optional(),
    youtube:   z.string().optional(),
  }).optional(),
  seo: z.object({
    defaultTitle:       z.string().max(70).optional(),
    defaultDescription: z.string().max(160).optional(),
    defaultKeywords:    z.array(z.string()).optional(),
    googleAnalyticsId:  z.string().optional(),
  }).optional(),
  heroHeading:    z.string().optional(),
  heroSubheading: z.string().optional(),
});

export async function settingsRoutes(fastify: FastifyInstance): Promise<void> {
  // ── Public: get clinic settings (for header/footer) ──────
  fastify.get('/public', async (_req, reply) => {
    const settings = await settingsService.get();
    // Return only public-safe fields
    const { clinicName, phone, email, address, workingHours, socialLinks, seo, heroHeading, heroSubheading } = settings;
    return reply.send({ success: true, data: { clinicName, phone, email, address, workingHours, socialLinks, seo, heroHeading, heroSubheading } });
  });

  // ── Admin: get full settings ──────────────────────────────
  fastify.get('/', { preHandler: [authenticate] }, async (_req, reply) => {
    const settings = await settingsService.get();
    return reply.send({ success: true, data: settings });
  });

  // ── Admin: update settings ────────────────────────────────
  fastify.put('/', { preHandler: [authenticate] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const body = SettingsUpdateSchema.safeParse(req.body);
    if (!body.success) return reply.code(400).send({ error: body.error.flatten() });
    const settings = await settingsService.update(body.data as any);
    return reply.send({ success: true, data: settings });
  });
}
