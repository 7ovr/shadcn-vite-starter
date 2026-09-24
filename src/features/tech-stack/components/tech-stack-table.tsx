import {
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createSortedRowModel,
  filterFns,
  globalFilteringFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import {
  ExternalLinkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  SearchIcon,
  SearchXIcon,
} from 'lucide-react'
import { useState } from 'react'

import { IconTile } from '@/components/icon-tile'
import type { BrandMark } from '@/components/icons'
import { SectionState } from '@/components/state-view'
import { TableColGroup } from '@/components/table-columns'
import { Button, buttonVariants } from '@/components/ui/button'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TECH_STACK } from '@/features/tech-stack/lib/tech-stack'

// Rows hold plain values only; a component in the row type sends TanStack's key inference too deep.
type ToolRow = { name: string; description: string; href: string; area: string }

const ROWS: ToolRow[] = TECH_STACK.flatMap((group) =>
  group.tools.map(({ name, description, href }) => ({
    name,
    description,
    href,
    area: group.title,
  })),
)

const MARKS = new Map<string, BrandMark>(
  TECH_STACK.flatMap((group) => group.tools.map((tool) => [tool.name, tool.Mark] as const)),
)

const ALL = 'All'
const AREAS = [ALL, ...TECH_STACK.map((group) => group.title)]

// Features and columns live at module scope so the table keeps stable references.
const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns,
  sortFns,
})

const column = createColumnHelper<typeof features, ToolRow>()

const columns = column.columns([
  column.accessor('name', {
    header: 'Tool',
    meta: { width: 'w-48 max-sm:w-auto' },
    cell: ({ row }) => {
      const Mark = MARKS.get(row.original.name)
      return (
        <div className="flex min-w-0 items-center gap-2.5">
          <IconTile size="sm">{Mark ? <Mark aria-hidden="true" /> : null}</IconTile>
          <span className="truncate font-medium">{row.original.name}</span>
        </div>
      )
    },
  }),
  column.accessor('description', {
    header: 'What It Does',
    enableSorting: false,
    meta: { hideOnMobile: true },
    cell: (info) => (
      <span className="block truncate text-soft-foreground" title={info.getValue()}>
        {info.getValue()}
      </span>
    ),
  }),
  column.accessor('area', {
    header: 'Area',
    filterFn: 'equalsString',
    meta: { width: 'w-32', hideOnMobile: true },
    cell: (info) => <span className="text-muted-foreground">{info.getValue()}</span>,
  }),
  column.display({
    id: 'docs',
    header: () => <span className="sr-only">Docs</span>,
    meta: { width: 'w-12' },
    cell: ({ row }) => (
      <a
        href={row.original.href}
        target="_blank"
        rel="noreferrer"
        aria-label={`${row.original.name} Docs`}
        className={buttonVariants({ variant: 'ghost', size: 'icon-sm' })}
      >
        <ExternalLinkIcon aria-hidden="true" />
      </a>
    ),
  }),
])

// Fixed widths keep the columns still while filters change; What It Does takes the rest.
const COLUMN_LAYOUT = columns.map((definition) => definition.meta ?? {})

const SORT_LABEL = { asc: 'ascending', desc: 'descending' } as const

export function TechStackTable() {
  const [area, setArea] = useState(ALL)
  const [query, setQuery] = useState('')

  const table = useTable({
    features,
    columns,
    data: ROWS,
    state: {
      globalFilter: query,
      columnFilters: area === ALL ? [] : [{ id: 'area', value: area }],
    },
    globalFilterFn: 'includesString',
    sortDescFirst: false,
  })

  const rows = table.getRowModel().rows

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Tabs value={area} onValueChange={(value) => setArea(String(value))}>
            <TabsList variant="pill" aria-label="Area">
              {AREAS.map((name) => (
                <TabsTrigger key={name} value={name}>
                  {name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        <div className="w-full sm:w-56">
          <InputGroup>
            <InputGroupAddon>
              <SearchIcon aria-hidden="true" />
            </InputGroupAddon>
            <InputGroupInput
              type="search"
              aria-label="Search Tools"
              placeholder="Search Tools"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </InputGroup>
        </div>
      </div>

      {rows.length === 0 ? (
        <SectionState
          icon={SearchXIcon}
          title="No Matching Tools"
          description="Try another search or area."
          action={
            <Button
              onClick={() => {
                setQuery('')
                setArea(ALL)
              }}
            >
              Clear Filters
            </Button>
          }
        />
      ) : (
        <Table layout="fixed" aria-label="Tech Stack">
          <TableColGroup columns={COLUMN_LAYOUT} />
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => {
                  const sorted = header.column.getIsSorted()
                  const SortIcon = sorted === 'desc' ? ChevronDownIcon : ChevronUpIcon
                  return (
                    <TableHead
                      key={header.id}
                      hideOnMobile={header.column.columnDef.meta?.hideOnMobile}
                      aria-sort={
                        header.column.getCanSort()
                          ? sorted
                            ? SORT_LABEL[sorted]
                            : 'none'
                          : undefined
                      }
                    >
                      {header.column.getCanSort() ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className="flex items-center gap-1 transition-colors hover:text-foreground"
                        >
                          <table.FlexRender header={header} />
                          {sorted ? <SortIcon className="size-3.5" aria-hidden="true" /> : null}
                        </button>
                      ) : (
                        <table.FlexRender header={header} />
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                {row.getAllCells().map((cell) => (
                  <TableCell key={cell.id} hideOnMobile={cell.column.columnDef.meta?.hideOnMobile}>
                    <table.FlexRender cell={cell} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
