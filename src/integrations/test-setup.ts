import '@testing-library/jest-dom/vitest'
import { cleanup, configure } from '@testing-library/react'
import i18n from 'i18next'
import ICU from 'i18next-icu'
import { initReactI18next } from 'react-i18next'
import { afterEach, vi } from 'vitest'

import en from '@locales/en.json'
import pl from '@locales/pl.json'
import { baseI18nOptions } from '@/integrations/i18n'

// Tests call the real PokeAPI, so give network-backed queries time to settle.
configure({ asyncUtilTimeout: 10_000 })

function noop() {}

// jsdom has no matchMedia, which the theme provider reads for the system scheme.
vi.stubGlobal('matchMedia', (query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener: noop,
  removeEventListener: noop,
  addListener: noop,
  removeListener: noop,
  dispatchEvent: () => false,
}))

// Tests bundle the catalogs, since there is no server to load them from.
await i18n
  .use(ICU)
  .use(initReactI18next)
  .init({
    ...baseI18nOptions,
    lng: 'en',
    resources: { en: { translation: en }, pl: { translation: pl } },
  })

afterEach(async () => {
  cleanup()
  vi.restoreAllMocks()
  localStorage.clear()
  await i18n.changeLanguage('en')
})
