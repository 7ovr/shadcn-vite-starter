import { createFileRoute } from "@tanstack/react-router"

import CtaBlock from "@/components/blocks/cta-1"
import FaqsBlock from "@/components/blocks/faqs-1"
import HeroBlock from "@/components/blocks/hero-1"
import PricingBlock from "@/components/blocks/pricing-1"
import StatsBlock from "@/components/blocks/stats-1"
import TestimonialsBlock from "@/components/blocks/testimonials-1"

export const Route = createFileRoute("/")({
  component: HomePage,
})

// Six free 7Ovr blocks. Add more with `pnpm dlx shadcn@latest add @7ovr/<name>`.
function HomePage() {
  return (
    <main>
      <HeroBlock />
      <StatsBlock />
      <TestimonialsBlock />
      <PricingBlock />
      <FaqsBlock />
      <CtaBlock />
    </main>
  )
}
