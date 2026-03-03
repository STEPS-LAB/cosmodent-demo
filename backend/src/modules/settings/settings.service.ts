import { Settings, ISettings } from './settings.model';

export class SettingsService {
  async get(): Promise<ISettings> {
    let settings = await Settings.findOne({ key: 'clinic' });
    if (!settings) {
      settings = await Settings.create({
        key: 'clinic',
        clinicName: 'Cosmodent',
        phone: '+38 (044) 123-45-67',
        email: 'info@cosmodent.ua',
        address: 'вул. Хрещатик, 1, Київ, 01001',
      });
    }
    return settings;
  }

  async update(data: Partial<ISettings>): Promise<ISettings> {
    const settings = await Settings.findOneAndUpdate(
      { key: 'clinic' },
      { $set: data },
      { new: true, upsert: true, runValidators: true },
    );
    return settings!;
  }
}

export const settingsService = new SettingsService();
