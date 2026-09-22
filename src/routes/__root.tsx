import { lazy, Suspense } from 'react'
import type { QueryClient } from '@tanstack/react-query'
import { Link, Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { ErrorFallback } from '@/components/error-fallback'
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
  errorComponent: RootError,
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
  const { t } = useTranslation()

  return (
    <main className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-32 text-center">
      <h1 className="font-heading text-2xl font-semibold">{t('notFound.title')}</h1>
      <p className="text-sm text-muted-foreground">{t('notFound.description')}</p>
      <Link to="/" className={buttonVariants()}>
        {t('notFound.backHome')}
      </Link>
    </main>
  )
}

function RootError(props: React.ComponentProps<typeof ErrorFallback>) {
  return (
    <main className="mx-auto max-w-md px-4 py-32">
      <ErrorFallback {...props} />
    </main>
  )
}
