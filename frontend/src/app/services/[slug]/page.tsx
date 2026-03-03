import { Metadata } from 'next';
import { ServiceDetailPage } from '@/components/services/ServiceDetailPage';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const service = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services/${slug}`).then(
      (res) => res.json()
    );
    
    return {
      title: `${service.name} - КОСМОДЕНТ`,
      description: service.seoDescription || service.shortDescription,
    };
  } catch {
    return {
      title: 'Послуга не знайдена - КОСМОДЕНТ',
    };
  }
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  return <ServiceDetailPage slug={slug} />;
}
