import { useSuspenseQuery } from '@tanstack/react-query'
import {
  createColumnHelper,
  createPaginatedRowModel,
  createSortedRowModel,
  rowPaginationFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import { Link } from '@tanstack/react-router'
import { ChevronDownIcon, ChevronUpIcon, ChevronsUpDownIcon, InboxIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { pokemonListOptions } from '@/features/pokemon/api/queries'
import type { PokemonSummary } from '@/features/pokemon/lib/types'
import { formatPokedexNumber, toTitleCase } from '@/features/pokemon/lib/format'

// Features and columns live at module scope so the table keeps stable references.
const features = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns,
})

const column = createColumnHelper<typeof features, PokemonSummary>()

const columns = column.columns([
  column.accessor('id', {
    header: 'No.',
    cell: (info) => formatPokedexNumber(info.getValue()),
  }),
  column.accessor('name', {
    header: 'Name',
    cell: (info) => (
      <Link
        to="/pokemon/$name"
        params={{ name: info.getValue() }}
        className="font-medium underline-offset-4 hover:underline"
      >
        {toTitleCase(info.getValue())}
      </Link>
    ),
  }),
])

const PAGE_SIZE = 10

const SORT_LABEL = { asc: 'ascending', desc: 'descending' } as const

export function PokemonTable() {
  const { data } = useSuspenseQuery(pokemonListOptions())
  const table = useTable({
    features,
    columns,
    data,
    initialState: { pagination: { pageIndex: 0, pageSize: PAGE_SIZE } },
  })

  if (data.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <InboxIcon aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>No Pokémon Yet</EmptyTitle>
          <EmptyDescription>
            The list is empty. Check back once the Pokédex has entries.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <Table aria-label="Pokémon">
        <TableCaption>{`${data.length} Pokémon in total.`}</TableCaption>
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

      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          Page {table.state.pagination.pageIndex + 1} of {table.getPageCount()}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
