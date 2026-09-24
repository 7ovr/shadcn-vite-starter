import { Badge } from '@/components/ui/badge'

// A page section: a small heading with an optional count, description and action, then its content.
export function Section({
  title,
  count,
  description,
  action,
  children,
}: {
  title: string
  count?: number
  description?: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex min-h-8 items-end justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold">{title}</h2>
            {count === undefined ? null : (
              <Badge variant="subtle" size="sm">
                {count.toLocaleString('en-US')}
              </Badge>
            )}
          </div>
          {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}
