import { describe, expect, it } from 'vitest'

import { createQueryKeys } from '@/lib/key-factory'

describe('createQueryKeys', () => {
  const keys = createQueryKeys('pokemon')

  it('scopes every key under the feature name', () => {
    expect(keys.all).toEqual(['pokemon'])
    expect(keys.lists()).toEqual(['pokemon', 'list'])
    expect(keys.details()).toEqual(['pokemon', 'detail'])
    expect(keys.detail('42')).toEqual(['pokemon', 'detail', '42'])
  })

  it('nests each key inside the broader one, so invalidating a parent covers its children', () => {
    expect(keys.lists().slice(0, keys.all.length)).toEqual(keys.all)
    expect(keys.detail('42').slice(0, keys.details().length)).toEqual(keys.details())
  })
})
