import { z } from 'zod'

import { REPOSITORY_URL } from '@/lib/config'

// Each type opens its issue form in .github/ISSUE_TEMPLATE, which adds the matching label.
export const ISSUE_TYPES = [
  { value: 'bug', label: 'Bug Report', template: 'bug-report.yml' },
  { value: 'feature', label: 'Feature Request', template: 'feature-request.yml' },
  { value: 'block', label: 'Block Request', template: 'block-request.yml' },
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

// GitHub prefills the form's fields by id from the query string; nothing is sent until posted.
export function issueUrl(issue: Issue) {
  const type = ISSUE_TYPES.find((entry) => entry.value === issue.type) ?? ISSUE_TYPES[0]
  const params = new URLSearchParams({
    template: type.template,
    title: `[${type.label}] ${issue.title.trim()}`,
    details: issue.details.trim(),
  })
  return `${REPOSITORY_URL}/issues/new?${params}`
}
