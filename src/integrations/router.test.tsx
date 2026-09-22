import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { renderRoute } from '@/lib/test-utils'

const HERO = { level: 1, name: 'Build Your Next Product, Faster' }

describe('router', () => {
  it('renders the home page with all six blocks', async () => {
    await renderRoute('/')

    expect(await screen.findByRole('heading', HERO)).toBeInTheDocument()
    for (const name of [
      'Trusted At Scale',
      'Loved By Teams That Ship',
      'Pricing That Scales With You',
      'Frequently Asked Questions',
      'Start Building Faster Today',
    ]) {
      expect(screen.getByRole('heading', { name })).toBeInTheDocument()
    }
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
