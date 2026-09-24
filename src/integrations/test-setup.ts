import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'

import { installFakePokeApi } from '@/features/pokemon/api/fake-poke-api'

function noop() {}

// jsdom lacks these browser APIs, which the router, the theme and the command menu use.
vi.stubGlobal('scrollTo', noop)
Element.prototype.scrollIntoView = noop
vi.stubGlobal(
  'ResizeObserver',
  class {
    observe() {}
    unobserve() {}
    disconnect() {}
  },
)
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

// Every test gets the fake PokeAPI; a test that needs a failure overrides it with its own spy.
beforeEach(() => {
  installFakePokeApi()
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  localStorage.clear()
})
