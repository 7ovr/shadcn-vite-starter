import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

import { resetWaitlist } from '@/features/waitlist/api'

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

afterEach(() => {
  cleanup()
  resetWaitlist()
  localStorage.clear()
})
