import type { QueryClient } from '@tanstack/react-query'
import { createRouter, type RouterHistory } from '@tanstack/react-router'

import { RouteError } from '@/components/route-error'
import { queryClient as appQueryClient } from '@/integrations/query-client'
import { routeTree } from '@/route-tree.gen'

export function createAppRouter({
  queryClient,
  history,
}: {
  queryClient: QueryClient
  history?: RouterHistory
}) {
  return createRouter({
    routeTree,
    context: { queryClient },
    history,
    defaultPreload: 'intent',
    // Loaders always run on preload; Query decides whether the cached data is still fresh.
    defaultPreloadStaleTime: 0,
    scrollRestoration: true,
    // Each route catches its own errors, so the layout and header stay on screen.
    defaultErrorComponent: RouteError,
  })
}

export const router = createAppRouter({ queryClient: appQueryClient })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
