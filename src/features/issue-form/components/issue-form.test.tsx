import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { IssueForm } from '@/features/issue-form/components/issue-form'

function setup() {
  const user = userEvent.setup()
  const open = vi.spyOn(window, 'open').mockReturnValue(null)
  render(<IssueForm />)
  return { user, open }
}

const submit = (user: ReturnType<typeof userEvent.setup>) =>
  user.click(screen.getByRole('button', { name: 'Open On GitHub' }))

describe('IssueForm', () => {
  it('shows what is missing and opens nothing', async () => {
    const { user, open } = setup()

    await submit(user)

    expect(screen.getByText('Enter a title.')).toBeInTheDocument()
    expect(screen.queryByText('Use at least 8 characters.')).not.toBeInTheDocument()
    expect(screen.getByText('Describe it in at least 20 characters.')).toBeInTheDocument()
    expect(screen.getByText('Check the existing issues first.')).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Title' })).toHaveAttribute('aria-invalid', 'true')
    expect(open).not.toHaveBeenCalled()
  })

  it('moves focus to the first field that needs fixing', async () => {
    const { user } = setup()
    await user.type(screen.getByRole('textbox', { name: 'Title' }), 'A long enough title')

    await submit(user)

    expect(screen.getByRole('textbox', { name: 'Details' })).toHaveFocus()
  })

  it('ties each error to its field', async () => {
    const { user } = setup()

    await submit(user)

    expect(screen.getByRole('textbox', { name: 'Title' })).toHaveAccessibleDescription(
      'Enter a title.',
    )
    expect(
      screen.getByRole('checkbox', { name: 'I Searched The Existing Issues' }),
    ).toHaveAccessibleDescription('Check the existing issues first.')
  })

  it('stays quiet until the first submit, then updates as the user types', async () => {
    const { user } = setup()
    const title = screen.getByRole('textbox', { name: 'Title' })

    await user.type(title, 'Bug')
    expect(screen.queryByText('Use at least 8 characters.')).not.toBeInTheDocument()

    await submit(user)
    expect(screen.getByText('Use at least 8 characters.')).toBeInTheDocument()

    await user.type(title, ' in the sidebar')
    expect(screen.queryByText('Use at least 8 characters.')).not.toBeInTheDocument()
    expect(title).toHaveAttribute('aria-invalid', 'false')
  })

  it('opens a prefilled GitHub issue once everything is valid', async () => {
    const { user, open } = setup()

    await user.type(screen.getByRole('textbox', { name: 'Title' }), 'Add a pricing block example')
    await user.click(screen.getByRole('combobox', { name: 'Type' }))
    await user.click(await screen.findByRole('option', { name: 'Block Request' }))
    await user.type(
      screen.getByRole('textbox', { name: 'Details' }),
      'A pricing page built from 7Ovr blocks would help.',
    )
    await user.click(screen.getByRole('checkbox', { name: 'I Searched The Existing Issues' }))
    await submit(user)

    expect(open).toHaveBeenCalledOnce()
    const url = new URL(String(open.mock.calls[0]?.[0]))
    expect(url.searchParams.get('title')).toBe('[Block Request] Add a pricing block example')
    expect(open.mock.calls[0]?.[1]).toBe('_blank')
  })
})
