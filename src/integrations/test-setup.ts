import '@testing-library/jest-dom/vitest'
import { cleanup, configure } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// Tests call the real PokeAPI, so give network-backed queries time to settle.
configure({ asyncUtilTimeout: 10_000 })

function noop() {}

// jsdom has neither scrollTo nor matchMedia, which the router and the theme provider use.
vi.stubGlobal('scrollTo', noop)
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
  vi.restoreAllMocks()
  localStorage.clear()
})
