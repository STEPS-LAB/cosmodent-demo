import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { reviewService } from './review.service';
import { authenticate } from '../../plugins/auth';

const ReviewBodySchema = z.object({
  patientName: z.string().min(2).max(100),
  rating:      z.number().int().min(1).max(5),
  text:        z.string().min(10).max(2000),
  serviceId:   z.string().length(24).optional(),
  doctorId:    z.string().length(24).optional(),
});

export async function reviewRoutes(fastify: FastifyInstance): Promise<void> {
  // ── Public: get approved highlighted reviews ──────────────
  fastify.get('/public', async (req: FastifyRequest, reply: FastifyReply) => {
    const { limit } = req.query as { limit?: string };
    const reviews = await reviewService.getHighlighted(Number(limit) || 6);
    return reply.send({ success: true, data: reviews });
  });

  // ── Public: submit review ─────────────────────────────────
  fastify.post('/', async (req: FastifyRequest, reply: FastifyReply) => {
    const body = ReviewBodySchema.safeParse(req.body);
    if (!body.success) return reply.code(400).send({ error: body.error.flatten() });
    const review = await reviewService.create({ ...body.data, isApproved: false });
    return reply.code(201).send({ success: true, data: review, message: 'Відгук надіслано на модерацію' });
  });

  // ── Admin: list (protected) ───────────────────────────────
  fastify.get('/', { preHandler: [authenticate] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const q = req.query as { isApproved?: string; doctorId?: string; page?: string; limit?: string };
    const result = await reviewService.list({
      isApproved: q.isApproved !== undefined ? q.isApproved === 'true' : undefined,
      doctorId:   q.doctorId,
      page:       Number(q.page)  || 1,
      limit:      Number(q.limit) || 20,
    });
    return reply.send({ success: true, ...result });
  });

  // ── Admin: approve ────────────────────────────────────────
  fastify.patch('/:id/approve', { preHandler: [authenticate] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const review = await reviewService.approve(id);
    if (!review) return reply.code(404).send({ error: 'Not found' });
    return reply.send({ success: true, data: review });
  });

  // ── Admin: toggle highlight ───────────────────────────────
  fastify.patch('/:id/highlight', { preHandler: [authenticate] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const review = await reviewService.toggleHighlight(id);
    if (!review) return reply.code(404).send({ error: 'Not found' });
    return reply.send({ success: true, data: review });
  });

  // ── Admin: delete ─────────────────────────────────────────
  fastify.delete('/:id', { preHandler: [authenticate] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const deleted = await reviewService.delete(id);
    if (!deleted) return reply.code(404).send({ error: 'Not found' });
    return reply.send({ success: true, message: 'Відгук видалено' });
  });
}
