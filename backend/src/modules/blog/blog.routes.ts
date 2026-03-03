import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { blogService } from './blog.service';
import { authenticate } from '../../plugins/auth';

const BlogBodySchema = z.object({
  title:          z.string().min(3).max(200),
  slug:           z.string().min(2).regex(/^[a-z0-9-]+$/),
  excerpt:        z.string().min(10).max(500),
  content:        z.string().min(50),
  coverImage:     z.string().optional(),
  authorId:       z.string().length(24),
  tags:           z.array(z.string()).default([]),
  isPublished:    z.boolean().default(false),
  seoTitle:       z.string().max(70),
  seoDescription: z.string().max(160),
});

export async function blogRoutes(fastify: FastifyInstance): Promise<void> {
  // ── Public ───────────────────────────────────────────────
  fastify.get('/public', async (req: FastifyRequest, reply: FastifyReply) => {
    const q = req.query as { tag?: string; page?: string; limit?: string };
    const result = await blogService.list({
      isPublished: true,
      tag:   q.tag,
      page:  Number(q.page)  || 1,
      limit: Number(q.limit) || 9,
    });
    return reply.send({ success: true, ...result });
  });

  fastify.get('/public/:slug', async (req: FastifyRequest, reply: FastifyReply) => {
    const { slug } = req.params as { slug: string };
    const post = await blogService.findBySlug(slug);
    if (!post) return reply.code(404).send({ error: 'Статтю не знайдено' });
    return reply.send({ success: true, data: post });
  });

  // ── Admin (protected) ────────────────────────────────────
  fastify.get('/', { preHandler: [authenticate] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const q = req.query as { isPublished?: string; page?: string; limit?: string };
    const result = await blogService.list({
      isPublished: q.isPublished !== undefined ? q.isPublished === 'true' : undefined,
      page:  Number(q.page)  || 1,
      limit: Number(q.limit) || 20,
    });
    return reply.send({ success: true, ...result });
  });

  fastify.post('/', { preHandler: [authenticate] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const body = BlogBodySchema.safeParse(req.body);
    if (!body.success) return reply.code(400).send({ error: body.error.flatten() });
    const post = await blogService.create(body.data as any);
    return reply.code(201).send({ success: true, data: post });
  });

  fastify.put('/:id', { preHandler: [authenticate] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const body = BlogBodySchema.partial().safeParse(req.body);
    if (!body.success) return reply.code(400).send({ error: body.error.flatten() });
    const post = await blogService.update(id, body.data as any);
    if (!post) return reply.code(404).send({ error: 'Not found' });
    return reply.send({ success: true, data: post });
  });

  fastify.delete('/:id', { preHandler: [authenticate] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const deleted = await blogService.delete(id);
    if (!deleted) return reply.code(404).send({ error: 'Not found' });
    return reply.send({ success: true, message: 'Статтю видалено' });
  });
}
