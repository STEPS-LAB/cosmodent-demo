import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminAuthGuard } from '@/components/admin/AdminAuthGuard';

export const metadata = { title: { template: '%s | Cosmodent Admin', default: 'Cosmodent Admin' } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthGuard>
      <div className="flex min-h-screen bg-neutral-50">
        <AdminSidebar />
        <main className="flex-1 min-w-0 p-4 md:p-8">
          {children}
        </main>
      </div>
    </AdminAuthGuard>
  );
}
