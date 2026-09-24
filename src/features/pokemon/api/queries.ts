import { keepPreviousData, queryOptions } from '@tanstack/react-query'

import { fetchPokemon, fetchPokemonNames } from '@/features/pokemon/api/api'
import type { PokemonPage } from '@/features/pokemon/lib/types'
import { createQueryKeys } from '@/lib/key-factory'

export const pokemonKeys = createQueryKeys('pokemon')

// The Pokedex does not change while someone is using the app, so nothing here goes stale.
export function pokemonOptions(name: string) {
  return queryOptions({
    queryKey: pokemonKeys.detail(name),
    queryFn: ({ signal }) => fetchPokemon(name, signal),
    staleTime: Infinity,
  })
}

export function pokemonPageOptions(page: number, size: number) {
  return queryOptions({
    queryKey: [...pokemonKeys.lists(), { page, size }] as const,
    // Each Pokémon is cached on its own, so a new page size or a retry only fetches what is missing.
    queryFn: async ({ client, signal }): Promise<PokemonPage> => {
      const { total, names } = await fetchPokemonNames(page, size, signal)
      const pokemon = await Promise.all(
        names.map((name) => client.fetchQuery(pokemonOptions(name))),
      )
      return { total, pokemon }
    },
    staleTime: Infinity,
    // Keep the current page on screen while the next one loads.
    placeholderData: keepPreviousData,
  })
}
