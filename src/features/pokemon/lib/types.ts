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

// Messages are translation keys, resolved with t() at render so they follow a language switch.
export const pokemonSearchSchema = z.object({
  query: z
    .string()
    .trim()
    .min(1, 'pokemon.errors.queryRequired')
    .regex(/^[a-zA-Z0-9-]+$/, 'pokemon.errors.queryInvalid'),
})
