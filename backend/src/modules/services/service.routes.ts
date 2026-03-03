import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { serviceService } from './service.service';
import { authenticate } from '../../plugins/auth';

const ServiceBodySchema = z.object({
  name:             z.string().min(2).max(100),
  slug:             z.string().min(2).max(100).regex(/^[a-z0-9-]+$/),
  shortDescription: z.string().min(10).max(300),
  fullDescription:  z.string().min(20),
  startingPrice:    z.number().min(0),
  currency:         z.string().default('UAH'),
  duration:         z.number().min(15).default(60),
  category:         z.string().default('general'),
  isActive:         z.boolean().default(true),
  image:            z.string().optional(),
  seoTitle:         z.string().max(70),
  seoDescription:   z.string().max(160),
  seoKeywords:      z.array(z.string()).optional(),
});

export async function serviceRoutes(fastify: FastifyInstance): Promise<void> {
  // ── Public: list active services ─────────────────────────
  fastify.get('/public', async (_req, reply) => {
    const services = await serviceService.getPublicList();
    return reply.send({ success: true, data: services });
  });

  // ── Public: get service by slug ──────────────────────────
  fastify.get('/public/:slug', async (req: FastifyRequest, reply: FastifyReply) => {
    const { slug } = req.params as { slug: string };
    const service = await serviceService.findBySlug(slug);
    if (!service) return reply.code(404).send({ error: 'Послугу не знайдено' });
    return reply.send({ success: true, data: service });
  });

  // ── Admin: list all services ──────────────────────────────
  fastify.get('/', { preHandler: [authenticate] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const q = req.query as { isActive?: string; category?: string; page?: string; limit?: string };
    const result = await serviceService.list({
      isActive: q.isActive !== undefined ? q.isActive === 'true' : undefined,
      category: q.category,
      page:     Number(q.page)  || 1,
      limit:    Number(q.limit) || 20,
    });
    return reply.send({ success: true, ...result });
  });

  // ── Admin: create ────────────────────────────────────────
  fastify.post('/', { preHandler: [authenticate] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const body = ServiceBodySchema.safeParse(req.body);
    if (!body.success) return reply.code(400).send({ error: body.error.flatten() });
    const service = await serviceService.create(body.data);
    return reply.code(201).send({ success: true, data: service });
  });

  // ── Admin: update ────────────────────────────────────────
  fastify.put('/:id', { preHandler: [authenticate] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const body = ServiceBodySchema.partial().safeParse(req.body);
    if (!body.success) return reply.code(400).send({ error: body.error.flatten() });
    const service = await serviceService.update(id, body.data);
    if (!service) return reply.code(404).send({ error: 'Not found' });
    return reply.send({ success: true, data: service });
  });

  // ── Admin: delete ────────────────────────────────────────
  fastify.delete('/:id', { preHandler: [authenticate] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const deleted = await serviceService.delete(id);
    if (!deleted) return reply.code(404).send({ error: 'Not found' });
    return reply.send({ success: true, message: 'Послугу видалено' });
  });

  // ── Admin: drag-and-drop reorder ─────────────────────────
  fastify.post('/reorder', { preHandler: [authenticate] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const { ids } = req.body as { ids: string[] };
    if (!Array.isArray(ids)) return reply.code(400).send({ error: 'ids must be an array' });
    await serviceService.reorder(ids);
    return reply.send({ success: true, message: 'Порядок оновлено' });
  });
}
