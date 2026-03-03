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
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-bold text-xl sm:text-2xl">C</span>
              </div>
            </div>
            <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-secondary-900 via-secondary-800 to-secondary-900 bg-clip-text text-transparent group-hover:from-primary-600 group-hover:to-primary-500 transition-all duration-300">
              CosmoDent
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative px-4 py-2 text-secondary-600 hover:text-primary-600 font-medium transition-all duration-300 group"
              >
                {item.name}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-primary-600 group-hover:w-full transition-all duration-300 rounded-full" />
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex">
            <Link
              href="/booking"
              className="relative inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl hover:from-primary-700 hover:to-primary-600 transition-all duration-300 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 hover:-translate-y-0.5 group overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <span className="relative">Записатися</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden relative p-2 text-secondary-600 hover:text-primary-600 transition-colors duration-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Відкрити меню"
          >
            <span className="absolute inset-0 bg-primary-50 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300" />
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
