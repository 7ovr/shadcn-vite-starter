import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { ThemeProvider } from '@/components/theme-provider'
import { ThemeToggle } from '@/components/theme-toggle'
import { THEME_STORAGE_KEY } from '@/lib/theme'

function renderToggle() {
  render(
    <ThemeProvider>
      <ThemeToggle />
      <input aria-label="Notes" />
    </ThemeProvider>,
  )
  return userEvent.setup()
}

const isDark = () => document.documentElement.classList.contains('dark')

describe('theme provider', () => {
  it('follows the system theme when nothing is saved', () => {
    renderToggle()

    expect(isDark()).toBe(false)
  })

  it('toggles with the button and remembers the choice', async () => {
    const user = renderToggle()

    await user.click(screen.getByRole('button', { name: 'Toggle Theme' }))

    expect(isDark()).toBe(true)
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')
  })

  it('restores a saved theme', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'dark')
    renderToggle()

    expect(isDark()).toBe(true)
  })

  it('toggles with the d key, but not while typing or with a modifier', async () => {
    const user = renderToggle()

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
    const user = renderToggle()

    await user.click(screen.getByRole('button', { name: 'Toggle Theme' }))

    expect(isDark()).toBe(true)
  })

  it('follows a change made in another tab', () => {
    renderToggle()

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
