import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { TechStackTable } from '@/features/tech-stack/components/tech-stack-table'
import { TECH_STACK } from '@/features/tech-stack/lib/tech-stack'
import { bodyRows as rowsOf } from '@/lib/test-utils'

const TOTAL = TECH_STACK.reduce((sum, group) => sum + group.tools.length, 0)

const bodyRows = () => rowsOf(screen.getByRole('table', { name: 'Tech Stack' }))

const names = () => bodyRows().map((row) => row.querySelector('td')?.textContent)

function setup() {
  const user = userEvent.setup()
  render(<TechStackTable />)
  return user
}

describe('TechStackTable', () => {
  it('lists every tool with a docs link', () => {
    setup()

    expect(bodyRows()).toHaveLength(TOTAL)
    expect(screen.getByRole('link', { name: 'TanStack Router Docs' })).toHaveAttribute(
      'href',
      'https://tanstack.com/router',
    )
  })

  it('filters by area', async () => {
    const user = setup()

    await user.click(screen.getByRole('tab', { name: 'Quality' }))

    const quality = TECH_STACK.find((group) => group.title === 'Quality')
    expect(bodyRows()).toHaveLength(quality?.tools.length ?? 0)
    expect(screen.queryByText('React')).not.toBeInTheDocument()
  })

  it('searches by name', async () => {
    const user = setup()

    await user.type(screen.getByRole('searchbox', { name: 'Search Tools' }), 'tanstack')

    expect(bodyRows()).toHaveLength(4)
  })

  it('shows an empty state when nothing matches', async () => {
    const user = setup()

    await user.type(screen.getByRole('searchbox', { name: 'Search Tools' }), 'no-such-tool')

    expect(screen.getByText('No Matching Tools')).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('clears the search and area from the empty state', async () => {
    const user = setup()
    await user.click(screen.getByRole('tab', { name: 'Quality' }))
    await user.type(screen.getByRole('searchbox', { name: 'Search Tools' }), 'no-such-tool')

    await user.click(screen.getByRole('button', { name: 'Clear Filters' }))

    expect(bodyRows()).toHaveLength(TOTAL)
    expect(screen.getByRole('searchbox', { name: 'Search Tools' })).toHaveValue('')
  })

  it('sorts by name ascending, then descending, then back to the source order', async () => {
    const user = setup()
    const header = screen.getByRole('columnheader', { name: 'Tool' })
    const original = names()
    const ascending = original.toSorted((a, b) => String(a).localeCompare(String(b)))
    expect(header).toHaveAttribute('aria-sort', 'none')

    await user.click(screen.getByRole('button', { name: 'Tool' }))
    expect(header).toHaveAttribute('aria-sort', 'ascending')
    expect(names()).toEqual(ascending)

    await user.click(screen.getByRole('button', { name: 'Tool' }))
    expect(header).toHaveAttribute('aria-sort', 'descending')
    expect(names()).toEqual(ascending.toReversed())

    await user.click(screen.getByRole('button', { name: 'Tool' }))
    expect(header).toHaveAttribute('aria-sort', 'none')
    expect(names()).toEqual(original)
  })

  it('does not offer sorting on the description', () => {
    setup()

    expect(screen.getByRole('columnheader', { name: 'What It Does' })).not.toHaveAttribute(
      'aria-sort',
    )
  })
})
