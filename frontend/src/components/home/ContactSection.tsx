import { PhoneIcon, EnvelopeIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';

const workingHours = [
  { day: 'Пн - Пт', hours: '09:00 - 18:00' },
  { day: 'Сб', hours: '10:00 - 15:00' },
  { day: 'Нд', hours: 'Вихідний' },
];

export function ContactSection() {
  return (
    <section className="py-16 md:py-24 bg-secondary-50" id="contacts">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="section-title">Контакти</h2>
            <p className="section-subtitle mb-8">
              Зв'яжіться з нами будь-яким зручним способом
            </p>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPinIcon className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-secondary-900 mb-1">Адреса</h3>
                  <p className="text-secondary-600">
                    вул. Хрещатик, 1, Київ, 01001
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <PhoneIcon className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-secondary-900 mb-1">Телефон</h3>
                  <a href="tel:+380441234567" className="text-primary-600 hover:text-primary-700">
                    +380 (44) 123-45-67
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <EnvelopeIcon className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-secondary-900 mb-1">Email</h3>
                  <a href="mailto:info@cosmodent.ua" className="text-primary-600 hover:text-primary-700">
                    info@cosmodent.ua
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ClockIcon className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-secondary-900 mb-1">Графік роботи</h3>
                  <ul className="text-secondary-600 space-y-1">
                    {workingHours.map((item) => (
                      <li key={item.day}>{item.day}: {item.hours}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="bg-white rounded-xl shadow-sm border border-secondary-100 overflow-hidden h-96 lg:h-auto">
            <div className="w-full h-full bg-secondary-100 flex items-center justify-center">
              <div className="text-center p-8">
                <MapPinIcon className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
                <p className="text-secondary-600">
                  Інтерактивна карта буде доступна тут
                </p>
                <p className="text-sm text-secondary-500 mt-2">
                  вул. Хрещатик, 1, Київ
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
