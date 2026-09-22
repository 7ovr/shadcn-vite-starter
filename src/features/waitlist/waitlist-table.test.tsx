import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { renderRoute } from '@/test/render'

async function setup() {
  const user = userEvent.setup()
  await renderRoute('/waitlist')
  const table = await screen.findByRole('table', { name: 'Waitlist' })
  return { user, table }
}

function names(table: HTMLElement) {
  const [, ...rows] = within(table).getAllByRole('row')
  return rows.map((row) => within(row).getAllByRole('cell')[0]?.textContent)
}

describe('waitlist table', () => {
  it('renders a column header per field', async () => {
    const { table } = await setup()

    expect(
      within(table)
        .getAllByRole('columnheader')
        .map((th) => th.textContent),
    ).toEqual(['Name', 'Email'])
  })

  it('lists the entries in the order the API returns them', async () => {
    const { table } = await setup()

    expect(names(table)).toEqual(['Margaret Hamilton', 'Ada Lovelace', 'Alan Turing'])
  })

  it('sorts by name ascending, then descending', async () => {
    const { user, table } = await setup()
    const sortByName = within(table).getByRole('button', { name: 'Name' })

    await user.click(sortByName)
    expect(names(table)).toEqual(['Ada Lovelace', 'Alan Turing', 'Margaret Hamilton'])

    await user.click(sortByName)
    expect(names(table)).toEqual(['Margaret Hamilton', 'Alan Turing', 'Ada Lovelace'])
  })

  it('sorts by email', async () => {
    const { user, table } = await setup()

    await user.click(within(table).getByRole('button', { name: 'Email' }))

    expect(names(table)).toEqual(['Ada Lovelace', 'Alan Turing', 'Margaret Hamilton'])
  })

  it('reports the sort direction to assistive technology', async () => {
    const { user, table } = await setup()
    const [nameHeader, emailHeader] = within(table).getAllByRole('columnheader')

    expect(nameHeader).toHaveAttribute('aria-sort', 'none')

    await user.click(within(table).getByRole('button', { name: 'Name' }))
    expect(nameHeader).toHaveAttribute('aria-sort', 'ascending')
    expect(emailHeader).toHaveAttribute('aria-sort', 'none')

    await user.click(within(table).getByRole('button', { name: 'Name' }))
    expect(nameHeader).toHaveAttribute('aria-sort', 'descending')
  })
})
