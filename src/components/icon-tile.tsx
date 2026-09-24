import { cn } from '@/lib/utils'

// The filled square that holds a list item's icon or brand mark.
export function IconTile({
  size = 'default',
  tone = 'muted',
  children,
}: {
  size?: 'sm' | 'default' | 'lg'
  tone?: 'muted' | 'secondary'
  children: React.ReactNode
}) {
  return (
    <span
      className={cn(
        'grid shrink-0 place-items-center overflow-hidden rounded-lg [&_svg]:size-4',
        tone === 'secondary'
          ? 'bg-secondary text-secondary-foreground'
          : 'bg-muted text-soft-foreground',
        size === 'lg' ? 'size-10' : size === 'sm' ? 'size-7 rounded-md' : 'size-8',
      )}
    >
      {children}
    </span>
  )
}
