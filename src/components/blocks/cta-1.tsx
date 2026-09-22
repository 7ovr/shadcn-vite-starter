import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export default function CtaBlock() {
  return (
    <section className="flex w-full items-center justify-center bg-background px-6 py-12 text-foreground">
      <div className="w-full max-w-3xl rounded-xl border border-border bg-muted/30 px-6 py-12 text-center sm:px-12 sm:py-16">
        <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Start Building Faster Today
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
          Ship production-ready interfaces in minutes with composable blocks, sensible defaults, and
          zero configuration.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button render={<a href="#" />} nativeButton={false} className="w-full sm:w-auto">
            Get Started
            <ArrowRight data-icon="inline-end" aria-hidden="true" />
          </Button>
          <Button
            variant="secondary"
            render={<a href="#" />}
            nativeButton={false}
            className="w-full sm:w-auto"
          >
            Read The Docs
          </Button>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">No credit card required.</p>
      </div>
    </section>
  )
}
