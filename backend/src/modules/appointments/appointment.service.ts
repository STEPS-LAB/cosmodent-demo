import { Types } from 'mongoose';
import { Appointment, IAppointment } from './appointment.model';
import { AppointmentStatus, PaginatedResult, TimeSlot } from '../../shared/types';
import { buildPaginatedResult, parsePagination } from '../../shared/utils/pagination';

// ── Business hours config ─────────────────────────────────
const WORKING_HOURS = { start: 9, end: 20 };
const SLOT_DURATION = 60; // minutes

export class AppointmentService {
  // ── Generate time slots for a given date ────────────────
  generateSlots(date: Date): string[] {
    const slots: string[] = [];
    for (let h = WORKING_HOURS.start; h < WORKING_HOURS.end; h += SLOT_DURATION / 60) {
      const hh = String(Math.floor(h)).padStart(2, '0');
      const mm = String((h % 1) * 60).padStart(2, '0');
      slots.push(`${hh}:${mm}`);
    }
    return slots;
  }

  // ── Get real-time availability for a date ───────────────
  async getAvailableSlots(date: Date, doctorId?: string): Promise<TimeSlot[]> {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    const query: Record<string, unknown> = {
      date: { $gte: dayStart, $lte: dayEnd },
      status: { $nin: ['cancelled'] },
    };
    if (doctorId) query['doctorId'] = new Types.ObjectId(doctorId);

    const booked = await Appointment.find(query).select('timeSlot').lean();
    const bookedSlots = new Set(booked.map((a) => a.timeSlot));

    return this.generateSlots(date).map((time) => ({
      time,
      available: !bookedSlots.has(time),
    }));
  }

  // ── Create appointment ───────────────────────────────────
  async create(data: Partial<IAppointment>): Promise<IAppointment> {
    // Verify slot is still available (race-condition guard)
    const dayStart = new Date(data.date!);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(data.date!);
    dayEnd.setHours(23, 59, 59, 999);

    const conflict = await Appointment.findOne({
      date:     { $gte: dayStart, $lte: dayEnd },
      timeSlot: data.timeSlot,
      doctorId: data.doctorId,
      status:   { $nin: ['cancelled'] },
    });

    if (conflict) {
      throw new Error('Цей час вже зайнятий. Оберіть інший слот.');
    }

    const appointment = new Appointment(data);
    return appointment.save();
  }

  // ── List with pagination and filters ────────────────────
  async list(
    query: {
      status?: AppointmentStatus;
      page?: number;
      limit?: number;
      sort?: string;
      order?: 'asc' | 'desc';
      search?: string;
    },
  ): Promise<PaginatedResult<IAppointment>> {
    const { page, limit, skip, sortField, sortOrder } = parsePagination(query);

    const filter: Record<string, unknown> = {};
    if (query.status) filter['status'] = query.status;
    if (query.search) {
      filter['$or'] = [
        { patientName: { $regex: query.search, $options: 'i' } },
        { phone:       { $regex: query.search, $options: 'i' } },
      ];
    }

    const [data, total] = await Promise.all([
      Appointment.find(filter)
        .populate('serviceId', 'name slug startingPrice')
        .populate('doctorId', 'name photo')
        .sort({ [sortField]: sortOrder as 1 | -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Appointment.countDocuments(filter),
    ]);

    return buildPaginatedResult(data as unknown as IAppointment[], total, page, limit);
  }

  // ── Find by ID ───────────────────────────────────────────
  async findById(id: string): Promise<IAppointment | null> {
    return Appointment.findById(id)
      .populate('serviceId', 'name slug startingPrice duration')
      .populate('doctorId', 'name photo specialization');
  }

  // ── Update status ────────────────────────────────────────
  async updateStatus(
    id: string,
    status: AppointmentStatus,
    notes?: string,
  ): Promise<IAppointment | null> {
    return Appointment.findByIdAndUpdate(
      id,
      { status, ...(notes !== undefined ? { notes } : {}) },
      { new: true, runValidators: true },
    );
  }

  // ── Dashboard stats ──────────────────────────────────────
  async getStats() {
    const [total, byStatus, todayCount, recentWeek] = await Promise.all([
      Appointment.countDocuments(),
      Appointment.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Appointment.countDocuments({
        date: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          $lte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      }),
      Appointment.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      }),
    ]);

    const statusMap = Object.fromEntries(
      byStatus.map((s: { _id: string; count: number }) => [s._id, s.count]),
    );

    return { total, today: todayCount, thisWeek: recentWeek, byStatus: statusMap };
  }
}

export const appointmentService = new AppointmentService();
