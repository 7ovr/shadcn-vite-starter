import { queryOptions } from '@tanstack/react-query'

import { fetchPokemon, fetchPokemonList } from '@/features/pokemon/api/api'
import { createQueryKeys } from '@/lib/key-factory'

export const pokemonKeys = createQueryKeys('pokemon')

export function pokemonListOptions() {
  return queryOptions({
    queryKey: pokemonKeys.lists(),
    queryFn: fetchPokemonList,
    // The Pokedex does not change while someone is using the app.
    staleTime: Infinity,
  })
}

export function pokemonOptions(nameOrId: string) {
  return queryOptions({
    queryKey: pokemonKeys.detail(nameOrId.toLowerCase()),
    queryFn: () => fetchPokemon(nameOrId),
    staleTime: Infinity,
  })
}
