import { MoonIcon, SunIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { useTheme } from '@/components/theme-provider'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { t } = useTranslation()
  const { toggleTheme } = useTheme()

  return (
    <Button variant="ghost" size="icon" aria-label={t('header.theme')} onClick={toggleTheme}>
      <SunIcon className="hidden dark:block" />
      <MoonIcon className="dark:hidden" />
    </Button>
  )
}
