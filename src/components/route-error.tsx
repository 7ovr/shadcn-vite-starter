import { useEffect } from 'react'
import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { TriangleAlertIcon } from 'lucide-react'

import { PageState } from '@/components/page-state'
import { Button } from '@/components/ui/button'

// A route whose loader or render failed. Retrying reloads the route, which re-runs its loader.
export function RouteError() {
  const router = useRouter()
  const queryErrorResetBoundary = useQueryErrorResetBoundary()

  useEffect(() => {
    queryErrorResetBoundary.reset()
  }, [queryErrorResetBoundary])

  return (
    <div role="alert">
      <PageState
        icon={TriangleAlertIcon}
        title="Something Went Wrong"
        description="This page could not load. Check your connection and try again."
        action={
          <Button variant="outline" onClick={() => void router.invalidate()}>
            Try Again
          </Button>
        }
      />
    </div>
  )
}
