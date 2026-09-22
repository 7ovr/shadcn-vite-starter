import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { isAxiosError } from 'axios'
import { useTranslation } from 'react-i18next'

import { PendingFallback } from '@/components/pending-fallback'
import { buttonVariants } from '@/components/ui/button'
import { pokemonOptions } from '@/features/pokemon/api/queries'
import { PokemonDetails } from '@/features/pokemon/components/pokemon-details'

export const Route = createFileRoute('/(app)/_app/pokemon/$name')({
  // Awaited on purpose: an unknown Pokemon must become a 404 before the page renders.
  loader: async ({ context: { queryClient }, params }) => {
    try {
      await queryClient.ensureQueryData(pokemonOptions(params.name))
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) throw notFound()
      throw error
    }
  },
  pendingComponent: PendingFallback,
  notFoundComponent: PokemonNotFound,
  component: PokemonPage,
})

function BackToList() {
  const { t } = useTranslation()

  return (
    <Link to="/pokemon" className={buttonVariants({ variant: 'outline' })}>
      {t('pokemon.detail.back')}
    </Link>
  )
}

function PokemonPage() {
  const { name } = Route.useParams()

  return (
    <div className="flex flex-col items-start gap-8">
      <PokemonDetails name={name} />
      <BackToList />
    </div>
  )
}

function PokemonNotFound() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-start gap-4">
      <h1 className="font-heading text-2xl font-semibold">{t('pokemon.detail.notFound.title')}</h1>
      <p className="text-muted-foreground">{t('pokemon.detail.notFound.description')}</p>
      <BackToList />
    </div>
  )
}
