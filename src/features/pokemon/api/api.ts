import type { Pokemon } from '@/features/pokemon/lib/types'
import { http } from '@/integrations/axios'

type NamedResource = { name: string; url: string }

type PokemonListResponse = { count: number; results: NamedResource[] }

type PokemonResponse = {
  id: number
  name: string
  types: { type: NamedResource }[]
  abilities: { ability: NamedResource; is_hidden: boolean }[]
  stats: { base_stat: number }[]
  sprites: { front_default: string | null }
}

// The list endpoint only gives names; each Pokémon's details come from its own request.
export async function fetchPokemonNames(page: number, size: number, signal?: AbortSignal) {
  const { data } = await http.get<PokemonListResponse>('/pokemon', {
    params: { limit: size, offset: (page - 1) * size },
    signal,
  })
  return { total: data.count, names: data.results.map((result) => result.name) }
}

export async function fetchPokemon(name: string, signal?: AbortSignal): Promise<Pokemon> {
  const { data } = await http.get<PokemonResponse>(`/pokemon/${encodeURIComponent(name)}`, {
    signal,
  })
  return {
    id: data.id,
    name: data.name,
    types: data.types.map((entry) => entry.type.name),
    abilities: data.abilities
      .filter((entry) => !entry.is_hidden)
      .map((entry) => entry.ability.name),
    baseStatTotal: data.stats.reduce((sum, entry) => sum + entry.base_stat, 0),
    spriteUrl: data.sprites.front_default,
  }
}
