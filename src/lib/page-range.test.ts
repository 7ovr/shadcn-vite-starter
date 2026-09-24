import { describe, expect, it } from 'vitest'

import { pageRange } from '@/lib/page-range'

describe('pageRange', () => {
  it('lists every page when there are only a few', () => {
    expect(pageRange(2, 4)).toEqual([1, 2, 3, 4])
  })

  it('keeps the first and last page, and the neighbours of the current one', () => {
    expect(pageRange(10, 270)).toEqual([1, 'gap', 9, 10, 11, 'gap', 270])
  })

  it('does not add a gap next to the first page', () => {
    expect(pageRange(1, 270)).toEqual([1, 2, 'gap', 270])
    expect(pageRange(3, 270)).toEqual([1, 2, 3, 4, 'gap', 270])
  })
  it('can drop the neighbours to fit a narrow screen', () => {
    expect(pageRange(10, 270, 0)).toEqual([1, 'gap', 10, 'gap', 270])
    expect(pageRange(1, 270, 0)).toEqual([1, 'gap', 270])
  })
})
