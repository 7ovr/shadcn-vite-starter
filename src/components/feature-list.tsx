import type { LucideIcon } from 'lucide-react'

import { IconTile } from '@/components/icon-tile'

// Compact two-column list items: an icon tile, a title, a line of body text and a muted meta line.
export function FeatureList({
  items,
}: {
  items: readonly { icon: LucideIcon; title: string; description: string; meta?: string }[]
}) {
  return (
    <ul className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item.title} className="flex items-start gap-3">
          <IconTile>
            <item.icon aria-hidden="true" />
          </IconTile>
          <div className="flex min-w-0 flex-col gap-0.5">
            <p className="text-sm font-semibold">{item.title}</p>
            <p className="text-sm text-soft-foreground">{item.description}</p>
            {item.meta ? <p className="text-xs text-muted-foreground">{item.meta}</p> : null}
          </div>
        </li>
      ))}
    </ul>
  )
}
