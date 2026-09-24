import { describe, expect, it } from 'vitest'

import { ISSUE_TYPES, isIssueType, issueSchema, issueUrl } from '@/features/issue-form/lib/issue'

const valid = {
  title: 'Sidebar tooltip overlaps the page',
  type: 'bug' as const,
  details: 'With the sidebar collapsed, the Search tooltip covers the page title.',
  searched: true as const,
}

const firstError = (value: unknown) => issueSchema.safeParse(value).error?.issues[0]?.message

describe('issueSchema', () => {
  it('accepts a complete issue', () => {
    expect(issueSchema.safeParse(valid).success).toBe(true)
  })

  it('asks for a title of a useful length', () => {
    expect(firstError({ ...valid, title: '' })).toBe('Enter a title.')
    expect(firstError({ ...valid, title: 'Bug' })).toBe('Use at least 8 characters.')
  })

  it('asks for enough detail to act on', () => {
    expect(firstError({ ...valid, details: 'Broken.' })).toBe(
      'Describe it in at least 20 characters.',
    )
  })

  it('asks to search existing issues first', () => {
    expect(firstError({ ...valid, searched: false })).toBe('Check the existing issues first.')
  })

  it('accepts exactly the listed issue types', () => {
    for (const { value } of ISSUE_TYPES) {
      expect(issueSchema.safeParse({ ...valid, type: value }).success).toBe(true)
      expect(isIssueType(value)).toBe(true)
    }
    expect(issueSchema.safeParse({ ...valid, type: 'question' }).success).toBe(false)
    expect(isIssueType('question')).toBe(false)
  })
})

describe('issueUrl', () => {
  it('builds a prefilled GitHub issue link', () => {
    const url = new URL(issueUrl(valid))

    expect(url.origin + url.pathname).toBe('https://github.com/7ovr/shadcn-vite-starter/issues/new')
    expect(url.searchParams.get('title')).toBe('[Bug Report] Sidebar tooltip overlaps the page')
    expect(url.searchParams.get('body')).toBe(valid.details)
  })
})
