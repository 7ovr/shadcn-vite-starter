import { createContext } from 'react'

export type Theme = 'dark' | 'light' | 'system'
export type ResolvedTheme = 'dark' | 'light'

export type ThemeContextValue = {
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

// The inline script in index.html reads the same key, so the first paint matches React.
export const THEME_STORAGE_KEY = 'theme'

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

const THEME_VALUES = new Set<string>(['dark', 'light', 'system'])

export function isTheme(value: string | null): value is Theme {
  return value !== null && THEME_VALUES.has(value)
}

// Storage can be blocked or full; the theme then lives in memory for the session.
export function readStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    return isTheme(stored) ? stored : 'system'
  } catch {
    return 'system'
  }
}

export function writeStoredTheme(theme: Theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Keep the in-memory choice when storage is unavailable.
  }
}
