import { Skeleton } from '@/components/ui/skeleton'

export function PendingFallback() {
  return (
    <div role="status" aria-label="Loading" className="flex flex-col gap-3">
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
