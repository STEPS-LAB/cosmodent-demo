'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAdminStore } from '@/stores/adminStore';
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  CalendarIcon,
  SparklesIcon,
  UserGroupIcon,
  ChatBubbleLeftIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
  { name: 'Записи', href: '/admin/appointments', icon: CalendarIcon },
  { name: 'Послуги', href: '/admin/services', icon: SparklesIcon },
  { name: 'Лікарі', href: '/admin/doctors', icon: UserGroupIcon },
  { name: 'Відгуки', href: '/admin/reviews', icon: ChatBubbleLeftIcon },
  { name: 'Блог', href: '/admin/blog', icon: DocumentTextIcon },
  { name: 'Налаштування', href: '/admin/settings', icon: Cog6ToothIcon },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAdminStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  // Перевіряємо, чи потрібно перенаправити на логін
  useEffect(() => {
    if (!isAuthenticated && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [isAuthenticated, pathname, router]);

  // Перевіряємо монтаж для уникнення гідратації
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Якщо не автентифіковані і на сторінці логіну - показуємо тільки контент
  if (!isMounted) {
    return null;
  }

  if (!isAuthenticated && pathname === '/admin/login') {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center py-12 px-4">
        {children}
      </div>
    );
  }

  // Якщо не автентифіковані - не показуємо нічого (відбудеться редірект)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-secondary-900/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-secondary-200 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-secondary-200">
            <Link href="/admin/dashboard" className="flex items-center space-x-2">
              <div className="w-20 h-12 rounded-xl overflow-hidden">
                <img
                  src="https://res2.weblium.site/res/66434ff5faf4a6dea272b611/664361fe63d29abd486d11da_optimized.webp"
                  alt="КОСМОДЕНТ"
                  className="w-full h-full object-contain"
                />
              </div>
            </Link>
            <button
              className="lg:hidden p-2"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-secondary-700 hover:bg-secondary-50'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User */}
          <div className="p-4 border-t border-secondary-200">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-700 font-semibold text-sm">
                  {user?.name.charAt(0)}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-secondary-900">{user?.name}</p>
                <p className="text-xs text-secondary-500">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-3 py-2 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
              Вийти
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-secondary-200 flex items-center px-4">
          <button
            className="lg:hidden p-2 mr-4"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
          <div className="flex-1" />
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
