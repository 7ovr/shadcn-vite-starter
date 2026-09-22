import { MoonIcon, SunIcon } from 'lucide-react'

import { useTheme } from '@/components/theme-provider'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      // Read the applied class, so "system" flips to the opposite of what is showing.
      onClick={() =>
        setTheme(document.documentElement.classList.contains('dark') ? 'light' : 'dark')
      }
    >
      <SunIcon className="hidden dark:block" />
      <MoonIcon className="dark:hidden" />
    </Button>
  )
}
