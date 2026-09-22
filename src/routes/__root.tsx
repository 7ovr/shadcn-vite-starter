import type { QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { HeadContent, Link, Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { SearchXIcon } from 'lucide-react'

import { PageState } from '@/components/page-state'
import { RouteError } from '@/components/route-error'
import { SiteHeader } from '@/components/site-header'
import { buttonVariants } from '@/components/ui/button'

export type RouterContext = {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({ meta: [{ title: 'Starter' }] }),
  component: RootLayout,
  notFoundComponent: NotFound,
  errorComponent: RootError,
})

// Both devtools render nothing outside development, so production builds drop them.
function RootLayout() {
  return (
    <>
      <HeadContent />
      <SiteHeader />
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
      <ReactQueryDevtools buttonPosition="bottom-left" />
    </>
  )
}

function NotFound() {
  return (
    <main className="mx-auto w-full max-w-md px-4">
      <PageState
        icon={SearchXIcon}
        title="Page Not Found"
        description="The page you are looking for does not exist or has moved."
        action={
          <Link to="/" className={buttonVariants()}>
            Back Home
          </Link>
        }
      />
    </main>
  )
}

function RootError() {
  return (
    <main className="mx-auto w-full max-w-md px-4">
      <RouteError />
    </main>
  )
}
