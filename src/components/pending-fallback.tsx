import { Skeleton } from '@/components/ui/skeleton'

export function PendingFallback() {
  return (
    <div role="status" className="flex flex-col gap-3">
      <span className="sr-only">Loading</span>
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
