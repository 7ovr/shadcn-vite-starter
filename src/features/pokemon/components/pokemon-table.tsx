import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  createColumnHelper,
  rowPaginationFeature,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import { ChevronLeftIcon, ChevronRightIcon, CircleAlertIcon, SearchXIcon } from 'lucide-react'

import { IconTile } from '@/components/icon-tile'
import { SectionState } from '@/components/state-view'
import { TableColGroup } from '@/components/table-columns'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from '@/components/ui/pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { pokemonPageOptions } from '@/features/pokemon/api/queries'
import { toTitleCase } from '@/features/pokemon/lib/format'
import {
  DEFAULT_PAGE_SIZE,
  PAGE_SIZES,
  type PageSize,
  type Pokemon,
  isPageSize,
} from '@/features/pokemon/lib/types'
import { useIsMobile } from '@/hooks/use-mobile'
import { pageRange } from '@/lib/page-range'

const SIZE_ITEMS = PAGE_SIZES.map((size) => ({ value: size, label: String(size) }))

// A router Link styled as a button: Base UI's Button would give the anchor role="button".
function PageLink({
  page,
  isActive = false,
  label,
  children,
}: {
  page: number
  isActive?: boolean
  label: string
  children: React.ReactNode
}) {
  return (
    <Link
      to="/"
      search={(prev) => ({ ...prev, page: page > 1 ? page : undefined })}
      activeOptions={{ exact: true, includeSearch: true }}
      activeProps={{ 'aria-current': 'page' }}
      resetScroll={false}
      aria-label={label}
      className={buttonVariants({
        variant: isActive ? 'secondary' : 'ghost',
        size: 'icon-sm',
      })}
    >
      {children}
    </Link>
  )
}

// At either end there is nowhere to go, so render a disabled button rather than a link.
function StepLink({
  page,
  disabled,
  label,
  children,
}: {
  page: number
  disabled: boolean
  label: string
  children: React.ReactNode
}) {
  if (disabled) {
    return (
      <Button variant="ghost" size="icon-sm" disabled aria-label={label}>
        {children}
      </Button>
    )
  }
  return (
    <PageLink page={page} label={label}>
      {children}
    </PageLink>
  )
}

const features = tableFeatures({ rowPaginationFeature })

const column = createColumnHelper<typeof features, Pokemon>()

const columns = column.columns([
  column.accessor('name', {
    header: 'Pokémon',
    cell: ({ row }) => (
      <div className="flex min-w-0 items-center gap-2.5">
        <IconTile>
          {row.original.spriteUrl ? (
            <img
              src={row.original.spriteUrl}
              alt=""
              width={32}
              height={32}
              loading="lazy"
              decoding="async"
              className="size-8"
            />
          ) : null}
        </IconTile>
        <span className="truncate font-medium">{toTitleCase(row.original.name)}</span>
      </div>
    ),
  }),
  column.accessor('types', {
    header: 'Types',
    meta: { width: 'w-40', hideOnMobile: true },
    cell: (info) => (
      <div className="flex gap-1">
        {info.getValue().map((type) => (
          <Badge key={type} variant="subtle">
            {toTitleCase(type)}
          </Badge>
        ))}
      </div>
    ),
  }),
  column.accessor('abilities', {
    header: 'Abilities',
    meta: { width: 'w-52', hideOnMobile: true },
    cell: (info) => {
      const abilities = info
        .getValue()
        .map((ability) => toTitleCase(ability))
        .join(', ')
      return (
        <span className="block truncate text-soft-foreground" title={abilities}>
          {abilities}
        </span>
      )
    },
  }),
  column.accessor('baseStatTotal', {
    header: () => <span className="block text-right">Base Stats</span>,
    meta: { width: 'w-24 max-sm:w-20' },
    cell: (info) => (
      <span className="block text-right font-medium tabular-nums">{info.getValue()}</span>
    ),
  }),
])

// Fixed widths keep the columns still while pages change; Pokémon takes the rest.
const COLUMN_LAYOUT = columns.map((definition) => definition.meta ?? {})

export function PokemonTable({ page, size }: { page: number; size: PageSize }) {
  const navigate = useNavigate({ from: '/' })
  // Phones show fewer page numbers so the pagination fits on one line.
  const isMobile = useIsMobile()
  const query = useQuery(pokemonPageOptions(page, size))
  const total = query.data?.total ?? 0
  const pageCount = Math.max(1, Math.ceil(total / size))

  const table = useTable({
    features,
    columns,
    data: query.data?.pokemon ?? [],
    getRowId: (pokemon) => String(pokemon.id),
    manualPagination: true,
    rowCount: total,
    state: { pagination: { pageIndex: page - 1, pageSize: size } },
  })

  if (query.isError) {
    return (
      <SectionState
        icon={CircleAlertIcon}
        title="Something Went Wrong"
        description="The Pokémon could not load. Check your connection and try again."
        action={
          <Button disabled={query.isFetching} onClick={() => void query.refetch()}>
            {query.isFetching ? 'Retrying…' : 'Try Again'}
          </Button>
        }
      />
    )
  }

  if (query.data && page > pageCount) {
    return (
      <SectionState
        icon={SearchXIcon}
        title="Page Not Found"
        description={`There are only ${pageCount.toLocaleString('en-US')} pages.`}
        action={
          <Link
            to="/"
            search={(prev) => ({ ...prev, page: undefined })}
            className={buttonVariants()}
          >
            Back To First Page
          </Link>
        }
      />
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <Table layout="fixed" aria-label="Pokémon" aria-busy={query.isFetching}>
        <TableColGroup columns={COLUMN_LAYOUT} />
        <TableHeader>
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id}>
              {group.headers.map((header) => (
                <TableHead
                  key={header.id}
                  hideOnMobile={header.column.columnDef.meta?.hideOnMobile}
                >
                  <table.FlexRender header={header} />
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {query.data
            ? table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getAllCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      hideOnMobile={cell.column.columnDef.meta?.hideOnMobile}
                    >
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : Array.from({ length: size }, (_, row) => `loading-${row}`).map((key) => (
                <TableRow key={key}>
                  <TableCell colSpan={columns.length}>
                    <div className="h-7">
                      <Skeleton fill />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex shrink-0 items-center gap-2 max-sm:self-center">
          <span id="rows-per-page" className="text-xs text-muted-foreground">
            Rows Per Page
          </span>
          <Select
            items={SIZE_ITEMS}
            value={size}
            onValueChange={(value) => {
              if (!isPageSize(value)) return
              void navigate({
                search: (prev) => ({
                  ...prev,
                  size: value === DEFAULT_PAGE_SIZE ? undefined : value,
                  page: undefined,
                }),
                resetScroll: false,
              })
            }}
          >
            <SelectTrigger size="sm" aria-labelledby="rows-per-page">
              <SelectValue />
            </SelectTrigger>
            {/* Open below the trigger rather than over it. */}
            <SelectContent side="bottom" align="start" alignItemWithTrigger={false}>
              {SIZE_ITEMS.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex min-w-0 flex-1">
          <Pagination align={isMobile ? 'center' : 'end'} aria-label="Pokémon Pages">
            <PaginationContent>
              <PaginationItem>
                <StepLink page={page - 1} disabled={page <= 1} label="Previous Page">
                  <ChevronLeftIcon aria-hidden="true" />
                </StepLink>
              </PaginationItem>
              {pageRange(page, pageCount, isMobile ? 0 : 1).map((item, index, items) =>
                item === 'gap' ? (
                  <PaginationItem key={`gap-after-${String(items[index - 1])}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={item}>
                    <PageLink page={item} isActive={item === page} label={`Page ${item}`}>
                      {item}
                    </PageLink>
                  </PaginationItem>
                ),
              )}
              <PaginationItem>
                <StepLink page={page + 1} disabled={page >= pageCount} label="Next Page">
                  <ChevronRightIcon aria-hidden="true" />
                </StepLink>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  )
}
