import { cn } from 'cn'
import * as React from 'react'

function Table({
  className,
  layout = 'auto',
  ...props
}: React.ComponentProps<'table'> & { layout?: 'auto' | 'fixed' }) {
  return (
    <div data-slot="table-container" className="relative w-full overflow-x-auto">
      <table
        data-slot="table"
        data-layout={layout}
        className={cn('w-full caption-bottom text-sm data-[layout=fixed]:table-fixed', className)}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<'thead'>) {
  return <thead data-slot="table-header" className={cn('[&_tr]:border-b', className)} {...props} />
}

function TableBody({ className, ...props }: React.ComponentProps<'tbody'>) {
  return (
    <tbody
      data-slot="table-body"
      className={cn('[&_tr:last-child]:border-0', className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<'tfoot'>) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn('border-t bg-muted/50 font-medium [&>tr]:last:border-b-0', className)}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<'tr'>) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        'border-b transition-colors hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted',
        className,
      )}
      {...props}
    />
  )
}

function TableHead({
  className,
  hideOnMobile = false,
  ...props
}: React.ComponentProps<'th'> & { hideOnMobile?: boolean }) {
  return (
    <th
      data-slot="table-head"
      data-hide-mobile={hideOnMobile || undefined}
      className={cn(
        'h-10 px-2 text-left align-middle text-xs font-normal whitespace-nowrap text-muted-foreground data-hide-mobile:max-sm:hidden [&:has([role=checkbox])]:pr-0',
        className,
      )}
      {...props}
    />
  )
}

function TableCell({
  className,
  hideOnMobile = false,
  ...props
}: React.ComponentProps<'td'> & { hideOnMobile?: boolean }) {
  return (
    <td
      data-slot="table-cell"
      data-hide-mobile={hideOnMobile || undefined}
      className={cn(
        'p-2 align-middle whitespace-nowrap data-hide-mobile:max-sm:hidden [&:has([role=checkbox])]:pr-0',
        className,
      )}
      {...props}
    />
  )
}

function TableCaption({ className, ...props }: React.ComponentProps<'caption'>) {
  return (
    <caption
      data-slot="table-caption"
      className={cn('mt-4 text-sm text-muted-foreground', className)}
      {...props}
    />
  )
}

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption }
