import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { renderRoute } from '@/lib/test-utils'

describe('site header', () => {
  it('renders on every page', async () => {
    await renderRoute('/pokemon')

    expect(await screen.findByRole('navigation', { name: 'Main' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Starter' })).toHaveAttribute('href', '/')
  })

  it('marks the current section in the navigation', async () => {
    await renderRoute('/pokemon/bulbasaur')

    expect(await screen.findByRole('link', { name: 'Pokémon' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current')
  })

  it('navigates between sections', async () => {
    const user = userEvent.setup()
    const { router } = await renderRoute('/')

    await user.click(await screen.findByRole('link', { name: 'Pokémon' }))

    expect(await screen.findByRole('heading', { level: 1, name: 'Pokémon' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/pokemon')
  })
})
