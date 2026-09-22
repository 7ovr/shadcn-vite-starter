import { useTranslation } from 'react-i18next'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SUPPORTED_LANGUAGES } from '@/lib/config'

const ITEMS = SUPPORTED_LANGUAGES.map((language) => ({
  value: language.code,
  label: language.name,
}))

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation()

  return (
    <Select
      items={ITEMS}
      value={i18n.resolvedLanguage}
      onValueChange={(code) => {
        if (code) void i18n.changeLanguage(code)
      }}
    >
      <SelectTrigger size="sm" aria-label={t('header.language')}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ITEMS.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
