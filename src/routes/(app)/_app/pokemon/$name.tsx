import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { preload } from 'react-dom'
import { isAxiosError } from 'axios'
import { SearchXIcon } from 'lucide-react'

import { PageState } from '@/components/page-state'
import { PendingFallback } from '@/components/pending-fallback'
import { buttonVariants } from '@/components/ui/button'
import { pokemonOptions } from '@/features/pokemon/api/queries'
import { PokemonDetails } from '@/features/pokemon/components/pokemon-details'

export const Route = createFileRoute('/(app)/_app/pokemon/$name')({
  // Awaited on purpose: an unknown Pokemon must become a 404 before the page renders.
  loader: async ({ context: { queryClient }, params }) => {
    try {
      const pokemon = await queryClient.ensureQueryData(pokemonOptions(params.name))
      if (pokemon.imageUrl) preload(pokemon.imageUrl, { as: 'image' })
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
  return (
    <Link to="/pokemon" className={buttonVariants({ variant: 'outline' })}>
      Back To The List
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
  return (
    <PageState
      icon={SearchXIcon}
      title="Pokémon Not Found"
      description="No Pokémon matches this name or number."
      action={<BackToList />}
    />
  )
}
