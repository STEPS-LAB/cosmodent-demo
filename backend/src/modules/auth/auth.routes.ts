import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { authService } from './auth.service';
import { authenticate } from '../../plugins/auth';

const LoginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(6),
});

export async function authRoutes(fastify: FastifyInstance): Promise<void> {
  // POST /api/auth/login
  fastify.post('/login', async (req: FastifyRequest, reply: FastifyReply) => {
    const body = LoginSchema.safeParse(req.body);
    if (!body.success) return reply.code(400).send({ error: body.error.flatten() });

    try {
      const result = await authService.login(body.data.email, body.data.password, fastify);
      return reply.send({ success: true, ...result });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      return reply.code(401).send({ error: message });
    }
  });

  // GET /api/auth/me  (protected)
  fastify.get('/me', { preHandler: [authenticate] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const payload = req.user as { id: string };
    const admin = await authService.me(payload.id);
    if (!admin) return reply.code(404).send({ error: 'Not found' });
    return reply.send({ success: true, data: admin });
  });
}
