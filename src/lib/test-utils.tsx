import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createMemoryHistory } from '@tanstack/react-router'
import { render, screen, within } from '@testing-library/react'
import type { UserEvent } from '@testing-library/user-event'
import { vi } from 'vitest'

import { ThemeProvider } from '@/components/theme-provider'
import { createAppRouter } from '@/integrations/router'

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
}

// Renders the real route tree at a path, the way the app boots in index.tsx.
export async function renderRoute(path: string) {
  const queryClient = createTestQueryClient()
  const router = createAppRouter({
    queryClient,
    history: createMemoryHistory({ initialEntries: [path] }),
  })
  await router.load()

  const view = render(
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>,
  )

  return { ...view, router, queryClient }
}

// A table's rows without its header row.
export const bodyRows = (table: HTMLElement) => within(table).getAllByRole('row').slice(1)

// Makes every max-width media query match, so the app lays out as on a phone.
export function mockPhoneViewport() {
  vi.spyOn(window, 'matchMedia').mockImplementation(
    (query: string) =>
      ({
        matches: query.includes('max-width'),
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
      }) as unknown as MediaQueryList,
  )
}

export async function openCommandMenu(user: UserEvent) {
  await screen.findByRole('heading', { level: 1 })
  await user.keyboard('{Control>}k{/Control}')
  return screen.findByRole('dialog')
}

export async function openIssueDialog(user: UserEvent) {
  await user.click(await screen.findByRole('button', { name: 'Report An Issue' }))
  return screen.findByRole('dialog', { name: 'Report An Issue' })
}
