import { describe, expect, it } from 'vitest'

import { formatPokedexNumber, toTitleCase } from '@/features/pokemon/lib/format'

describe('formatPokedexNumber', () => {
  it('pads the number to three digits', () => {
    expect(formatPokedexNumber(1)).toBe('#001')
    expect(formatPokedexNumber(151)).toBe('#151')
  })
})

describe('toTitleCase', () => {
  it('capitalises every word of a PokeAPI slug', () => {
    expect(toTitleCase('bulbasaur')).toBe('Bulbasaur')
    expect(toTitleCase('mr-mime')).toBe('Mr-Mime')
    expect(toTitleCase('grass')).toBe('Grass')
  })
})
