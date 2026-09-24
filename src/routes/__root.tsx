import type { QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { HeadContent, Link, Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { SearchXIcon } from 'lucide-react'

import { AppShell } from '@/components/app-shell-1'
import { RouteError } from '@/components/route-error'
import { PageState } from '@/components/state-view'
import { buttonVariants } from '@/components/ui/button'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useIsMobile } from '@/hooks/use-mobile'
import { pageMeta } from '@/lib/meta'

export type RouterContext = {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () =>
    pageMeta({
      description:
        'A Vite and React starter with TanStack, shadcn/ui on Base UI and strict TypeScript, set up for 7Ovr blocks.',
    }),
  component: RootLayout,
  notFoundComponent: NotFound,
  errorComponent: RootError,
})

// Both devtools render nothing outside development, so production builds drop them.
function RootLayout() {
  // Their floating buttons would cover the header and the page on a phone.
  const isMobile = useIsMobile()
  return (
    <TooltipProvider>
      <HeadContent />
      <AppShell>
        <Outlet />
      </AppShell>
      {isMobile ? null : (
        <>
          <TanStackRouterDevtools position="top-right" />
          <ReactQueryDevtools buttonPosition="bottom-right" />
        </>
      )}
    </TooltipProvider>
  )
}

function NotFound() {
  return (
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
  )
}

function RootError() {
  return (
    <main className="mx-auto w-full max-w-md px-4">
      <RouteError />
    </main>
  )
}
