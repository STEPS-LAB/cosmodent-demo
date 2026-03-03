'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Calendar, Stethoscope, Users,
  FileText, Settings, LogOut, Menu, X,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/admin',              icon: LayoutDashboard, label: 'Дашборд'        },
  { href: '/admin/appointments', icon: Calendar,        label: 'Записи'         },
  { href: '/admin/services',     icon: Stethoscope,     label: 'Послуги'        },
  { href: '/admin/doctors',      icon: Users,           label: 'Лікарі'         },
  { href: '/admin/reviews',      icon: FileText,        label: 'Відгуки'        },
  { href: '/admin/blog',         icon: FileText,        label: 'Блог'           },
  { href: '/admin/settings',     icon: Settings,        label: 'Налаштування'   },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('cosmodent_token');
    localStorage.removeItem('cosmodent_admin');
    router.push('/admin/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-neutral-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <span className="font-bold text-neutral-900">Cosmodent</span>
          <span className="text-xs text-neutral-400 ml-auto">Admin</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1" aria-label="Адмін-навігація">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = href === '/admin' ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={cn('admin-sidebar-link', active && 'active')}
              aria-current={active ? 'page' : undefined}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-neutral-100">
        <button
          onClick={handleLogout}
          className="admin-sidebar-link w-full text-red-500 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={18} />
          Вийти
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 shrink-0 bg-white border-r border-neutral-100 min-h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile: top bar + drawer */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-neutral-100 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">C</span>
          </div>
          <span className="font-semibold text-sm">Cosmodent Admin</span>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-lg hover:bg-neutral-100"
          aria-label="Відкрити меню"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-56 bg-white border-r border-neutral-100 h-full">
            <div className="flex justify-end p-3">
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-neutral-100" aria-label="Закрити">
                <X size={18} />
              </button>
            </div>
            <SidebarContent />
          </div>
          <div className="flex-1 bg-black/40" onClick={() => setOpen(false)} />
        </div>
      )}
    </>
  );
}
