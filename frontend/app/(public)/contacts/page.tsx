import type { Metadata } from 'next';
import { Phone, Mail, MapPin, Clock, Instagram, Facebook, Send } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { BookingForm } from '@/components/booking/BookingForm';

export const metadata: Metadata = {
  title: 'Контакти',
  description: 'Контакти стоматологічної клініки Cosmodent у Києві. Адреса, телефон, графік роботи, онлайн-запис.',
};

const CONTACTS = [
  {
    icon: Phone,
    label: 'Телефон',
    value: '+38 (044) 123-45-67',
    href:  'tel:+380441234567',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'info@cosmodent.ua',
    href:  'mailto:info@cosmodent.ua',
  },
  {
    icon: MapPin,
    label: 'Адреса',
    value: 'вул. Хрещатик, 1, Київ, 01001',
    href:  'https://maps.google.com/?q=Хрещатик+1+Київ',
  },
];

const SCHEDULE = [
  { day: 'Понеділок – П'ятниця', time: '09:00 – 20:00' },
  { day: 'Субота',               time: '09:00 – 17:00' },
  { day: 'Неділя',               time: 'Вихідний'       },
];

export default function ContactsPage() {
  return (
    <div className="container-site py-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="section-heading">Контакти</h1>
        <p className="section-subheading mx-auto">
          Ми знаходимося в самому серці Києва. Зв'яжіться з нами або запишіться онлайн
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Contact info */}
        <div className="space-y-6">
          {/* Contact cards */}
          {CONTACTS.map(({ icon: Icon, label, value, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-neutral-100 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <div className="w-11 h-11 bg-primary-100 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary-600 transition-colors">
                <Icon size={20} className="text-primary-600 group-hover:text-white transition-colors" />
              </div>
              <div>
                <p className="text-xs text-neutral-400 font-medium uppercase tracking-wide">{label}</p>
                <p className="text-neutral-900 font-medium mt-0.5">{value}</p>
              </div>
            </a>
          ))}

          {/* Working hours */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                <Clock size={18} className="text-primary-600" />
              </div>
              <h2 className="font-semibold text-neutral-900">Графік роботи</h2>
            </div>
            <ul className="space-y-2">
              {SCHEDULE.map(({ day, time }) => (
                <li key={day} className="flex justify-between text-sm">
                  <span className="text-neutral-600">{day}</span>
                  <span className={time === 'Вихідний' ? 'text-neutral-400' : 'font-medium text-neutral-900'}>
                    {time}
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Socials */}
          <Card className="p-6">
            <h2 className="font-semibold text-neutral-900 mb-4">Ми в соціальних мережах</h2>
            <div className="flex gap-3">
              {[
                { icon: Instagram, label: 'Instagram', href: 'https://instagram.com/cosmodent', color: 'hover:bg-pink-500' },
                { icon: Facebook,  label: 'Facebook',  href: 'https://facebook.com/cosmodent',  color: 'hover:bg-blue-600' },
                { icon: Send,      label: 'Telegram',  href: 'https://t.me/cosmodent',          color: 'hover:bg-sky-500'  },
              ].map(({ icon: Icon, label, href, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center text-neutral-500 hover:text-white transition-all ${color}`}
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </Card>
        </div>

        {/* Map placeholder */}
        <div className="rounded-2xl overflow-hidden border border-neutral-100 shadow-card min-h-[400px] bg-neutral-100 flex items-center justify-center">
          <div className="text-center p-8">
            <MapPin size={40} className="text-primary-600 mx-auto mb-3" />
            <p className="text-neutral-600 font-medium">вул. Хрещатик, 1, Київ</p>
            <a
              href="https://maps.google.com/?q=Хрещатик+1+Київ"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 btn-outline text-sm inline-flex"
            >
              Відкрити в Google Maps
            </a>
          </div>
        </div>
      </div>

      {/* Booking form */}
      <section className="max-w-2xl mx-auto" aria-labelledby="contact-booking-heading">
        <div className="text-center mb-8">
          <h2 id="contact-booking-heading" className="text-2xl font-semibold text-neutral-900">
            Записатися на прийом
          </h2>
        </div>
        <Card className="p-8">
          <BookingForm />
        </Card>
      </section>
    </div>
  );
}
