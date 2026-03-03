'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminStore } from '@/stores/adminStore';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { api } from '@/services/api';

interface Settings {
  clinicName: string;
  phone: string;
  email: string;
  address: string;
  workingHours?: { day: string; hours: string }[];
  socialLinks?: { facebook?: string; instagram?: string; twitter?: string };
}

export function AdminSettingsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAdminStore();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin/login');
      return;
    }
    loadSettings();
  }, [isAuthenticated, router]);

  const loadSettings = () => {
    api.getAdminSettings().then((data) => {
      setSettings(data);
      setLoading(false);
    }).catch(() => {
      // Якщо немає налаштувань, використовуємо значення за замовчуванням
      setSettings({
        clinicName: 'КОСМОДЕНТ',
        phone: '+380 (44) 123-45-67',
        email: 'info@kosmodent.ua',
        address: 'вул. Хрещатик, 1, Київ, 01001',
        workingHours: [
          { day: 'Пн - Пт', hours: '09:00 - 18:00' },
          { day: 'Сб', hours: '10:00 - 15:00' },
          { day: 'Нд', hours: 'Вихідний' },
        ],
        socialLinks: {},
      });
      setLoading(false);
    });
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      await api.updateSettings(settings);
      alert('Налаштування збережено');
    } catch (_error) {
      alert('Помилка збереження');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key: keyof Settings, value: any) => {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
  };

  if (!isAuthenticated) return null;

  return (
    <AdminLayout>
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-secondary-900">Налаштування</h1>
          <p className="text-secondary-600 mt-1">Налаштування клініки</p>
        </div>

        {loading ? (
          <div className="card p-6">Завантаження...</div>
        ) : settings ? (
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="text-lg font-semibold mb-4">Основна інформація</h2>
              <div className="space-y-4">
                <div>
                  <label className="label-field">Назва клініки</label>
                  <input
                    type="text"
                    value={settings.clinicName}
                    onChange={(e) => handleChange('clinicName', e.target.value)}
                    className="input-field"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label-field">Телефон</label>
                    <input
                      type="text"
                      value={settings.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="label-field">Email</label>
                    <input
                      type="email"
                      value={settings.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="input-field"
                    />
                  </div>
                </div>
                <div>
                  <label className="label-field">Адреса</label>
                  <input
                    type="text"
                    value={settings.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h2 className="text-lg font-semibold mb-4">Графік роботи</h2>
              <div className="space-y-3">
                {settings.workingHours?.map((wh, index) => (
                  <div key={index} className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={wh.day}
                      onChange={(e) => {
                        const newHours = [...(settings.workingHours || [])];
                        newHours[index] = { ...wh, day: e.target.value };
                        handleChange('workingHours', newHours);
                      }}
                      className="input-field"
                    />
                    <input
                      type="text"
                      value={wh.hours}
                      onChange={(e) => {
                        const newHours = [...(settings.workingHours || [])];
                        newHours[index] = { ...wh, hours: e.target.value };
                        handleChange('workingHours', newHours);
                      }}
                      className="input-field"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button onClick={handleSave} disabled={saving} className="btn-primary">
                {saving ? 'Збереження...' : 'Зберегти налаштування'}
              </button>
            </div>
          </div>
        ) : (
          <div className="card p-6">Не вдалося завантажити налаштування</div>
        )}
      </div>
    </AdminLayout>
  );
}
