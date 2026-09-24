// zod/mini keeps this schema small: it is part of the route config, which loads with every page.
import { catch as withFallback, gte, int, literal, object, optional } from 'zod/mini'

export type Pokemon = {
  id: number
  name: string
  types: string[]
  // Hidden abilities are left out to keep the column short.
  abilities: string[]
  baseStatTotal: number
  spriteUrl: string | null
}

export type PokemonPage = {
  total: number
  pokemon: Pokemon[]
}

export const PAGE_SIZES = [10, 15, 20] as const

export type PageSize = (typeof PAGE_SIZES)[number]

export const DEFAULT_PAGE_SIZE: PageSize = 10

export function isPageSize(value: unknown): value is PageSize {
  return PAGE_SIZES.some((size) => size === value)
}

// A missing or broken value falls back to the default instead of an error.
export const pokemonSearchSchema = object({
  page: withFallback(optional(int().check(gte(1))), undefined),
  size: withFallback(optional(literal(PAGE_SIZES)), undefined),
})
