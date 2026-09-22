import i18n, { type InitOptions } from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import HttpBackend from 'i18next-http-backend'
import ICU from 'i18next-icu'
import { initReactI18next } from 'react-i18next'

import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '@/lib/config'

// Keys are flat strings like "pokemon.title", so dots and colons are never separators.
export const baseI18nOptions = {
  supportedLngs: SUPPORTED_LANGUAGES.map((language) => language.code),
  fallbackLng: DEFAULT_LANGUAGE,
  load: 'languageOnly',
  keySeparator: false,
  nsSeparator: false,
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
} satisfies InitOptions

function applyDocumentLanguage(code: string | undefined) {
  const language = SUPPORTED_LANGUAGES.find((entry) => entry.code === code)
  if (!language) return
  document.documentElement.lang = language.code
  document.documentElement.dir = language.dir
}

export async function initI18n() {
  await i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(ICU)
    .use(initReactI18next)
    .init({
      ...baseI18nOptions,
      backend: { loadPath: '/locales/{{lng}}.json' },
      detection: {
        order: ['localStorage', 'navigator'],
        lookupLocalStorage: 'language',
        caches: ['localStorage'],
      },
    })
  applyDocumentLanguage(i18n.resolvedLanguage)
  i18n.on('languageChanged', applyDocumentLanguage)
}

export { i18n }
