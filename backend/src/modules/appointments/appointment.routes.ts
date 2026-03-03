import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { Types } from 'mongoose';
import { appointmentService } from './appointment.service';
import { authenticate } from '../../plugins/auth';

const CreateSchema = z.object({
  patientName: z.string().min(2).max(100),
  phone:       z.string().min(7).max(20),
  serviceId:   z.string().length(24),
  doctorId:    z.string().length(24).optional(),
  date:        z.string().datetime({ offset: true }),
  timeSlot:    z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  notes:       z.string().max(1000).optional(),
  source:      z.enum(['website', 'admin', 'phone']).default('website'),
});

const UpdateStatusSchema = z.object({
  status: z.enum(['new', 'confirmed', 'completed', 'cancelled']),
  notes:  z.string().max(1000).optional(),
});

export async function appointmentRoutes(fastify: FastifyInstance): Promise<void> {
  // ── Public: Get available slots ──────────────────────────
  fastify.get('/slots', async (req: FastifyRequest, reply: FastifyReply) => {
    const { date, doctorId } = req.query as { date?: string; doctorId?: string };
    if (!date) return reply.code(400).send({ error: '`date` query param required' });

    const slots = await appointmentService.getAvailableSlots(new Date(date), doctorId);
    return reply.send({ success: true, data: slots });
  });

  // ── Public: Create appointment ───────────────────────────
  fastify.post('/', async (req: FastifyRequest, reply: FastifyReply) => {
    const body = CreateSchema.safeParse(req.body);
    if (!body.success) return reply.code(400).send({ error: body.error.flatten() });

    try {
      const { serviceId, doctorId, date, ...rest } = body.data;
      const appointment = await appointmentService.create({
        ...rest,
        date: new Date(date),
        serviceId: new Types.ObjectId(serviceId),
        ...(doctorId ? { doctorId: new Types.ObjectId(doctorId) } : {}),
      });

      // Real-time notification to admin clients
      fastify.wsBroadcast('appointment:created', {
        id:          appointment._id,
        patientName: appointment.patientName,
        timeSlot:    appointment.timeSlot,
        date:        appointment.date,
      });

      return reply.code(201).send({ success: true, data: appointment });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create appointment';
      return reply.code(409).send({ error: message });
    }
  });

  // ── Admin: List appointments (protected) ─────────────────
  fastify.get('/', { preHandler: [authenticate] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const query = req.query as {
      status?: string;
      page?: string;
      limit?: string;
      search?: string;
    };

    const result = await appointmentService.list({
      status: query.status as any,
      page:   Number(query.page)  || 1,
      limit:  Number(query.limit) || 20,
      search: query.search,
    });
    return reply.send({ success: true, ...result });
  });

  // ── Admin: Get by ID (protected) ─────────────────────────
  fastify.get('/:id', { preHandler: [authenticate] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const appointment = await appointmentService.findById(id);
    if (!appointment) return reply.code(404).send({ error: 'Not found' });
    return reply.send({ success: true, data: appointment });
  });

  // ── Admin: Update status (protected) ────────────────────
  fastify.patch('/:id/status', { preHandler: [authenticate] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const body = UpdateStatusSchema.safeParse(req.body);
    if (!body.success) return reply.code(400).send({ error: body.error.flatten() });

    const updated = await appointmentService.updateStatus(id, body.data.status, body.data.notes);
    if (!updated) return reply.code(404).send({ error: 'Not found' });

    fastify.wsBroadcast('appointment:updated', {
      id:     updated._id,
      status: updated.status,
    });

    return reply.send({ success: true, data: updated });
  });

  // ── Admin: Dashboard stats (protected) ──────────────────
  fastify.get('/stats/summary', { preHandler: [authenticate] }, async (_req, reply) => {
    const stats = await appointmentService.getStats();
    return reply.send({ success: true, data: stats });
  });
}
