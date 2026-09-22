import type { QueryClient } from '@tanstack/react-query'
import { createRouter, type RouterHistory } from '@tanstack/react-router'

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
  })
}

export const router = createAppRouter({ queryClient: appQueryClient })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
