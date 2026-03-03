import Link from 'next/link';
import { PhoneIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/outline';

const services = [
  { name: 'Імплантація', href: '/services/implantatsiya-zubiv' },
  { name: 'Протезування', href: '/services#prosthetics' },
  { name: 'Ортодонтія', href: '/services#orthodontics' },
  { name: 'Лікування зубів', href: '/services#treatment' },
  { name: 'Професійна гігієна', href: '/services#hygiene' },
];

const quickLinks = [
  { name: 'Головна', href: '/' },
  { name: 'Послуги', href: '/services' },
  { name: 'Лікарі', href: '/doctors' },
  { name: 'Відгуки', href: '/reviews' },
  { name: 'Контакти', href: '/contacts' },
];

export function Footer() {
  return (
    <footer className="bg-secondary-900 text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="text-xl font-bold">CosmoDent</span>
            </Link>
            <p className="text-secondary-400 text-sm">
              Сучасна стоматологічна клініка з інноваційними технологіями лікування.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Послуги</h3>
            <ul className="space-y-2">
              {services.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-secondary-400 hover:text-primary-400 text-sm transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Навігація</h3>
            <ul className="space-y-2">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-secondary-400 hover:text-primary-400 text-sm transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Контакти</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <MapPinIcon className="w-5 h-5 text-primary-500 mt-0.5" />
                <span className="text-secondary-400 text-sm">
                  вул. Хрещатик, 1, Київ, 01001
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <PhoneIcon className="w-5 h-5 text-primary-500" />
                <a href="tel:+380441234567" className="text-secondary-400 hover:text-primary-400 text-sm">
                  +380 (44) 123-45-67
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <EnvelopeIcon className="w-5 h-5 text-primary-500" />
                <a href="mailto:info@cosmodent.ua" className="text-secondary-400 hover:text-primary-400 text-sm">
                  info@cosmodent.ua
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-secondary-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-secondary-400 text-sm">
              © {new Date().getFullYear()} CosmoDent. Всі права захищено.
            </p>
            <div className="flex space-x-6">
              <Link href="#" className="text-secondary-400 hover:text-primary-400 text-sm">
                Політика конфіденційності
              </Link>
              <Link href="#" className="text-secondary-400 hover:text-primary-400 text-sm">
                Умови використання
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
