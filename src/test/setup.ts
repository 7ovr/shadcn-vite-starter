import "@testing-library/jest-dom/vitest"
import { cleanup } from "@testing-library/react"
import { afterEach, vi } from "vitest"

import { resetWaitlist } from "@/features/waitlist/api"

// jsdom has no matchMedia, which the theme provider reads for the system scheme.
vi.stubGlobal(
  "matchMedia",
  vi.fn((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
)

afterEach(() => {
  cleanup()
  resetWaitlist()
  localStorage.clear()
})
