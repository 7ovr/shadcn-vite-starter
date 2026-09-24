import { describe, expect, it } from 'vitest'

import { pageMeta } from '@/lib/meta'

describe('pageMeta', () => {
  it('titles a page after the site, joined with a hyphen', () => {
    expect(pageMeta({ title: 'Tech Stack', description: 'Tools.' }).meta).toEqual([
      { title: 'Tech Stack - 7Ovr Starter' },
      { name: 'description', content: 'Tools.' },
      { property: 'og:title', content: 'Tech Stack' },
      { property: 'og:description', content: 'Tools.' },
    ])
  })

  it('uses the site name alone without a page title', () => {
    expect(pageMeta({ description: 'Home.' }).meta[0]).toEqual({ title: '7Ovr Starter' })
  })
})
