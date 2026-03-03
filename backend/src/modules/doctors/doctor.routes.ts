import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { doctorService } from './doctor.service';
import { authenticate } from '../../plugins/auth';

const DoctorBodySchema = z.object({
  name:           z.string().min(2).max(100),
  slug:           z.string().min(2).max(100).regex(/^[a-z0-9-]+$/),
  specialization: z.string().min(2),
  bio:            z.string().min(10),
  experience:     z.number().min(0),
  photo:          z.string().optional(),
  services:       z.array(z.string().length(24)).optional(),
  isActive:       z.boolean().default(true),
  socials:        z.object({ instagram: z.string().optional(), linkedin: z.string().optional() }).optional(),
});

export async function doctorRoutes(fastify: FastifyInstance): Promise<void> {
  // ── Public ───────────────────────────────────────────────
  fastify.get('/public', async (_req, reply) => {
    const doctors = await doctorService.getPublicList();
    return reply.send({ success: true, data: doctors });
  });

  fastify.get('/public/:slug', async (req: FastifyRequest, reply: FastifyReply) => {
    const { slug } = req.params as { slug: string };
    const doctor = await doctorService.findBySlug(slug);
    if (!doctor) return reply.code(404).send({ error: 'Лікаря не знайдено' });
    return reply.send({ success: true, data: doctor });
  });

  // ── Admin (protected) ────────────────────────────────────
  fastify.get('/', { preHandler: [authenticate] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const q = req.query as { isActive?: string; page?: string; limit?: string };
    const result = await doctorService.list({
      isActive: q.isActive !== undefined ? q.isActive === 'true' : undefined,
      page:     Number(q.page)  || 1,
      limit:    Number(q.limit) || 20,
    });
    return reply.send({ success: true, ...result });
  });

  fastify.post('/', { preHandler: [authenticate] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const body = DoctorBodySchema.safeParse(req.body);
    if (!body.success) return reply.code(400).send({ error: body.error.flatten() });
    const doctor = await doctorService.create(body.data as any);
    return reply.code(201).send({ success: true, data: doctor });
  });

  fastify.put('/:id', { preHandler: [authenticate] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const body = DoctorBodySchema.partial().safeParse(req.body);
    if (!body.success) return reply.code(400).send({ error: body.error.flatten() });
    const doctor = await doctorService.update(id, body.data as any);
    if (!doctor) return reply.code(404).send({ error: 'Not found' });
    return reply.send({ success: true, data: doctor });
  });

  fastify.delete('/:id', { preHandler: [authenticate] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const deleted = await doctorService.delete(id);
    if (!deleted) return reply.code(404).send({ error: 'Not found' });
    return reply.send({ success: true, message: 'Лікаря видалено' });
  });
}
