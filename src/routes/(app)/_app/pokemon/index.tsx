import { Suspense } from 'react'
import { CatchBoundary, createFileRoute } from '@tanstack/react-router'

import { ErrorFallback } from '@/components/error-fallback'
import { PendingFallback } from '@/components/pending-fallback'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { pokemonListOptions } from '@/features/pokemon/api/queries'
import { PokemonSearch } from '@/features/pokemon/components/pokemon-search'
import { PokemonTable } from '@/features/pokemon/components/pokemon-table'

export const Route = createFileRoute('/(app)/_app/pokemon/')({
  // Not awaited: navigation stays instant and only the table suspends while the list loads.
  loader: ({ context: { queryClient } }) => {
    void queryClient.prefetchQuery(pokemonListOptions())
  },
  head: () => ({ meta: [{ title: 'Pokémon - Starter' }] }),
  component: PokemonPage,
})

function PokemonPage() {
  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-3xl font-bold tracking-tight">Pokémon</h1>
        <p className="text-muted-foreground">
          A working example of TanStack Router, Query, Form and Table on the free PokéAPI. Replace
          it with your own feature.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Find A Pokémon</CardTitle>
          <CardDescription>A TanStack Form validated with Zod. Try pikachu or 25.</CardDescription>
        </CardHeader>
        <CardContent>
          <PokemonSearch />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>The Original 151</CardTitle>
          <CardDescription>
            The original 151, loaded while the page renders. Sort by any column.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CatchBoundary getResetKey={() => 'pokemon-list'} errorComponent={ErrorFallback}>
            <Suspense fallback={<PendingFallback />}>
              <PokemonTable />
            </Suspense>
          </CatchBoundary>
        </CardContent>
      </Card>
    </>
  )
}
