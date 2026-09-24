import { QueryClientProvider } from '@tanstack/react-query'
import {
  Outlet,
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { RouteError } from '@/components/route-error'
import { createTestQueryClient } from '@/lib/test-utils'

// A one-route app whose loader fails once, then succeeds.
function renderFailingRoute() {
  const loader = vi
    .fn<() => Promise<string>>()
    .mockRejectedValueOnce(new Error('Offline'))
    .mockResolvedValue('Loaded')
  const rootRoute = createRootRoute({ component: Outlet })
  const pageRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    loader,
    component: function Page() {
      return <p>{String(pageRoute.useLoaderData())}</p>
    },
  })
  const router = createRouter({
    routeTree: rootRoute.addChildren([pageRoute]),
    history: createMemoryHistory({ initialEntries: ['/'] }),
    defaultErrorComponent: RouteError,
  })
  render(
    <QueryClientProvider client={createTestQueryClient()}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
  return { loader }
}

describe('RouteError', () => {
  it('shows the failure and re-runs the loader on Try Again', async () => {
    const user = userEvent.setup()
    const { loader } = renderFailingRoute()

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Something Went Wrong' }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Try Again' }))

    expect(await screen.findByText('Loaded')).toBeInTheDocument()
    expect(loader).toHaveBeenCalledTimes(2)
  })
})
