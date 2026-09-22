import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'cn'

const skeletonVariants = cva('animate-pulse rounded-md bg-muted', {
  variants: {
    fill: {
      true: 'size-full',
      false: '',
    },
  },
  defaultVariants: {
    fill: false,
  },
})

function Skeleton({
  className,
  fill,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof skeletonVariants>) {
  return (
    <div data-slot="skeleton" className={cn(skeletonVariants({ fill }), className)} {...props} />
  )
}

export { Skeleton, skeletonVariants }
