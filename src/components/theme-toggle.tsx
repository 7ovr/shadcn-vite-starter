import { MoonIcon, SunIcon } from 'lucide-react'

import { useTheme } from '@/hooks/use-theme'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { toggleTheme } = useTheme()

  return (
    <Button variant="ghost" size="icon" aria-label="Toggle Theme" onClick={toggleTheme}>
      <SunIcon className="hidden dark:block" />
      <MoonIcon className="dark:hidden" />
    </Button>
  )
}
