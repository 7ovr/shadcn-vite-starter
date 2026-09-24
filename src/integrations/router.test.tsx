import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { renderRoute } from '@/lib/test-utils'

const HOME = { level: 1, name: 'Home' }

describe('router', () => {
  it('renders the home page at the root', async () => {
    await renderRoute('/')

    expect(await screen.findByRole('heading', HOME)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Pokémon' })).toBeInTheDocument()
  })

  it('renders the setup steps and scripts', async () => {
    await renderRoute('/get-started')

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Get Started' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Setup' })).toBeInTheDocument()
    expect(screen.getByText('pnpm install')).toBeInTheDocument()
  })

  it('renders the tech stack table', async () => {
    await renderRoute('/tech-stack')

    expect(await screen.findByRole('heading', { level: 1, name: 'Tech Stack' })).toBeInTheDocument()
    expect(screen.getByRole('table', { name: 'Tech Stack' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: "What's Wired" })).toBeInTheDocument()
  })

  it('describes the agent instructions and skills', async () => {
    await renderRoute('/agentic-coding')

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Agentic Coding' }),
    ).toBeInTheDocument()
    expect(screen.getByText('CLAUDE.md')).toBeInTheDocument()
    expect(screen.getByText('AGENTS.md')).toBeInTheDocument()
    expect(screen.getByText('vercel-react-best-practices')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'vercel-react-best-practices On skills.sh' }),
    ).toHaveAttribute(
      'href',
      'https://skills.sh/vercel-labs/agent-skills/vercel-react-best-practices',
    )
  })

  it('lists every status token with its CSS variables', async () => {
    await renderRoute('/get-started')

    const table = await screen.findByRole('table', { name: 'Status Tokens' })
    for (const name of ['success', 'warning', 'info', 'destructive']) {
      expect(within(table).getByText(`--${name}, --${name}-foreground`)).toBeInTheDocument()
    }
  })

  it.each([
    ['/', '7Ovr Starter'],
    ['/get-started', 'Get Started - 7Ovr Starter'],
    ['/tech-stack', 'Tech Stack - 7Ovr Starter'],
    ['/agentic-coding', 'Agentic Coding - 7Ovr Starter'],
  ])('titles %s as "%s" with a description', async (path, title) => {
    await renderRoute(path)

    await waitFor(() => expect(document.title).toBe(title))
    const description = document.querySelector('meta[name="description"]')?.getAttribute('content')
    expect(description?.length).toBeGreaterThan(40)
  })

  it('shows the not found page inside the shell', async () => {
    await renderRoute('/does-not-exist')

    expect(await screen.findByRole('heading', { name: 'Page Not Found' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Toggle Sidebar' })).toBeInTheDocument()
  })

  it('links from the not found page back home', async () => {
    const user = userEvent.setup()
    const { router } = await renderRoute('/does-not-exist')

    await user.click(await screen.findByRole('link', { name: 'Back Home' }))

    expect(await screen.findByRole('heading', HOME)).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/')
  })
})
