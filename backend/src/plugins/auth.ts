import { FastifyRequest, FastifyReply } from 'fastify';

/**
 * JWT Authentication Hook
 *
 * Attach to any route or prefix to require valid admin JWT:
 *   { preHandler: [authenticate] }
 */
export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  try {
    await request.jwtVerify();
  } catch {
    reply.code(401).send({ error: 'Unauthorized — valid JWT required' });
  }
}
