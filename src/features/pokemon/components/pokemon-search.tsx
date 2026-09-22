import { useForm } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { pokemonSearchSchema } from '@/features/pokemon/lib/types'

export function PokemonSearch() {
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
      <FieldGroup>
        <form.Field name="query">
          {(field) => {
            const invalid = field.state.meta.errors.length > 0
            const errorId = `${field.name}-error`
            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name}>Name Or Number</FieldLabel>
                <div className="flex gap-2">
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    aria-invalid={invalid}
                    aria-describedby={invalid ? errorId : undefined}
                    autoComplete="off"
                  />
                  <form.Subscribe selector={(state) => state.isSubmitting}>
                    {(isSubmitting) => (
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Finding...' : 'Find Pokémon'}
                      </Button>
                    )}
                  </form.Subscribe>
                </div>
                <FieldError id={errorId} errors={field.state.meta.errors} />
              </Field>
            )
          }}
        </form.Field>
      </FieldGroup>
    </form>
  )
}
