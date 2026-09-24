import { describe, expect, it } from 'vitest'

import { isPageSize, pokemonSearchSchema } from '@/features/pokemon/lib/types'

describe('pokemonSearchSchema', () => {
  it('keeps a valid page and page size', () => {
    expect(pokemonSearchSchema.parse({ page: 3, size: 15 })).toEqual({ page: 3, size: 15 })
  })

  it('drops a broken page or page size instead of failing', () => {
    expect(pokemonSearchSchema.parse({ page: 'abc', size: 7 })).toEqual({})
    expect(pokemonSearchSchema.parse({ page: 0, size: '20' })).toEqual({})
    expect(pokemonSearchSchema.parse({ page: 1.5 })).toEqual({})
  })
})

describe('isPageSize', () => {
  it('accepts only the offered page sizes', () => {
    expect([10, 15, 20].every(isPageSize)).toBe(true)
    expect([0, 7, '10', undefined].some(isPageSize)).toBe(false)
  })
})
