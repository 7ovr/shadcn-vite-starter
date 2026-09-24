import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { ThemeProvider } from '@/components/theme-provider'
import { useTheme } from '@/hooks/use-theme'
import { THEME_STORAGE_KEY } from '@/lib/theme'

function ThemeProbe() {
  const { resolvedTheme, toggleTheme } = useTheme()
  return (
    <button type="button" onClick={toggleTheme}>
      {resolvedTheme}
    </button>
  )
}

function setup() {
  render(
    <ThemeProvider>
      <ThemeProbe />
      <input aria-label="Notes" />
    </ThemeProvider>,
  )
  return userEvent.setup()
}

const isDark = () => document.documentElement.classList.contains('dark')

const mockSystemDark = () =>
  vi.spyOn(window, 'matchMedia').mockImplementation(
    (query: string) =>
      ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
      }) as unknown as MediaQueryList,
  )

describe('ThemeProvider', () => {
  it('follows a light system theme when nothing is saved', () => {
    setup()

    expect(isDark()).toBe(false)
    expect(screen.getByRole('button')).toHaveTextContent('light')
  })

  it('follows a dark system theme when nothing is saved', () => {
    mockSystemDark()
    setup()

    expect(isDark()).toBe(true)
    expect(screen.getByRole('button')).toHaveTextContent('dark')
  })

  it('toggles and remembers the choice', async () => {
    const user = setup()

    await user.click(screen.getByRole('button'))

    expect(isDark()).toBe(true)
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')
  })

  it('restores a saved theme', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'dark')
    setup()

    expect(isDark()).toBe(true)
  })

  it('toggles with the d key, but not while typing or with a modifier', async () => {
    const user = setup()

    await user.keyboard('d')
    expect(isDark()).toBe(true)

    await user.keyboard('{Shift>}D{/Shift}')
    expect(isDark()).toBe(true)

    await user.click(screen.getByRole('textbox', { name: 'Notes' }))
    await user.keyboard('d')
    expect(isDark()).toBe(true)
  })

  it('keeps working when storage is blocked', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('Blocked', 'SecurityError')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Blocked', 'SecurityError')
    })
    const user = setup()

    await user.click(screen.getByRole('button'))

    expect(isDark()).toBe(true)
  })

  it('follows a change made in another tab', () => {
    setup()

    act(() => {
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: THEME_STORAGE_KEY,
          newValue: 'dark',
          storageArea: localStorage,
        }),
      )
    })

    expect(isDark()).toBe(true)
  })
})
