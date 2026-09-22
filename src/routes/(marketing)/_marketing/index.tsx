import { createFileRoute } from '@tanstack/react-router'

import CtaBlock from '@/components/blocks/cta-1'
import FaqsBlock from '@/components/blocks/faqs-1'
import HeroBlock from '@/components/blocks/hero-1'
import PricingBlock from '@/components/blocks/pricing-1'
import StatsBlock from '@/components/blocks/stats-1'
import TestimonialsBlock from '@/components/blocks/testimonials-1'

export const Route = createFileRoute('/(marketing)/_marketing/')({
  component: HomePage,
})

function HomePage() {
  return (
    <>
      <HeroBlock />
      <StatsBlock />
      <TestimonialsBlock />
      <PricingBlock />
      <FaqsBlock />
      <CtaBlock />
    </>
  )
}
