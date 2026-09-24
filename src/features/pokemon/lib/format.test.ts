import { describe, expect, it } from 'vitest'

import { toTitleCase } from '@/features/pokemon/lib/format'

describe('toTitleCase', () => {
  it('capitalises every word of a PokeAPI slug', () => {
    expect(toTitleCase('bulbasaur')).toBe('Bulbasaur')
    expect(toTitleCase('mr-mime')).toBe('Mr-Mime')
    expect(toTitleCase('grass')).toBe('Grass')
  })
})
