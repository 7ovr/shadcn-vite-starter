import { useEffect } from 'react'
import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import type { ErrorComponentProps } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'

export function ErrorFallback({ reset }: ErrorComponentProps) {
  const { t } = useTranslation()
  const queryErrorResetBoundary = useQueryErrorResetBoundary()

  // Clear the failed query so retrying fetches again instead of rethrowing the cached error.
  useEffect(() => {
    queryErrorResetBoundary.reset()
  }, [queryErrorResetBoundary])

  return (
    <div role="alert" className="flex flex-col items-start gap-3">
      <p className="font-medium">{t('error.title')}</p>
      <p className="text-sm text-muted-foreground">{t('error.description')}</p>
      <Button variant="outline" onClick={reset}>
        {t('error.retry')}
      </Button>
    </div>
  )
}
