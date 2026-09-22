import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { pokemonKeys, pokemonListOptions, pokemonOptions } from '@/features/pokemon/api/queries'
import { http } from '@/integrations/axios'
import { renderRoute } from '@/lib/test-utils'

describe('pokemon queries', () => {
  it('keys the list and each Pokemon under the pokemon scope', () => {
    expect(pokemonListOptions().queryKey).toEqual(pokemonKeys.lists())
    expect(pokemonOptions('pikachu').queryKey).toEqual(pokemonKeys.detail('pikachu'))
  })

  it('shares one cache entry however a name is capitalised', () => {
    expect(pokemonOptions('Pikachu').queryKey).toEqual(pokemonOptions('pikachu').queryKey)
  })

  it('renders the page without waiting for the list', async () => {
    vi.spyOn(http, 'get').mockImplementation(() => new Promise(() => {}))

    const { queryClient } = await renderRoute('/pokemon')

    expect(await screen.findByRole('heading', { level: 1, name: 'Pokémon' })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Loading')
    expect(queryClient.getQueryState(pokemonKeys.lists())?.status).toBe('pending')
  })
})
