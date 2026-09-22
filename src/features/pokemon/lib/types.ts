import { z } from 'zod'

export type PokemonSummary = {
  id: number
  name: string
}

export type Pokemon = PokemonSummary & {
  heightCm: number
  weightKg: number
  types: string[]
  imageUrl: string | null
}

// Names and Pokedex numbers as PokeAPI accepts them in a URL.
export const POKEMON_SLUG = /^[a-z0-9-]+$/i

export const pokemonSearchSchema = z.object({
  query: z
    .string()
    .trim()
    .min(1, 'Enter a name or number.')
    .regex(/^[a-zA-Z0-9-]*$/, 'Use letters, numbers and hyphens only.'),
})
