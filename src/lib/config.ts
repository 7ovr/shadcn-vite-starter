export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', dir: 'ltr' },
  { code: 'pl', name: 'Polski', dir: 'ltr' },
] as const

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]['code']

export const DEFAULT_LANGUAGE: LanguageCode = 'en'

// The example feature reads the free PokeAPI; set VITE_API_URL=/api to use your own backend.
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://pokeapi.co/api/v2'
