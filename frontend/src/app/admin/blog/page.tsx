import { Metadata } from 'next';
import { AdminBlogPage } from '@/components/admin/blog/AdminBlogPage';

export const metadata: Metadata = {
  title: 'Блог - КОСМОДЕНТ Admin',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminBlog() {
  return <AdminBlogPage />;
}
