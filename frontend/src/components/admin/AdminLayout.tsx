'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAdminStore, useStoreInitialized } from '@/stores/adminStore';
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
  const { user, logout, isAuthenticated, initialize } = useAdminStore();
  const isStoreInitialized = useStoreInitialized();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/admin/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      }).catch(() => {}); // Ignore errors
    } finally {
      logout();
      router.push('/admin/login');
    }
  };

  // Initialize store after hydration
  useEffect(() => {
    setIsClient(true);
    initialize();
  }, [initialize]);

  // Redirect to login if not authenticated (only after initialization)
  useEffect(() => {
    if (!isClient || !isStoreInitialized) return;

    if (!isAuthenticated && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [isClient, isStoreInitialized, isAuthenticated, pathname, router]);

  // Show nothing during SSR/hydration
  if (!isClient || !isStoreInitialized) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-secondary-200 rounded-full mb-4" />
          <div className="h-4 w-32 bg-secondary-200 rounded" />
        </div>
      </div>
    );
  }

  // If not authenticated and on login page - show only content
  if (!isAuthenticated && pathname === '/admin/login') {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center py-12 px-4">
        {children}
      </div>
    );
  }

  // If not authenticated - show nothing (redirect will happen)
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
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <div className="w-10 h-10 flex-shrink-0">
                <img
                  src="/logo.png"
                  alt="КОСМОДЕНТ"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-lg font-bold text-secondary-900">КОСМОДЕНТ</span>
            </Link>
            <button
              className="lg:hidden p-2"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + '/');
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
                  {user?.name?.charAt(0) || 'A'}
                </span>
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-secondary-900 truncate">
                  {user?.name || 'Admin'}
                </p>
                <p className="text-xs text-secondary-500 truncate">
                  {user?.role || 'admin'}
                </p>
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
            aria-label="Open sidebar"
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
