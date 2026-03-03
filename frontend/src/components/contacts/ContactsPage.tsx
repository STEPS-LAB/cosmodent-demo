'use client';

import { useEffect, useState } from 'react';
import { PhoneIcon, EnvelopeIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';
import { api } from '@/services/api';

interface ContactInfo {
  clinicName: string;
  phone: string;
  email: string;
  address: {
    street: string;
    city: string;
    zipCode: string;
    country: string;
  };
  workingHours: Record<string, { open: string; close: string; isClosed: boolean }>;
}

const workingHoursLabels: Record<string, string> = {
  monday: 'Понеділок',
  tuesday: 'Вівторок',
  wednesday: 'Середа',
  thursday: 'Четвер',
  friday: "П'ятниця",
  saturday: 'Субота',
  sunday: 'Неділя',
};

export function ContactsPage() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getContactInfo().then((data) => {
      setContactInfo(data);
      setLoading(false);
    });
  }, []);

  if (loading || !contactInfo) {
    return (
      <div className="py-12 md:py-16">
        <div className="container-custom">
          <div className="animate-pulse">
            <div className="h-10 bg-secondary-200 rounded w-1/3 mb-4" />
            <div className="h-4 bg-secondary-200 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 md:py-16">
      <div className="container-custom">
        <div className="max-w-3xl mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-4">
            Контакти
          </h1>
          <p className="text-lg text-secondary-600">
            Зв'яжіться з нами будь-яким зручним способом
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPinIcon className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-secondary-900 mb-1">Адреса</h3>
                <p className="text-secondary-600">
                  {contactInfo.address.street}<br />
                  {contactInfo.address.city}, {contactInfo.address.zipCode}<br />
                  {contactInfo.address.country}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <PhoneIcon className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-secondary-900 mb-1">Телефон</h3>
                <a href={`tel:${contactInfo.phone}`} className="text-primary-600 hover:text-primary-700 text-lg">
                  {contactInfo.phone}
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <EnvelopeIcon className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-secondary-900 mb-1">Email</h3>
                <a href={`mailto:${contactInfo.email}`} className="text-primary-600 hover:text-primary-700">
                  {contactInfo.email}
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <ClockIcon className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-secondary-900 mb-3">Графік роботи</h3>
                <ul className="space-y-2">
                  {Object.entries(contactInfo.workingHours).map(([day, hours]) => (
                    <li key={day} className="flex justify-between text-sm">
                      <span className="text-secondary-700">{workingHoursLabels[day]}</span>
                      <span className={hours.isClosed ? 'text-red-500' : 'text-secondary-600'}>
                        {hours.isClosed ? 'Вихідний' : `${hours.open} - ${hours.close}`}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="bg-white rounded-xl shadow-sm border border-secondary-100 overflow-hidden h-96 lg:h-auto">
            <div className="w-full h-full bg-secondary-100 flex items-center justify-center">
              <div className="text-center p-8">
                <MapPinIcon className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
                <p className="text-secondary-600 font-medium">
                  {contactInfo.address.street}
                </p>
                <p className="text-secondary-500 mt-1">
                  {contactInfo.address.city}
                </p>
                <p className="text-sm text-secondary-400 mt-4">
                  Інтерактивна карта буде доступна тут
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
