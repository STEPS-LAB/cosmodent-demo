import { Appointment, IAppointment, AppointmentStatus } from '../models/Appointment';
import { Service } from '../models/Service';
import { Settings } from '../models/Settings';
import { logger } from '../config/logger';
import { addHours, addDays, format, parse, isWeekend } from 'date-fns';
import { Types } from 'mongoose';

interface AvailabilitySlot {
  date: string;
  timeSlot: string;
  available: boolean;
  appointmentsCount: number;
}

interface AppointmentCreateData {
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  patientNotes?: string;
  service: string;
  doctor?: string;
  date: string;
  timeSlot: string;
}

export class AppointmentService {
  /**
   * Get available time slots for a given date
   */
  async getAvailableSlots(date: string, serviceId?: string): Promise<AvailabilitySlot[]> {
    try {
      const settings = await Settings.findOne();
      const slotDuration = settings?.bookingSettings.slotDuration || 30;
      const maxPerSlot = settings?.bookingSettings.maxAppointmentsPerSlot || 1;
      const workingHours = settings?.workingHours;
      
      const targetDate = new Date(date);
      const dayName = format(targetDate, 'EEEE').toLowerCase() as keyof typeof workingHours;
      const dayHours = workingHours?.[dayName];
      
      // Check if clinic is closed on this day
      if (dayHours?.isClosed) {
        return [];
      }
      
      // Generate all possible slots
      const slots: AvailabilitySlot[] = [];
      const openTime = parse(dayHours?.open || '09:00', 'HH:mm', targetDate);
      const closeTime = parse(dayHours?.close || '18:00', 'HH:mm', targetDate);
      
      let currentTime = openTime;
      while (currentTime < closeTime) {
        const timeSlot = format(currentTime, 'HH:mm');
        const nextSlot = addHours(currentTime, slotDuration / 60);
        
        if (nextSlot <= closeTime) {
          // Count existing appointments for this slot
          const appointmentsCount = await Appointment.countDocuments({
            date: targetDate,
            timeSlot,
            status: { $in: ['new', 'confirmed'] },
          });
          
          slots.push({
            date,
            timeSlot,
            available: appointmentsCount < maxPerSlot,
            appointmentsCount,
          });
        }
        
        currentTime = nextSlot;
      }
      
      logger.info(`Retrieved ${slots.length} availability slots for ${date}`);
      return slots;
    } catch (error) {
      logger.error(`Error getting available slots: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Get available dates for booking
   */
  async getAvailableDates(daysAhead: number = 30): Promise<string[]> {
    try {
      const settings = await Settings.findOne();
      const maxDays = settings?.bookingSettings.advanceBookingDays || daysAhead;
      const minHours = settings?.bookingSettings.minBookingHours || 2;
      const workingHours = settings?.workingHours;
      
      const dates: string[] = [];
      const today = new Date();
      const minBookingTime = addHours(today, minHours);
      
      for (let i = 0; i < maxDays; i++) {
        const date = addDays(today, i);
        const dateStr = format(date, 'yyyy-MM-dd');
        const dayName = format(date, 'EEEE').toLowerCase() as keyof typeof workingHours;
        const dayHours = workingHours?.[dayName];
        
        // Skip if clinic is closed
        if (dayHours?.isClosed) continue;
        
        // Skip dates before minimum booking time
        if (date < minBookingTime) continue;
        
        dates.push(dateStr);
      }
      
      return dates;
    } catch (error) {
      logger.error(`Error getting available dates: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Check if a specific slot is available
   */
  async isSlotAvailable(date: string, timeSlot: string): Promise<boolean> {
    try {
      const targetDate = new Date(date);
      const settings = await Settings.findOne();
      const maxPerSlot = settings?.bookingSettings.maxAppointmentsPerSlot || 1;
      
      const count = await Appointment.countDocuments({
        date: targetDate,
        timeSlot,
        status: { $in: ['new', 'confirmed'] },
      });
      
      return count < maxPerSlot;
    } catch (error) {
      logger.error(`Error checking slot availability: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Create new appointment
   */
  async create(data: AppointmentCreateData): Promise<IAppointment> {
    try {
      // Verify service exists
      const service = await Service.findById(data.service);
      if (!service) {
        throw new Error('Service not found');
      }
      
      // Check slot availability
      const isAvailable = await this.isSlotAvailable(data.date, data.timeSlot);
      if (!isAvailable) {
        throw new Error('Selected time slot is no longer available');
      }
      
      const appointment = new Appointment({
        ...data,
        date: new Date(data.date),
        status: 'new',
      });
      
      await appointment.save();
      logger.info(`Created appointment for ${appointment.patientName} on ${data.date} ${data.timeSlot}`);
      
      return appointment.populate('service doctor');
    } catch (error) {
      logger.error(`Error creating appointment: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Get appointment by ID
   */
  async getById(id: string): Promise<IAppointment | null> {
    try {
      const appointment = await Appointment.findById(id)
        .populate('service doctor')
        .lean();
      
      if (!appointment) {
        logger.warn(`Appointment not found with id: ${id}`);
      }
      return appointment;
    } catch (error) {
      logger.error(`Error retrieving appointment: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Get all appointments with filtering
   */
  async getAll(filters?: {
    status?: AppointmentStatus;
    dateFrom?: string;
    dateTo?: string;
    service?: string;
  }): Promise<IAppointment[]> {
    try {
      const query: Record<string, unknown> = {};
      
      if (filters?.status) {
        query.status = filters.status;
      }
      
      if (filters?.dateFrom || filters?.dateTo) {
        query.date = {};
        if (filters.dateFrom) {
          (query.date as Record<string, unknown>).$gte = new Date(filters.dateFrom);
        }
        if (filters.dateTo) {
          (query.date as Record<string, unknown>).$lte = new Date(filters.dateTo);
        }
      }
      
      if (filters?.service) {
        query.service = new Types.ObjectId(filters.service);
      }
      
      const appointments = await Appointment.find(query)
        .populate('service doctor')
        .sort({ date: 1, timeSlot: 1 })
        .lean();
      
      logger.info(`Retrieved ${appointments.length} appointments`);
      return appointments;
    } catch (error) {
      logger.error(`Error retrieving appointments: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Update appointment status
   */
  async updateStatus(
    id: string,
    status: AppointmentStatus,
    adminId?: string,
    reason?: string
  ): Promise<IAppointment | null> {
    try {
      const appointment = await Appointment.findById(id);
      if (!appointment) {
        throw new Error('Appointment not found');
      }
      
      await appointment.updateStatus(
        status,
        adminId ? new Types.ObjectId(adminId) : undefined,
        reason
      );
      
      logger.info(`Updated appointment ${id} status to ${status}`);
      return appointment.populate('service doctor');
    } catch (error) {
      logger.error(`Error updating appointment status: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Cancel appointment
   */
  async cancel(id: string, reason?: string): Promise<IAppointment | null> {
    return this.updateStatus(id, 'cancelled', undefined, reason);
  }

  /**
   * Get dashboard statistics
   */
  async getDashboardStats(): Promise<{
    totalAppointments: number;
    newAppointments: number;
    confirmedAppointments: number;
    completedAppointments: number;
    cancelledAppointments: number;
    todayAppointments: number;
    upcomingAppointments: number;
  }> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = addDays(today, 1);
      
      const [
        totalAppointments,
        newAppointments,
        confirmedAppointments,
        completedAppointments,
        cancelledAppointments,
        todayAppointments,
        upcomingAppointments,
      ] = await Promise.all([
        Appointment.countDocuments(),
        Appointment.countDocuments({ status: 'new' }),
        Appointment.countDocuments({ status: 'confirmed' }),
        Appointment.countDocuments({ status: 'completed' }),
        Appointment.countDocuments({ status: 'cancelled' }),
        Appointment.countDocuments({
          date: { $gte: today, $lt: tomorrow },
          status: { $in: ['new', 'confirmed'] },
        }),
        Appointment.countDocuments({
          date: { $gte: tomorrow },
          status: { $in: ['new', 'confirmed'] },
        }),
      ]);
      
      return {
        totalAppointments,
        newAppointments,
        confirmedAppointments,
        completedAppointments,
        cancelledAppointments,
        todayAppointments,
        upcomingAppointments,
      };
    } catch (error) {
      logger.error(`Error getting dashboard stats: ${(error as Error).message}`);
      throw error;
    }
  }
}

export const appointmentService = new AppointmentService();
