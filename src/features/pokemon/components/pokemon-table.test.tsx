import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import i18n from 'i18next'
import { describe, expect, it, vi } from 'vitest'

import { http } from '@/integrations/axios'
import { renderRoute } from '@/lib/test-utils'

async function setup() {
  const user = userEvent.setup()
  await renderRoute('/pokemon')
  const table = await screen.findByRole('table', { name: 'Pokémon' })
  return { user, table }
}

function firstColumn(table: HTMLElement) {
  const [, ...rows] = within(table).getAllByRole('row')
  return rows.map((row) => within(row).getAllByRole('cell')[1]?.textContent)
}

describe('pokemon table', () => {
  it('renders a column header per field', async () => {
    const { table } = await setup()

    expect(
      within(table)
        .getAllByRole('columnheader')
        .map((th) => th.textContent),
    ).toEqual(['No.', 'Name'])
  })

  it('shows ten Pokemon per page in Pokedex order', async () => {
    const { table } = await setup()

    expect(firstColumn(table)).toHaveLength(10)
    expect(firstColumn(table)[0]).toBe('bulbasaur')
    expect(within(table).getByText('#001')).toBeInTheDocument()
    expect(screen.getByText('Page 1 of 16')).toBeInTheDocument()
  })

  it('pages forwards and back', async () => {
    const { user, table } = await setup()
    const previous = screen.getByRole('button', { name: 'Previous' })
    expect(previous).toBeDisabled()

    await user.click(screen.getByRole('button', { name: 'Next' }))
    expect(firstColumn(table)[0]).toBe('metapod')
    expect(screen.getByText('Page 2 of 16')).toBeInTheDocument()

    await user.click(previous)
    expect(firstColumn(table)[0]).toBe('bulbasaur')
  })

  it('sorts by name ascending, then descending', async () => {
    const { user, table } = await setup()
    const sortByName = within(table).getByRole('button', { name: 'Name' })

    await user.click(sortByName)
    expect(firstColumn(table)[0]).toBe('abra')

    await user.click(sortByName)
    expect(firstColumn(table)[0]).toBe('zubat')
  })

  it('reports the sort direction to assistive technology', async () => {
    const { user, table } = await setup()
    const [numberHeader, nameHeader] = within(table).getAllByRole('columnheader')

    expect(nameHeader).toHaveAttribute('aria-sort', 'none')

    await user.click(within(table).getByRole('button', { name: 'Name' }))
    expect(nameHeader).toHaveAttribute('aria-sort', 'ascending')
    expect(numberHeader).toHaveAttribute('aria-sort', 'none')

    await user.click(within(table).getByRole('button', { name: 'Name' }))
    expect(nameHeader).toHaveAttribute('aria-sort', 'descending')
  })

  it('counts the list with the plural rules of each language', async () => {
    const { table } = await setup()

    expect(within(table).getByText('151 Pokémon in total.')).toBeInTheDocument()

    await act(() => i18n.changeLanguage('pl'))
    expect(await within(table).findByText('151 Pokémonów łącznie.')).toBeInTheDocument()
  })

  it('links each name to its detail page', async () => {
    const { user, table } = await setup()

    await user.click(within(table).getByRole('link', { name: 'bulbasaur' }))

    expect(await screen.findByRole('heading', { level: 1, name: 'bulbasaur' })).toBeInTheDocument()
  })

  it('shows an empty state when the list has no Pokémon', async () => {
    vi.spyOn(http, 'get').mockResolvedValueOnce({ data: { results: [] } })
    await renderRoute('/pokemon')

    expect(await screen.findByText('No Pokémon Yet')).toBeInTheDocument()
    expect(screen.queryByRole('table', { name: 'Pokémon' })).not.toBeInTheDocument()
  })

  it('contains a failed load to its section and recovers on retry', async () => {
    vi.spyOn(http, 'get').mockRejectedValueOnce(new Error('Network Error'))
    const user = userEvent.setup()
    await renderRoute('/pokemon')

    const alert = await screen.findByRole('alert')
    expect(within(alert).getByText('Something Went Wrong')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Find Pokémon' })).toBeInTheDocument()

    await user.click(within(alert).getByRole('button', { name: 'Try Again' }))

    expect(await screen.findByRole('table', { name: 'Pokémon' })).toBeInTheDocument()
  })
})
