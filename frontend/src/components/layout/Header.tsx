'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Головна', href: '/' },
  { name: 'Послуги', href: '/services' },
  { name: 'Лікарі', href: '/doctors' },
  { name: 'Відгуки', href: '/reviews' },
  { name: 'Контакти', href: '/contacts' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-secondary-900/10 border-b border-white/20'
          : 'bg-white/90 backdrop-blur-xl shadow-md shadow-secondary-900/5 lg:bg-transparent lg:shadow-none lg:border-none'
      }`}
    >
      <nav className="container-custom py-3 sm:py-4" aria-label="Global">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full blur-lg opacity-50 sm:group-hover:opacity-75 transition-opacity duration-300" />
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center sm:group-hover:scale-105 transition-all duration-300">
                <img
                  src="/logo.png"
                  alt="КОСМОДЕНТ"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <span className="text-xl sm:text-2xl font-bold text-secondary-900 sm:group-hover:text-primary-600 transition-colors duration-300">КОСМОДЕНТ</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative px-4 py-2 text-secondary-600 sm:hover:text-primary-600 font-medium transition-all duration-300 group"
              >
                {item.name}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-primary-600 sm:group-hover:w-full transition-all duration-300 rounded-full" />
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex">
            <Link
              href="/booking"
              className="relative inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl sm:hover:from-primary-700 sm:hover:to-primary-600 transition-all duration-300 shadow-lg shadow-primary-500/30 sm:hover:shadow-xl sm:hover:shadow-primary-500/40 sm:hover:-translate-y-0.5 group overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full sm:group-hover:translate-x-full transition-transform duration-700" />
              <span className="relative">Записатися</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden relative p-2 text-secondary-600 sm:hover:text-primary-600 transition-colors duration-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Відкрити меню"
          >
            <span className="absolute inset-0 bg-primary-50 rounded-lg opacity-0 sm:hover:opacity-100 transition-opacity duration-300" />
            <span className="relative">
              {mobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </span>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-secondary-100 pt-4 animate-fade-in-down origin-top">
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-4 py-3 text-secondary-600 rounded-xl font-medium flex items-center justify-between"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-2">
                <Link
                  href="/booking"
                  className="block w-full text-center px-6 py-4 text-base font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl shadow-lg shadow-primary-500/30"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Записатися на прийом
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
