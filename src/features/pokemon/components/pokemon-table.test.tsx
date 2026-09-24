import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { installFakePokeApi } from '@/features/pokemon/api/fake-poke-api'
import { http } from '@/integrations/axios'
import { bodyRows, renderRoute } from '@/lib/test-utils'

const pokemonTable = () => screen.getByRole('table', { name: 'Pokémon' })

describe('PokemonTable', () => {
  it('shows the first ten Pokémon with their types, abilities and base stats', async () => {
    await renderRoute('/')

    expect(await within(pokemonTable()).findByText('Bulbasaur')).toBeInTheDocument()
    const rows = bodyRows(pokemonTable())
    expect(rows).toHaveLength(10)
    expect(within(rows[0]!).getByText('Grass')).toBeInTheDocument()
    expect(within(rows[0]!).getByText('Poison')).toBeInTheDocument()
    expect(within(rows[0]!).getByText('Overgrow')).toBeInTheDocument()
    expect(within(rows[0]!).queryByText(/Chlorophyll/)).not.toBeInTheDocument()
    expect(within(rows[0]!).getByText('318')).toBeInTheDocument()
    expect(screen.getByText('30')).toBeInTheDocument()
  })

  it('pages forwards and keeps the page in the URL', async () => {
    const user = userEvent.setup()
    const { router } = await renderRoute('/')
    await within(pokemonTable()).findByText('Bulbasaur')
    expect(screen.getByRole('button', { name: 'Previous Page' })).toBeDisabled()

    await user.click(screen.getByRole('link', { name: 'Next Page' }))

    expect(await within(pokemonTable()).findByText('Metapod')).toBeInTheDocument()
    expect(router.state.location.search).toEqual({ page: 2 })
    expect(screen.getByRole('link', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page')
  })

  it('goes back to the first page when the rows per page change', async () => {
    const user = userEvent.setup()
    const { router } = await renderRoute('/?page=3')
    await within(pokemonTable()).findByText('Spearow')
    expect(screen.getByRole('button', { name: 'Next Page' })).toBeDisabled()

    await user.click(screen.getByRole('combobox', { name: 'Rows Per Page' }))
    await user.click(await screen.findByRole('option', { name: '15' }))

    expect(await within(pokemonTable()).findByText('Bulbasaur')).toBeInTheDocument()
    expect(bodyRows(pokemonTable())).toHaveLength(15)
    expect(router.state.location.search).toEqual({ size: 15 })
  })

  it('offers a way back from a page past the end', async () => {
    const user = userEvent.setup()
    const { router } = await renderRoute('/?page=99')

    expect(await screen.findByText('There are only 3 pages.')).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: 'Back To First Page' }))

    expect(await within(pokemonTable()).findByText('Bulbasaur')).toBeInTheDocument()
    expect(router.state.location.search).toEqual({})
  })

  it('shows an error with a retry when the request fails', async () => {
    vi.mocked(http.get).mockRejectedValue(new Error('Network Error'))
    const user = userEvent.setup()
    await renderRoute('/')

    expect(await screen.findByText('Something Went Wrong')).toBeInTheDocument()

    installFakePokeApi()
    await user.click(screen.getByRole('button', { name: 'Try Again' }))

    expect(await within(pokemonTable()).findByText('Bulbasaur')).toBeInTheDocument()
  })
})
