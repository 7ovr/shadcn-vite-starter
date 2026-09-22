import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { renderRoute } from '@/lib/test-utils'

const HERO = { level: 1, name: 'Build your next product, faster' }

describe('router', () => {
  it('renders the home page with all six blocks', async () => {
    await renderRoute('/')

    expect(await screen.findByRole('heading', HERO)).toBeInTheDocument()
    for (const name of [
      'Trusted at scale',
      'Loved by teams that ship',
      'Pricing that scales with you',
      'Frequently asked questions',
      'Start building faster today.',
    ]) {
      expect(screen.getByRole('heading', { name })).toBeInTheDocument()
    }
  })

  it('renders the header on every page', async () => {
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

  it('navigates between routes from the header', async () => {
    const user = userEvent.setup()
    const { router } = await renderRoute('/')

    await user.click(await screen.findByRole('link', { name: 'Pokémon' }))

    expect(await screen.findByRole('heading', { level: 1, name: 'Pokémon' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/pokemon')
  })

  it('shows the not found page for an unknown path', async () => {
    await renderRoute('/does-not-exist')

    expect(await screen.findByRole('heading', { name: 'Page Not Found' })).toBeInTheDocument()
  })

  it('links from the not found page back home', async () => {
    const user = userEvent.setup()
    const { router } = await renderRoute('/does-not-exist')

    await user.click(await screen.findByRole('link', { name: 'Back Home' }))

    expect(await screen.findByRole('heading', HERO)).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/')
  })

  it('opens a Pokémon from the table', async () => {
    const user = userEvent.setup()
    const { router } = await renderRoute('/pokemon')
    const table = await screen.findByRole('table', { name: 'Pokémon' })

    await user.click(within(table).getByRole('link', { name: 'bulbasaur' }))

    expect(await screen.findByRole('heading', { level: 1, name: 'bulbasaur' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/pokemon/bulbasaur')
  })

  it('shows a 404 for a Pokémon that does not exist', async () => {
    await renderRoute('/pokemon/not-a-pokemon')

    expect(await screen.findByRole('heading', { name: 'Pokémon Not Found' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back To The List' })).toHaveAttribute(
      'href',
      '/pokemon',
    )
  })
})
