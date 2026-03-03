import Link from 'next/link';
import { Phone, Mail, MapPin, Instagram, Facebook } from 'lucide-react';

const SERVICES_LINKS = [
  { href: '/services/implantology',         label: 'Імплантологія'          },
  { href: '/services/orthodontics',          label: 'Ортодонтія'             },
  { href: '/services/aesthetic-dentistry',   label: 'Естетична стоматологія' },
  { href: '/services/teeth-whitening',       label: 'Відбілювання зубів'     },
  { href: '/services/pediatric-dentistry',   label: 'Дитяча стоматологія'    },
];

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-300">
      <div className="container-site py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="font-bold text-xl text-white">
                Cosmo<span className="text-primary-400">dent</span>
              </span>
            </Link>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Сучасна стоматологічна клініка у Києві. Ваша усмішка — наша місія.
            </p>
            <div className="flex gap-3 mt-5">
              <a
                href="https://instagram.com/cosmodent"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-neutral-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://facebook.com/cosmodent"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-neutral-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Послуги</h3>
            <ul className="space-y-2">
              {SERVICES_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-neutral-400 hover:text-primary-400 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Клініка</h3>
            <ul className="space-y-2">
              {[
                ['/doctors',  'Наші лікарі'],
                ['/reviews',  'Відгуки'],
                ['/contacts', 'Контакти'],
                ['/#booking', 'Онлайн-запис'],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-neutral-400 hover:text-primary-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="text-white font-semibold mb-4">Контакти</h3>
            <ul className="space-y-3">
              <li>
                <a href="tel:+380441234567" className="flex items-center gap-2 text-sm text-neutral-400 hover:text-primary-400 transition-colors">
                  <Phone size={14} className="shrink-0" />
                  +38 (044) 123-45-67
                </a>
              </li>
              <li>
                <a href="mailto:info@cosmodent.ua" className="flex items-center gap-2 text-sm text-neutral-400 hover:text-primary-400 transition-colors">
                  <Mail size={14} className="shrink-0" />
                  info@cosmodent.ua
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-neutral-400">
                <MapPin size={14} className="shrink-0 mt-0.5" />
                вул. Хрещатик, 1, Київ, 01001
              </li>
            </ul>

            {/* Working hours */}
            <div className="mt-5 text-sm text-neutral-500">
              <p className="font-medium text-neutral-400 mb-1">Графік роботи:</p>
              <p>Пн–Пт: 09:00–20:00</p>
              <p>Сб: 09:00–17:00</p>
              <p>Нд: вихідний</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-neutral-800">
        <div className="container-site py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-neutral-500">
          <p>© {new Date().getFullYear()} Cosmodent. Всі права захищені.</p>
          <p>Ліцензія МОЗ України № 123456</p>
        </div>
      </div>
    </footer>
  );
}
