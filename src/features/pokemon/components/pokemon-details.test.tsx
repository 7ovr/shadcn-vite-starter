import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { http } from '@/integrations/axios'
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

  it('names the browser tab after the Pokémon', async () => {
    await renderRoute('/pokemon/bulbasaur')

    await screen.findByRole('heading', { level: 1, name: 'Bulbasaur' })
    expect(document.title).toBe('Bulbasaur - Starter')
  })

  it('treats a name with characters PokeAPI cannot have as not found, without calling it', async () => {
    const get = vi.spyOn(http, 'get')
    await renderRoute('/pokemon/..%2Fberry')

    expect(await screen.findByRole('heading', { name: 'Pokémon Not Found' })).toBeInTheDocument()
    expect(get).not.toHaveBeenCalled()
  })

  it('keeps the header on a failed load and recovers on retry', async () => {
    vi.spyOn(http, 'get').mockRejectedValueOnce(new Error('Network Error'))
    const user = userEvent.setup()
    await renderRoute('/pokemon/bulbasaur')

    const alert = await screen.findByRole('alert')
    expect(within(alert).getByRole('heading', { name: 'Something Went Wrong' })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument()

    await user.click(within(alert).getByRole('button', { name: 'Try Again' }))

    expect(await screen.findByRole('heading', { level: 1, name: 'Bulbasaur' })).toBeInTheDocument()
  })
})
