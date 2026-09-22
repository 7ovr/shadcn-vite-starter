import { useTranslation } from 'react-i18next'

import { Skeleton } from '@/components/ui/skeleton'

export function PendingFallback() {
  const { t } = useTranslation()

  return (
    <div role="status" aria-label={t('pending.label')} className="flex flex-col gap-3">
      <div className="h-8 w-full">
        <Skeleton fill />
      </div>
      <div className="h-8 w-full">
        <Skeleton fill />
      </div>
      <div className="h-8 w-2/3">
        <Skeleton fill />
      </div>
    </div>
  )
}
