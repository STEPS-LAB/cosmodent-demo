import { HeroSection } from '@/components/home/HeroSection';
import { ServicesSection } from '@/components/home/ServicesSection';
import { DoctorsSection } from '@/components/home/DoctorsSection';
import { ReviewsSection } from '@/components/home/ReviewsSection';
import { BookingCTA } from '@/components/home/BookingCTA';
import { ContactSection } from '@/components/home/ContactSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <DoctorsSection />
      <ReviewsSection />
      <BookingCTA />
      <ContactSection />
    </>
  );
}
