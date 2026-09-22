import { useSuspenseQuery } from '@tanstack/react-query'
import {
  createColumnHelper,
  createSortedRowModel,
  rowSortingFeature,
  sortFns,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import { ChevronDownIcon, ChevronUpIcon, ChevronsUpDownIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import type { WaitlistEntry } from '@/features/waitlist/api'
import { waitlistQueryOptions } from '@/features/waitlist/queries'

// Features and columns live at module scope so the table keeps stable references.
const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
})

const column = createColumnHelper<typeof features, WaitlistEntry>()

const columns = column.columns([
  column.accessor('name', { header: 'Name' }),
  column.accessor('email', { header: 'Email' }),
])

const SORT_LABEL = { asc: 'ascending', desc: 'descending' } as const

export function WaitlistTable() {
  const { data } = useSuspenseQuery(waitlistQueryOptions)
  const table = useTable({ features, columns, data })

  return (
    <Table aria-label="Waitlist">
      <TableHeader>
        {table.getHeaderGroups().map((group) => (
          <TableRow key={group.id}>
            {group.headers.map((header) => {
              const sorted = header.column.getIsSorted()
              const SortIcon =
                sorted === 'asc'
                  ? ChevronUpIcon
                  : sorted === 'desc'
                    ? ChevronDownIcon
                    : ChevronsUpDownIcon
              return (
                <TableHead key={header.id} aria-sort={sorted ? SORT_LABEL[sorted] : 'none'}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <table.FlexRender header={header} />
                    <SortIcon data-icon="inline-end" aria-hidden="true" />
                  </Button>
                </TableHead>
              )
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getAllCells().map((cell) => (
              <TableCell key={cell.id}>
                <table.FlexRender cell={cell} />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
