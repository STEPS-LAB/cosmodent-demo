import { Settings, ISettings } from '../models/Settings';
import { logger } from '../config/logger';

export class SettingsService {
  /**
   * Get settings (singleton pattern - only one settings document)
   */
  async getSettings(): Promise<ISettings | null> {
    try {
      let settings = await Settings.findOne().lean();
      
      // Create default settings if none exist
      if (!settings) {
        settings = await this.createDefaultSettings();
      }
      
      return settings;
    } catch (error) {
      logger.error(`Error retrieving settings: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Update settings
   */
  async updateSettings(data: Partial<ISettings>): Promise<ISettings> {
    try {
      let settings = await Settings.findOne();
      
      if (settings) {
        Object.assign(settings, data);
        await settings.save();
        logger.info('Updated settings');
        return settings;
      } else {
        // Create new settings if none exist
        settings = await Settings.create(data);
        logger.info('Created new settings');
        return settings;
      }
    } catch (error) {
      logger.error(`Error updating settings: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Create default settings
   */
  private async createDefaultSettings(): Promise<ISettings> {
    const defaultSettings: Partial<ISettings> = {
      clinicName: 'КОСМОДЕНТ',
      clinicDescription: 'Сучасна стоматологічна клініка з інноваційними технологіями лікування',
      phone: '+38 (067) 908 26 29',
      email: 'info@kosmodent.ua',
      address: {
        street: 'вулиця Східна, 107/86',
        city: 'Житомир',
        zipCode: '10001',
        country: 'Україна',
        coordinates: {
          lat: 50.2547,
          lng: 28.6587,
        },
      },
      workingHours: {
        monday: { open: '08:00', close: '19:00', isClosed: false },
        tuesday: { open: '08:00', close: '19:00', isClosed: false },
        wednesday: { open: '08:00', close: '19:00', isClosed: false },
        thursday: { open: '08:00', close: '19:00', isClosed: false },
        friday: { open: '08:00', close: '19:00', isClosed: false },
        saturday: { open: '08:00', close: '14:00', isClosed: false },
        sunday: { open: '08:00', close: '19:00', isClosed: true },
      },
      seo: {
        title: 'КОСМОДЕНТ - Сучасна Стоматологія у Житомирі',
        description: 'Професійні стоматологічні послуги. Імплантація, відбілювання, лікування зубів. Сучасне обладнання та досвідчені лікарі.',
        keywords: ['стоматологія', 'імплантація', 'лікування зубів', 'Житомир'],
      },
      bookingSettings: {
        slotDuration: 30,
        advanceBookingDays: 30,
        minBookingHours: 2,
        maxAppointmentsPerSlot: 1,
      },
    };
    
    const settings = await Settings.create(defaultSettings);
    logger.info('Created default settings');
    return settings;
  }

  /**
   * Update clinic info
   */
  async updateClinicInfo(data: {
    clinicName?: string;
    clinicDescription?: string;
    phone?: string;
    email?: string;
    address?: ISettings['address'];
  }): Promise<ISettings> {
    return this.updateSettings(data);
  }

  /**
   * Update working hours
   */
  async updateWorkingHours(
    workingHours: ISettings['workingHours']
  ): Promise<ISettings> {
    return this.updateSettings({ workingHours });
  }

  /**
   * Update social links
   */
  async updateSocialLinks(
    socialLinks: ISettings['socialLinks']
  ): Promise<ISettings> {
    return this.updateSettings({ socialLinks });
  }

  /**
   * Update SEO settings
   */
  async updateSeo(seo: ISettings['seo']): Promise<ISettings> {
    return this.updateSettings({ seo });
  }

  /**
   * Update booking settings
   */
  async updateBookingSettings(
    bookingSettings: ISettings['bookingSettings']
  ): Promise<ISettings> {
    return this.updateSettings({ bookingSettings });
  }

  /**
   * Get clinic contact info
   */
  async getContactInfo(): Promise<{
    clinicName: string;
    phone: string;
    email: string;
    address: ISettings['address'];
    workingHours: ISettings['workingHours'];
    socialLinks: ISettings['socialLinks'];
  }> {
    const settings = await this.getSettings();
    
    if (!settings) {
      throw new Error('Settings not found');
    }
    
    return {
      clinicName: settings.clinicName,
      phone: settings.phone,
      email: settings.email,
      address: settings.address,
      workingHours: settings.workingHours,
      socialLinks: settings.socialLinks,
    };
  }

  /**
   * Check if clinic is open at given time
   */
  async isClinicOpen(date: Date = new Date()): Promise<boolean> {
    const settings = await this.getSettings();
    
    if (!settings) {
      return false;
    }
    
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
    const dayName = days[date.getDay()];
    const dayHours = settings.workingHours[dayName];
    
    if (dayHours.isClosed) {
      return false;
    }
    
    const currentTime = date.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
    
    return currentTime >= dayHours.open && currentTime <= dayHours.close;
  }
}

export const settingsService = new SettingsService();
