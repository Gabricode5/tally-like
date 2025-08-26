import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { HeroSection } from '@/components/sections/HeroSection'
import { FeaturesSection } from '@/components/sections/FeaturesSection'
import { PricingSection } from '@/components/sections/PricingSection'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { CTASection } from '@/components/sections/CTASection'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      
      <Footer />
    </div>
  )
}
