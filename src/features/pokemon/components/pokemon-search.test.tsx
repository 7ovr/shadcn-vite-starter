import { act, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import i18n from 'i18next'
import { describe, expect, it } from 'vitest'

import { renderRoute } from '@/lib/test-utils'

async function setup() {
  const user = userEvent.setup()
  const { router } = await renderRoute('/pokemon')
  const query = await screen.findByLabelText('Name or number')
  const submit = screen.getByRole('button', { name: 'Find Pokémon' })
  return { user, router, query, submit }
}

describe('pokemon search', () => {
  it('asks for a query when submitted empty', async () => {
    const { user, submit } = await setup()

    await user.click(submit)

    expect(await screen.findByText('Enter a name or number.')).toBeInTheDocument()
  })

  it('rejects characters a Pokemon name cannot contain', async () => {
    const { user, query, submit } = await setup()

    await user.type(query, 'pika chu!')
    await user.click(submit)

    expect(await screen.findByText('Use letters, numbers and hyphens only.')).toBeInTheDocument()
    expect(query).toHaveAttribute('aria-invalid', 'true')
  })

  it('opens the Pokemon, ignoring case and surrounding spaces', async () => {
    const { user, router, query, submit } = await setup()

    await user.type(query, '  Pikachu ')
    await user.click(submit)

    expect(await screen.findByRole('heading', { level: 1, name: 'pikachu' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/pokemon/pikachu')
  })

  it('finds a Pokemon by its Pokedex number', async () => {
    const { user, query, submit } = await setup()

    await user.type(query, '25')
    await user.click(submit)

    expect(await screen.findByRole('heading', { level: 1, name: 'pikachu' })).toBeInTheDocument()
  })

  it('re-translates errors already on screen when the language changes', async () => {
    const { user, submit } = await setup()

    await user.click(submit)
    await screen.findByText('Enter a name or number.')
    await act(() => i18n.changeLanguage('pl'))

    expect(await screen.findByText('Podaj nazwę lub numer.')).toBeInTheDocument()
    expect(screen.queryByText('Enter a name or number.')).not.toBeInTheDocument()
  })
})
