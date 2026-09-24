import type { CellData, RowData, TableFeatures } from '@tanstack/react-table'

import { cn } from '@/lib/utils'

// Per-column layout for our tables, read by TableColGroup and by the header and body cells.
export type ColumnLayout = {
  // A Tailwind width class for the column, such as w-24; columns without one share the rest.
  width?: string
  // Phones skip this column, so the table fits without scrolling sideways.
  hideOnMobile?: boolean
}

declare module '@tanstack/react-table' {
  // Declaration merging must repeat the library's own type parameters, even the unused ones.
  interface ColumnMeta<
    in out TFeatures extends TableFeatures,
    in out TData extends RowData,
    TValue extends CellData = CellData,
  > extends ColumnLayout {}
}

// Fixed-layout tables take their widths from here, so paging never makes the columns jump.
export function TableColGroup({ columns }: { columns: readonly ColumnLayout[] }) {
  return (
    <colgroup>
      {columns.map((column, index) => (
        <col
          // Columns never reorder, so their position is a stable key.
          // oxlint-disable-next-line react/no-array-index-key
          key={index}
          className={cn(column.width, column.hideOnMobile && 'max-sm:hidden')}
        />
      ))}
    </colgroup>
  )
}
