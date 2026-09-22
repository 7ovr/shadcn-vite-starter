import { Link } from '@tanstack/react-router'

import { ThemeToggle } from '@/components/theme-toggle'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const NAV = [
  { to: '/', label: 'Home' },
  { to: '/waitlist', label: 'Waitlist' },
] as const

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4">
        <Link to="/" className="font-heading text-sm font-semibold">
          Starter
        </Link>

        <nav aria-label="Main" className="flex items-center gap-1">
          {/* Real links styled as buttons: a Button rendering a Link reports itself as a button. */}
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: true }}
              activeProps={{ 'aria-current': 'page' }}
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'sm' }),
                'text-muted-foreground aria-[current=page]:bg-muted aria-[current=page]:text-foreground',
              )}
            >
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
