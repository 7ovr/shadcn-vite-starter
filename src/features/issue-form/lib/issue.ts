import { z } from 'zod'

import { REPOSITORY_URL } from '@/lib/config'

export const ISSUE_TYPES = [
  { value: 'bug', label: 'Bug Report' },
  { value: 'feature', label: 'Feature Request' },
  { value: 'block', label: 'Block Request' },
] as const

export type IssueType = (typeof ISSUE_TYPES)[number]['value']

export function isIssueType(value: unknown): value is IssueType {
  return ISSUE_TYPES.some((type) => type.value === value)
}

export const issueSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: 'Enter a title.', abort: true })
    .min(8, 'Use at least 8 characters.')
    .max(80, 'Keep it to 80 characters or fewer.'),
  type: z.enum(ISSUE_TYPES.map((type) => type.value)),
  details: z
    .string()
    .trim()
    .min(20, 'Describe it in at least 20 characters.')
    .max(2000, 'Keep it to 2,000 characters or fewer.'),
  searched: z.literal(true, 'Check the existing issues first.'),
})

export type Issue = z.infer<typeof issueSchema>

// GitHub fills the new-issue form from the query string, so nothing is sent until the user posts it.
export function issueUrl(issue: Issue) {
  const label = ISSUE_TYPES.find((type) => type.value === issue.type)?.label ?? 'Issue'
  const params = new URLSearchParams({
    title: `[${label}] ${issue.title.trim()}`,
    body: issue.details.trim(),
  })
  return `${REPOSITORY_URL}/issues/new?${params}`
}
