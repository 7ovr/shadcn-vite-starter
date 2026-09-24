import {
  type BrandMark,
  LogoMark,
  ReactIcon,
  ShadcnIcon,
  TailwindIcon,
  TanStackIcon,
  TypeScriptIcon,
  ViteIcon,
} from '@/components/icons'
import { cn } from '@/lib/utils'

// Tiles sit at staggered heights around the larger 7Ovr mark in the centre.
const LEFT: { Mark: BrandMark; className: string }[] = [
  { Mark: ReactIcon, className: 'size-12 -translate-y-2' },
  { Mark: TypeScriptIcon, className: 'size-14 translate-y-3 max-sm:hidden' },
  { Mark: ViteIcon, className: 'size-12 -translate-y-1' },
]

const RIGHT: { Mark: BrandMark; className: string }[] = [
  { Mark: TanStackIcon, className: 'size-12 translate-y-2' },
  { Mark: TailwindIcon, className: 'size-14 -translate-y-2 max-sm:hidden' },
  { Mark: ShadcnIcon, className: 'size-12 translate-y-1' },
]

function Tile({ Mark, className }: { Mark: BrandMark; className: string }) {
  return (
    <span
      className={cn(
        'grid shrink-0 place-items-center rounded-2xl border bg-background text-soft-foreground shadow-lg',
        className,
      )}
    >
      <Mark aria-hidden="true" className="size-1/2" />
    </span>
  )
}

export function Showcase() {
  return (
    <section
      aria-labelledby="showcase-title"
      className="flex flex-col items-center gap-6 overflow-hidden rounded-xl border bg-linear-to-b from-muted/60 to-background px-6 py-8 text-center"
    >
      <div className="flex flex-col items-center gap-1.5">
        <p className="text-xs tracking-wider text-muted-foreground uppercase">Made By 7Ovr</p>
        <h2 id="showcase-title" className="font-heading text-xl font-semibold tracking-tight">
          7Ovr Starter
        </h2>
        <p className="text-sm text-soft-foreground">
          Everything this starter ships with, on one page.
        </p>
      </div>

      <div aria-hidden="true" className="flex items-center gap-3 sm:gap-4">
        {LEFT.map((tile) => (
          <Tile key={tile.className} {...tile} />
        ))}
        <span className="grid size-20 shrink-0 place-items-center rounded-3xl border bg-background text-foreground shadow-xl">
          <LogoMark className="size-9" />
        </span>
        {RIGHT.map((tile) => (
          <Tile key={tile.className} {...tile} />
        ))}
      </div>
    </section>
  )
}
