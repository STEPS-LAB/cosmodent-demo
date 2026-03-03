'use client';

import { PhoneIcon, EnvelopeIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';

const workingHours = [
  { day: 'Пн - Пт', hours: '09:00 - 18:00' },
  { day: 'Сб', hours: '10:00 - 15:00' },
  { day: 'Нд', hours: 'Вихідний' },
];

const contactItems = [
  {
    icon: MapPinIcon,
    title: 'Адреса',
    content: 'вул. Хрещатик, 1, Київ, 01001',
    href: undefined,
  },
  {
    icon: PhoneIcon,
    title: 'Телефон',
    content: '+380 (44) 123-45-67',
    href: 'tel:+380441234567',
  },
  {
    icon: EnvelopeIcon,
    title: 'Email',
    content: 'info@cosmodent.ua',
    href: 'mailto:info@cosmodent.ua',
  },
  {
    icon: ClockIcon,
    title: 'Графік роботи',
    content: null,
    href: undefined,
    isSchedule: true,
  },
];

export function ContactSection() {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-white via-secondary-50/50 to-white relative overflow-hidden" id="contacts">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-primary-100/40 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tl from-primary-100/40 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 border border-primary-200 rounded-full mb-6 animate-fade-in-up">
              <span className="text-sm font-semibold text-primary-700 uppercase tracking-wide">Контакти</span>
            </div>
            <h2 className="section-title">Зв&apos;яжіться з нами</h2>
            <p className="section-subtitle mb-10">
              Ми завжди готові відповісти на ваші запитання та допомогти з вибором послуг
            </p>

            <div className="space-y-6">
              {contactItems.map((item, index) => (
                <div
                  key={item.title}
                  className="group flex items-start gap-5 p-5 rounded-2xl hover:bg-white/80 hover:backdrop-blur-sm hover:shadow-lg hover:shadow-primary-500/5 transition-all duration-500 hover:-translate-y-1"
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
                    <div className="relative w-14 h-14 bg-gradient-to-br from-primary-100 via-primary-50 to-white rounded-xl flex items-center justify-center shadow-md group-hover:shadow-xl group-hover:shadow-primary-500/20 transition-all duration-500 group-hover:scale-110">
                      <item.icon className="w-6 h-6 text-primary-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-secondary-900 mb-2 group-hover:text-primary-600 transition-colors duration-300">{item.title}</h3>
                    {item.isSchedule ? (
                      <ul className="text-secondary-600 space-y-1.5">
                        {workingHours.map((schedule) => (
                          <li key={schedule.day} className="flex justify-between max-w-xs">
                            <span className="font-medium">{schedule.day}:</span>
                            <span className="text-secondary-500">{schedule.hours}</span>
                          </li>
                        ))}
                      </ul>
                    ) : item.href ? (
                      <a
                        href={item.href}
                        className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-300 inline-flex items-center gap-1 group/link"
                      >
                        {item.content}
                        <svg className="w-4 h-4 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    ) : (
                      <p className="text-secondary-600">{item.content}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-400/20 to-primary-600/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-secondary-900/5 border border-white/50 overflow-hidden h-96 lg:h-full">
              <div className="w-full h-full bg-gradient-to-br from-secondary-50 to-secondary-100 flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-700">
                <div className="text-center p-8">
                  <div className="relative inline-block mb-6">
                    <div className="absolute inset-0 bg-primary-500/30 rounded-full blur-xl animate-pulse" />
                    <div className="relative w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-50 rounded-2xl flex items-center justify-center shadow-lg mx-auto">
                      <MapPinIcon className="w-10 h-10 text-primary-600" />
                    </div>
                  </div>
                  <p className="text-secondary-700 font-medium mb-2">
                    Інтерактивна карта буде доступна тут
                  </p>
                  <p className="text-sm text-secondary-500">
                    вул. Хрещатик, 1, Київ
                  </p>
                  
                  {/* Decorative map pins */}
                  <div className="mt-6 flex justify-center gap-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 200}ms` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
