import { useEffect } from 'react'
import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import type { ErrorComponentProps } from '@tanstack/react-router'
import { TriangleAlertIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

export function ErrorFallback({ reset }: ErrorComponentProps) {
  const queryErrorResetBoundary = useQueryErrorResetBoundary()

  // Clear the failed query so retrying fetches again instead of rethrowing the cached error.
  useEffect(() => {
    queryErrorResetBoundary.reset()
  }, [queryErrorResetBoundary])

  return (
    <div role="alert">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <TriangleAlertIcon aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>Something Went Wrong</EmptyTitle>
          <EmptyDescription>
            This section could not load. Check your connection and try again.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline" onClick={reset}>
            Try Again
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}
