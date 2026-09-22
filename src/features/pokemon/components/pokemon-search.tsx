import { useForm } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'
import type { ParseKeys } from 'i18next'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { pokemonSearchSchema } from '@/features/pokemon/lib/types'

export function PokemonSearch() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const form = useForm({
    defaultValues: { query: '' },
    validators: { onSubmit: pokemonSearchSchema },
    onSubmit: ({ value }) =>
      navigate({ to: '/pokemon/$name', params: { name: value.query.trim().toLowerCase() } }),
  })

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        void form.handleSubmit()
      }}
    >
      <form.Field name="query">
        {(field) => {
          const invalid = field.state.meta.errors.length > 0
          return (
            <Field data-invalid={invalid}>
              <FieldLabel htmlFor={field.name}>{t('pokemon.search.label')}</FieldLabel>
              <div className="flex gap-2">
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={invalid}
                  autoComplete="off"
                />
                <Button type="submit">{t('pokemon.search.submit')}</Button>
              </div>
              {/* Schema messages are translation keys, translated here so they follow a language switch. */}
              <FieldError
                errors={field.state.meta.errors.map(
                  (issue) => issue && { message: t(issue.message as ParseKeys) },
                )}
              />
            </Field>
          )
        }}
      </form.Field>
    </form>
  )
}
