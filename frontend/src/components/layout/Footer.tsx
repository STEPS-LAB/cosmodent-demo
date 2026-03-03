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
    <footer className="relative bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 text-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 sm:-top-40 sm:-right-40 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-bl from-primary-500/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 sm:-bottom-40 sm:-left-40 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-tr from-primary-500/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMTAgNjAgTSAwIDEwIEwgNjAgMTAiIHN0cm9rZT0iIzEwYjk4MSIgc3Ryb2tlLXdpZHRoPSIwLjI1IiBmaWxsPSJub25lIiBvcGFjaXR5PSIwLjAzIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
      </div>

      <div className="container-custom relative z-10 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {/* Brand */}
          <div className="col-span-1 sm:col-span-1">
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3 mb-6 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <span className="text-white font-bold text-xl sm:text-2xl">C</span>
                </div>
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white via-secondary-100 to-white bg-clip-text text-transparent">CosmoDent</span>
            </Link>
            <p className="text-secondary-400 text-sm leading-relaxed mb-6">
              Сучасна стоматологічна клініка з інноваційними технологіями лікування.
              Турбота про вашу посмішку — наш пріоритет.
            </p>

            {/* Social links */}
            <div className="flex gap-2 sm:gap-3">
              {['facebook', 'instagram', 'twitter'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-9 h-9 sm:w-10 sm:h-10 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl flex items-center justify-center text-secondary-400 hover:text-primary-400 hover:bg-primary-500/20 hover:border-primary-500/30 transition-all duration-300 hover:-translate-y-1"
                  aria-label={social}
                >
                  <span className="text-xs font-semibold uppercase">{social.charAt(0)}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-base sm:text-lg mb-6 flex items-center gap-2">
              <span className="w-1 h-5 sm:h-6 bg-gradient-to-b from-primary-500 to-primary-600 rounded-full" />
              Послуги
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {services.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-secondary-400 hover:text-primary-400 text-sm transition-all duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-gradient-to-r from-primary-500 to-primary-600 group-hover:w-4 transition-all duration-300 rounded-full" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-base sm:text-lg mb-6 flex items-center gap-2">
              <span className="w-1 h-5 sm:h-6 bg-gradient-to-b from-primary-500 to-primary-600 rounded-full" />
              Навігація
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-secondary-400 hover:text-primary-400 text-sm transition-all duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-gradient-to-r from-primary-500 to-primary-600 group-hover:w-4 transition-all duration-300 rounded-full" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-base sm:text-lg mb-6 flex items-center gap-2">
              <span className="w-1 h-5 sm:h-6 bg-gradient-to-b from-primary-500 to-primary-600 rounded-full" />
              Контакти
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl flex items-center justify-center text-primary-400 group-hover:bg-primary-500/20 group-hover:border-primary-500/30 transition-all duration-300 flex-shrink-0">
                  <MapPinIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-secondary-400 text-sm pt-1">
                  вул. Хрещатик, 1, Київ, 01001
                </span>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl flex items-center justify-center text-primary-400 group-hover:bg-primary-500/20 group-hover:border-primary-500/30 transition-all duration-300 flex-shrink-0">
                  <PhoneIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <a href="tel:+380441234567" className="text-secondary-400 hover:text-primary-400 text-sm transition-colors duration-300">
                  +380 (44) 123-45-67
                </a>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl flex items-center justify-center text-primary-400 group-hover:bg-primary-500/20 group-hover:border-primary-500/30 transition-all duration-300 flex-shrink-0">
                  <EnvelopeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <a href="mailto:info@cosmodent.ua" className="text-secondary-400 hover:text-primary-400 text-sm transition-colors duration-300">
                  info@cosmodent.ua
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-10 sm:mt-12 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-secondary-500 text-xs sm:text-sm">
              © {new Date().getFullYear()} CosmoDent. Всі права захищено.
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              <Link href="#" className="text-secondary-500 hover:text-primary-400 text-xs sm:text-sm transition-all duration-300 relative group">
                <span className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-primary-500 to-primary-600 group-hover:w-full transition-all duration-300" />
                Політика конфіденційності
              </Link>
              <Link href="#" className="text-secondary-500 hover:text-primary-400 text-xs sm:text-sm transition-all duration-300 relative group">
                <span className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-primary-500 to-primary-600 group-hover:w-full transition-all duration-300" />
                Умови використання
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
