import type { Pokemon, PokemonSummary } from '@/features/pokemon/lib/types'
import { http } from '@/integrations/axios'

type NamedResource = { name: string; url: string }

type PokemonResponse = {
  id: number
  name: string
  height: number
  weight: number
  types: { type: NamedResource }[]
  sprites: { other: { 'official-artwork': { front_default: string | null } } }
}

export const ORIGINAL_POKEMON_COUNT = 151

// PokeAPI lists each Pokemon as a name and a URL ending in its National Pokedex number.
function idFromUrl(url: string) {
  return Number(url.split('/').findLast(Boolean))
}

export async function fetchPokemonList(): Promise<PokemonSummary[]> {
  const { data } = await http.get<{ results: NamedResource[] }>('/pokemon', {
    params: { limit: ORIGINAL_POKEMON_COUNT },
  })
  return data.results.map((resource) => ({ id: idFromUrl(resource.url), name: resource.name }))
}

export async function fetchPokemon(nameOrId: string): Promise<Pokemon> {
  const { data } = await http.get<PokemonResponse>(`/pokemon/${nameOrId.toLowerCase()}`)
  return {
    id: data.id,
    name: data.name,
    heightCm: data.height * 10,
    weightKg: data.weight / 10,
    types: data.types.map((entry) => entry.type.name),
    imageUrl: data.sprites.other['official-artwork'].front_default,
  }
}
