'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/',         label: 'Головна'  },
  { href: '/services', label: 'Послуги'  },
  { href: '/doctors',  label: 'Лікарі'   },
  { href: '/reviews',  label: 'Відгуки'  },
  { href: '/contacts', label: 'Контакти' },
];

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [scrolled,  setScrolled]  = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close on route change
  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full transition-all duration-300',
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm'
          : 'bg-white border-b border-neutral-100',
      )}
    >
      <nav className="container-site h-16 flex items-center justify-between" aria-label="Головна навігація">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group" aria-label="Cosmodent — головна">
          <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center shadow-button group-hover:scale-105 transition-transform">
            <span className="text-white font-bold text-lg leading-none">C</span>
          </div>
          <span className="font-bold text-xl text-neutral-900 tracking-tight">
            Cosmo<span className="text-primary-600">dent</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-1" role="list">
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href || (href !== '/' && pathname.startsWith(href));
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150',
                    active
                      ? 'text-primary-700 bg-primary-50'
                      : 'text-neutral-600 hover:text-primary-700 hover:bg-primary-50',
                  )}
                  aria-current={active ? 'page' : undefined}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="tel:+380441234567"
            className="flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-primary-600 transition-colors"
          >
            <Phone size={16} />
            +38 (044) 123-45-67
          </a>
          <Link
            href="/#booking"
            className="btn-primary text-sm px-4 py-2"
          >
            Записатися
          </Link>
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden p-2 rounded-lg text-neutral-600 hover:bg-neutral-100 transition-colors"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Закрити меню' : 'Відкрити меню'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-neutral-100 bg-white animate-fade-in">
          <ul className="container-site py-4 flex flex-col gap-1" role="list">
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname === href || (href !== '/' && pathname.startsWith(href));
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      'block px-4 py-3 rounded-xl text-base font-medium transition-colors',
                      active
                        ? 'text-primary-700 bg-primary-50'
                        : 'text-neutral-700 hover:text-primary-700 hover:bg-primary-50',
                    )}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
            <li className="pt-2 border-t border-neutral-100 mt-1">
              <Link href="/#booking" className="btn-primary w-full justify-center">
                Записатися
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
