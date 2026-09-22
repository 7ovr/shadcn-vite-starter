import { Link } from '@tanstack/react-router'

import { ThemeToggle } from '@/components/theme-toggle'
import { buttonVariants } from '@/components/ui/button'

const NAV = [
  { to: '/', label: 'Home' },
  { to: '/pokemon', label: 'Pokémon' },
] as const

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4">
        <Link to="/" className="font-heading text-sm font-semibold">
          Starter
        </Link>

        <div className="flex items-center gap-1">
          <nav aria-label="Main" className="flex items-center gap-1">
            {/* Real links styled as buttons: a Button rendering a Link reports itself as a button. */}
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === '/' }}
                activeProps={{ 'aria-current': 'page' }}
                className={buttonVariants({ variant: 'nav', size: 'sm' })}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
