import { lazy, Suspense } from 'react'
import type { QueryClient } from '@tanstack/react-query'
import { Link, Outlet, createRootRouteWithContext } from '@tanstack/react-router'

import { SiteHeader } from '@/components/site-header'
import { buttonVariants } from '@/components/ui/button'

export type RouterContext = {
  queryClient: QueryClient
}

// Loaded only in development, so the devtools never reach the production bundle.
const Devtools =
  import.meta.env.DEV && import.meta.env.MODE !== 'test'
    ? lazy(() => import('@/components/devtools'))
    : () => null

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
  notFoundComponent: NotFound,
})

function RootLayout() {
  return (
    <>
      <SiteHeader />
      <Outlet />
      <Suspense>
        <Devtools />
      </Suspense>
    </>
  )
}

function NotFound() {
  return (
    <main className="mx-auto flex max-w-md flex-col items-center justify-center gap-4 px-4 py-32 text-center">
      <h1 className="font-heading text-2xl font-semibold">Page Not Found</h1>
      <p className="text-sm text-muted-foreground">
        The page you are looking for does not exist or has moved.
      </p>
      <Link to="/" className={buttonVariants()}>
        Back Home
      </Link>
    </main>
  )
}
