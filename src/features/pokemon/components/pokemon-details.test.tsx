import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { renderRoute } from '@/lib/test-utils'

describe('pokemon details', () => {
  it('shows the number, types, measurements and artwork', async () => {
    await renderRoute('/pokemon/bulbasaur')

    expect(await screen.findByRole('heading', { level: 1, name: 'Bulbasaur' })).toBeInTheDocument()
    expect(screen.getByText('#001')).toBeInTheDocument()
    expect(screen.getByText('Grass')).toBeInTheDocument()
    expect(screen.getByText('Poison')).toBeInTheDocument()
    expect(screen.getByText('70 cm')).toBeInTheDocument()
    expect(screen.getByText('6.9 kg')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Official artwork of Bulbasaur' })).toBeInTheDocument()
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
