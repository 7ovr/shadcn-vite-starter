import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { mockPhoneViewport, openCommandMenu, openIssueDialog, renderRoute } from '@/lib/test-utils'

describe('AppShell', () => {
  describe('sidebar', () => {
    it('navigates and marks the current page', async () => {
      const user = userEvent.setup()
      const { router } = await renderRoute('/')

      await user.click(await screen.findByRole('link', { name: 'Tech Stack' }))

      expect(
        await screen.findByRole('heading', { level: 1, name: 'Tech Stack' }),
      ).toBeInTheDocument()
      expect(router.state.location.pathname).toBe('/tech-stack')
      expect(screen.getByRole('link', { name: 'Tech Stack' })).toHaveAttribute(
        'aria-current',
        'page',
      )
      expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current')
    })

    it('switches the theme from the footer', async () => {
      const user = userEvent.setup()
      await renderRoute('/')

      await user.click(await screen.findByRole('button', { name: /Dark Mode/ }))

      expect(document.documentElement).toHaveClass('dark')
      expect(screen.getByRole('button', { name: /Light Mode/ })).toBeInTheDocument()
    })

    it('links the call to action to 7Ovr', async () => {
      await renderRoute('/')

      expect(
        await screen.findByRole('link', { name: 'Browse 7Ovr Blocks And Templates' }),
      ).toHaveAttribute('href', 'https://7ovr.com')
    })

    it('keeps search on the collapsed rail', async () => {
      const user = userEvent.setup()
      await renderRoute('/')

      await user.click(await screen.findByRole('button', { name: 'Toggle Sidebar' }))
      await user.click(screen.getByRole('button', { name: 'Search' }))

      expect(await screen.findByRole('dialog')).toBeInTheDocument()
    })

    it('closes as a sheet on a phone once a page is picked', async () => {
      mockPhoneViewport()
      const user = userEvent.setup()
      await renderRoute('/')

      await user.click((await screen.findAllByRole('button', { name: 'Toggle Sidebar' }))[0]!)
      const sheet = await screen.findByRole('dialog')
      await user.click(within(sheet).getByRole('link', { name: 'Tech Stack' }))

      expect(
        await screen.findByRole('heading', { level: 1, name: 'Tech Stack' }),
      ).toBeInTheDocument()
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    })
  })

  describe('command menu', () => {
    it('opens with Ctrl+K and navigates', async () => {
      const user = userEvent.setup()
      const { router } = await renderRoute('/')

      const menu = await openCommandMenu(user)
      await user.click(within(menu).getByText('Agentic Coding'))

      expect(
        await screen.findByRole('heading', { level: 1, name: 'Agentic Coding' }),
      ).toBeInTheDocument()
      expect(router.state.location.pathname).toBe('/agentic-coding')
    })

    it('opens with Caps Lock on', async () => {
      const user = userEvent.setup()
      await renderRoute('/')
      await screen.findByRole('heading', { level: 1 })

      await user.keyboard('{Control>}K{/Control}')

      expect(await screen.findByRole('dialog')).toBeInTheDocument()
    })

    it('stays open while Ctrl+K is held down', async () => {
      const user = userEvent.setup()
      await renderRoute('/')
      await screen.findByRole('heading', { level: 1 })

      await user.keyboard('{Control>}{k>2/}{/Control}')

      expect(await screen.findByRole('dialog')).toBeInTheDocument()
    })

    it('opens from the sidebar search field', async () => {
      const user = userEvent.setup()
      await renderRoute('/')

      await user.click(await screen.findByRole('button', { name: /^Search.+K$/ }))

      expect(await screen.findByRole('dialog')).toBeInTheDocument()
    })

    it('toggles the theme and closes', async () => {
      const user = userEvent.setup()
      await renderRoute('/')

      const menu = await openCommandMenu(user)
      await user.click(within(menu).getByText('Toggle Theme'))

      expect(document.documentElement).toHaveClass('dark')
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    })

    it('opens a resource in a new tab', async () => {
      const open = vi.spyOn(window, 'open').mockReturnValue(null)
      const user = userEvent.setup()
      await renderRoute('/')

      const menu = await openCommandMenu(user)
      await user.click(within(menu).getByText('Shadcn/UI'))

      expect(open).toHaveBeenCalledWith('https://ui.shadcn.com/docs', '_blank', 'noreferrer')
    })

    it('says so when nothing matches', async () => {
      const user = userEvent.setup()
      await renderRoute('/')

      const menu = await openCommandMenu(user)
      await user.type(within(menu).getByRole('combobox'), 'no-such-page')

      expect(within(menu).getByText('No results found.')).toBeInTheDocument()
    })
  })

  describe('issue dialog', () => {
    it('opens from the sidebar with the form', async () => {
      const user = userEvent.setup()
      await renderRoute('/')

      const dialog = await openIssueDialog(user)

      expect(await within(dialog).findByRole('textbox', { name: 'Title' })).toBeInTheDocument()
      expect(within(dialog).getByRole('button', { name: 'Open On GitHub' })).toBeInTheDocument()
    })

    it('opens from the command menu', async () => {
      const user = userEvent.setup()
      await renderRoute('/')

      const menu = await openCommandMenu(user)
      await user.click(within(menu).getByText('Report An Issue'))

      expect(await screen.findByRole('dialog', { name: 'Report An Issue' })).toBeInTheDocument()
    })

    it('closes once the issue opens on GitHub', async () => {
      vi.spyOn(window, 'open').mockReturnValue(null)
      const user = userEvent.setup()
      await renderRoute('/')
      const dialog = await openIssueDialog(user)

      await user.type(
        await within(dialog).findByRole('textbox', { name: 'Title' }),
        'Sidebar overlaps page',
      )
      await user.type(
        within(dialog).getByRole('textbox', { name: 'Details' }),
        'The collapsed sidebar covers the title.',
      )
      await user.click(
        within(dialog).getByRole('checkbox', { name: 'I Searched The Existing Issues' }),
      )
      await user.click(within(dialog).getByRole('button', { name: 'Open On GitHub' }))

      await waitFor(() =>
        expect(screen.queryByRole('dialog', { name: 'Report An Issue' })).not.toBeInTheDocument(),
      )
    })
  })
})
