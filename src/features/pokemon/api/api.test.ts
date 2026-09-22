import { isAxiosError } from 'axios'
import { describe, expect, it } from 'vitest'

import { fetchPokemon, fetchPokemonList } from '@/features/pokemon/api/api'

describe('PokeAPI client', () => {
  it('lists the original 151 with their Pokedex numbers', async () => {
    const list = await fetchPokemonList()

    expect(list).toHaveLength(151)
    expect(list[0]).toEqual({ id: 1, name: 'bulbasaur' })
    expect(list.at(-1)).toEqual({ id: 151, name: 'mew' })
  })

  it('converts a Pokemon into metric units and plain types', async () => {
    const pikachu = await fetchPokemon('pikachu')

    expect(pikachu).toMatchObject({
      id: 25,
      name: 'pikachu',
      heightCm: 40,
      weightKg: 6,
      types: ['electric'],
    })
    expect(pikachu.imageUrl).toMatch(/\/25\.png$/)
  })

  it('looks Pokemon up regardless of case', async () => {
    expect((await fetchPokemon('PIKACHU')).id).toBe(25)
  })

  it('rejects with a 404 for an unknown Pokemon', async () => {
    const error = await fetchPokemon('not-a-pokemon').catch((caught: unknown) => caught)

    expect(isAxiosError(error) && error.response?.status).toBe(404)
  })
})
