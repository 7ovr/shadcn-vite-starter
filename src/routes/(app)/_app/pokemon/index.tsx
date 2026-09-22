import { Suspense } from 'react'
import { CatchBoundary, createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

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
  component: PokemonPage,
})

function PokemonPage() {
  const { t } = useTranslation()

  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-3xl font-bold tracking-tight">{t('pokemon.title')}</h1>
        <p className="text-muted-foreground">{t('pokemon.description')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('pokemon.search.title')}</CardTitle>
          <CardDescription>{t('pokemon.search.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <PokemonSearch />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('pokemon.list.title')}</CardTitle>
          <CardDescription>{t('pokemon.list.description')}</CardDescription>
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
