import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { renderRoute } from '@/test/render'

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
    await renderRoute('/waitlist')

    expect(await screen.findByRole('navigation', { name: 'Main' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Starter' })).toHaveAttribute('href', '/')
  })

  it('marks the current page in the navigation', async () => {
    await renderRoute('/waitlist')

    expect(await screen.findByRole('link', { name: 'Waitlist' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current')
  })

  it('navigates between routes from the header', async () => {
    const user = userEvent.setup()
    const { router } = await renderRoute('/')

    await user.click(await screen.findByRole('link', { name: 'Waitlist' }))

    expect(await screen.findByRole('heading', { level: 1, name: 'Waitlist' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/waitlist')
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
})
