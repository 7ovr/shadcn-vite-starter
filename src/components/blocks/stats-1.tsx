import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowUp } from 'lucide-react'

const stats = [
  { value: '12k+', label: 'Active Customers', delta: '+18%' },
  { value: '99.9%', label: 'Uptime Guarantee', delta: '+0.1%' },
  { value: '4.9/5', label: 'Average Rating', delta: '+0.3' },
  { value: '150+', label: 'Countries Served', delta: '+12' },
]

export default function StatsBlock() {
  return (
    <section className="flex w-full items-center justify-center bg-background px-6 py-16 text-foreground">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Trusted At Scale
          </h2>
          <p className="mt-3 text-muted-foreground">The numbers product teams rely on every day.</p>
        </div>

        <Separator className="mt-12" />
        <dl className="grid grid-cols-2 md:grid-cols-4">
          {stats.map(({ value, label, delta }) => (
            <div
              key={label}
              className="flex flex-col items-center border-border px-6 py-8 text-center md:[&:nth-child(2)]:border-r [&:nth-child(odd)]:border-r"
            >
              <dt className="mt-2 text-sm text-muted-foreground">{label}</dt>
              <dd className="order-first text-4xl font-bold tracking-tight sm:text-5xl">{value}</dd>
              <dd className="mt-2">
                <Badge variant="secondary">
                  <ArrowUp data-icon="inline-start" aria-hidden="true" />
                  {delta}
                </Badge>
              </dd>
            </div>
          ))}
        </dl>
        <Separator />
      </div>
    </section>
  )
}
