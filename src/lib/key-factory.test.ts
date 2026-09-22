import { describe, expect, it } from 'vitest'

import { createQueryKeys } from '@/lib/key-factory'

describe('createQueryKeys', () => {
  const keys = createQueryKeys('waitlist')

  it('scopes every key under the feature name', () => {
    expect(keys.all).toEqual(['waitlist'])
    expect(keys.lists()).toEqual(['waitlist', 'list'])
    expect(keys.details()).toEqual(['waitlist', 'detail'])
    expect(keys.detail('42')).toEqual(['waitlist', 'detail', '42'])
  })

  it('nests each key inside the broader one, so invalidating a parent covers its children', () => {
    expect(keys.lists().slice(0, keys.all.length)).toEqual(keys.all)
    expect(keys.detail('42').slice(0, keys.details().length)).toEqual(keys.details())
  })
})
