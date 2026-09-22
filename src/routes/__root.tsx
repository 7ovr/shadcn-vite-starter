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
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()

  return (
    <main className="mx-auto w-full max-w-md px-4">
      <PageState
        icon={SearchXIcon}
        title={t('notFound.title')}
        description={t('notFound.description')}
        action={
          <Link to="/" className={buttonVariants()}>
            {t('notFound.backHome')}
          </Link>
        }
      />
    </main>
  )
}

function RootError({ reset }: ErrorComponentProps) {
  const { t } = useTranslation()

  return (
    <main role="alert" className="mx-auto w-full max-w-md px-4">
      <PageState
        icon={TriangleAlertIcon}
        title={t('error.title')}
        description={t('error.description')}
        action={
          <Button variant="outline" onClick={reset}>
            {t('error.retry')}
          </Button>
        }
      />
    </main>
  )
}
