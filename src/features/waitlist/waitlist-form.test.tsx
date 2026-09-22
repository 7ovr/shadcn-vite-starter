import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { renderRoute } from '@/test/render'

async function setup() {
  const user = userEvent.setup()
  await renderRoute('/waitlist')
  const name = await screen.findByLabelText('Name')
  const email = screen.getByLabelText('Email')
  const submit = screen.getByRole('button', { name: 'Join The Waitlist' })
  return { user, name, email, submit }
}

describe('waitlist form', () => {
  it('shows both errors when submitted empty', async () => {
    const { user, submit } = await setup()

    await user.click(submit)

    expect(await screen.findByText('Enter at least 2 characters.')).toBeInTheDocument()
    expect(screen.getByText('Enter a valid email address.')).toBeInTheDocument()
  })

  it('rejects an invalid email address', async () => {
    const { user, name, email, submit } = await setup()

    await user.type(name, 'Grace Hopper')
    await user.type(email, 'not-an-email')
    await user.click(submit)

    expect(await screen.findByText('Enter a valid email address.')).toBeInTheDocument()
    expect(screen.queryByText('Enter at least 2 characters.')).not.toBeInTheDocument()
  })

  it('marks invalid fields for assistive technology', async () => {
    const { user, name, submit } = await setup()

    await user.click(submit)

    await screen.findByText('Enter at least 2 characters.')
    expect(name).toHaveAttribute('aria-invalid', 'true')
  })

  it('trims whitespace before validating the name', async () => {
    const { user, name, email, submit } = await setup()

    await user.type(name, '  A  ')
    await user.type(email, 'grace@example.com')
    await user.click(submit)

    expect(await screen.findByText('Enter at least 2 characters.')).toBeInTheDocument()
  })

  it('adds a valid signup to the list and clears the form', async () => {
    const { user, name, email, submit } = await setup()

    await user.type(name, 'Grace Hopper')
    await user.type(email, 'grace@example.com')
    await user.click(submit)

    const table = screen.getByRole('table', { name: 'Waitlist' })
    expect(await within(table).findByText('Grace Hopper')).toBeInTheDocument()
    expect(name).toHaveValue('')
    expect(email).toHaveValue('')
  })

  it('shows the API error for a duplicate email', async () => {
    const { user, name, email, submit } = await setup()

    await user.type(name, 'Ada Lovelace')
    await user.type(email, 'ada@example.com')
    await user.click(submit)

    expect(await screen.findByText('That email is already on the waitlist.')).toBeInTheDocument()
  })
})
