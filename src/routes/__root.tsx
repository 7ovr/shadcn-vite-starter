import type { QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {
  Link,
  Outlet,
  createRootRouteWithContext,
  type ErrorComponentProps,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { SearchXIcon, TriangleAlertIcon } from 'lucide-react'

import { PageState } from '@/components/page-state'
import { SiteHeader } from '@/components/site-header'
import { Button, buttonVariants } from '@/components/ui/button'

export type RouterContext = {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
  notFoundComponent: NotFound,
  errorComponent: RootError,
})

// Both devtools render nothing outside development, so production builds drop them.
function RootLayout() {
  return (
    <>
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

function RootError({ reset }: ErrorComponentProps) {
  return (
    <main role="alert" className="mx-auto w-full max-w-md px-4">
      <PageState
        icon={TriangleAlertIcon}
        title="Something Went Wrong"
        description="This page could not load. Check your connection and try again."
        action={
          <Button variant="outline" onClick={reset}>
            Try Again
          </Button>
        }
      />
    </main>
  )
}
