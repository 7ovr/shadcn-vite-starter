import { useForm, useStore } from '@tanstack/react-form'

import { GitHubIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  ISSUE_TYPES,
  type IssueType,
  isIssueType,
  issueSchema,
  issueUrl,
} from '@/features/issue-form/lib/issue'

type IssueDraft = { title: string; type: IssueType; details: string; searched: boolean }

const EMPTY: IssueDraft = { title: '', type: 'bug', details: '', searched: false }

// Fields in the order they appear; each input's id is `issue-<name>`.
const FIELD_ORDER = [
  'title',
  'type',
  'details',
  'searched',
] as const satisfies readonly (keyof IssueDraft)[]

export function IssueForm({ onSubmitted }: { onSubmitted?: () => void }) {
  const form = useForm({
    defaultValues: EMPTY,
    validators: { onChange: issueSchema, onSubmit: issueSchema },
    onSubmit: ({ value }) => {
      window.open(issueUrl(issueSchema.parse(value)), '_blank', 'noreferrer')
      onSubmitted?.()
    },
    onSubmitInvalid: ({ formApi }) => {
      const invalid = FIELD_ORDER.find((name) => formApi.getFieldMeta(name)?.errors.length)
      if (invalid) document.getElementById(`issue-${invalid}`)?.focus()
    },
  })
  // Errors wait for the first submit, then follow every change.
  const submitted = useStore(form.store, (state) => state.submissionAttempts > 0)

  const errorsFor = (errors: unknown[]) => (submitted ? (errors as { message?: string }[]) : [])

  return (
    <form
      noValidate
      className="flex flex-col gap-5"
      onSubmit={(event) => {
        event.preventDefault()
        void form.handleSubmit()
      }}
    >
      <FieldGroup>
        <form.Field name="title">
          {(field) => {
            const errors = errorsFor(field.state.meta.errors)
            return (
              <Field data-invalid={errors.length > 0}>
                <FieldLabel htmlFor="issue-title">Title</FieldLabel>
                <Input
                  id="issue-title"
                  value={field.state.value}
                  placeholder="Sidebar tooltip overlaps the page"
                  autoComplete="off"
                  aria-invalid={errors.length > 0}
                  aria-describedby={errors.length > 0 ? `issue-${field.name}-error` : undefined}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
                <FieldError id={`issue-${field.name}-error`} errors={errors} />
              </Field>
            )
          }}
        </form.Field>

        <form.Field name="type">
          {(field) => (
            <Field>
              <FieldLabel htmlFor="issue-type">Type</FieldLabel>
              <Select
                items={ISSUE_TYPES}
                value={field.state.value}
                onValueChange={(value) => {
                  if (isIssueType(value)) field.handleChange(value)
                }}
              >
                <SelectTrigger id="issue-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent side="bottom" align="start" alignItemWithTrigger={false}>
                  {ISSUE_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}
        </form.Field>

        <form.Field name="details">
          {(field) => {
            const errors = errorsFor(field.state.meta.errors)
            return (
              <Field data-invalid={errors.length > 0}>
                <FieldLabel htmlFor="issue-details">Details</FieldLabel>
                <Textarea
                  id="issue-details"
                  resizable={false}
                  value={field.state.value}
                  placeholder="What happened, and what did you expect instead?"
                  aria-invalid={errors.length > 0}
                  aria-describedby={errors.length > 0 ? `issue-${field.name}-error` : undefined}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
                <FieldError id={`issue-${field.name}-error`} errors={errors} />
              </Field>
            )
          }}
        </form.Field>

        <form.Field name="searched">
          {(field) => {
            const errors = errorsFor(field.state.meta.errors)
            return (
              <Field data-invalid={errors.length > 0}>
                <Field orientation="horizontal">
                  <Checkbox
                    id="issue-searched"
                    checked={field.state.value}
                    aria-invalid={errors.length > 0}
                    aria-describedby={errors.length > 0 ? `issue-${field.name}-error` : undefined}
                    onCheckedChange={(checked) => field.handleChange(checked === true)}
                  />
                  <FieldLabel htmlFor="issue-searched">I Searched The Existing Issues</FieldLabel>
                </Field>
                <FieldError id={`issue-${field.name}-error`} errors={errors} />
              </Field>
            )
          }}
        </form.Field>
      </FieldGroup>

      {/* A grid cell stretches the button to the form's full width. */}
      <div className="grid">
        <Button type="submit">
          <GitHubIcon data-icon="inline-start" aria-hidden="true" />
          Open On GitHub
        </Button>
      </div>
    </form>
  )
}
