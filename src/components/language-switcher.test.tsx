import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { renderRoute } from '@/lib/test-utils'

describe('language switcher', () => {
  it('shows the current language', async () => {
    await renderRoute('/pokemon')

    expect(await screen.findByRole('combobox', { name: 'Language' })).toHaveTextContent('English')
  })

  it('switches the interface to the chosen language', async () => {
    const user = userEvent.setup()
    await renderRoute('/pokemon')

    await user.click(await screen.findByRole('combobox', { name: 'Language' }))
    await user.click(await screen.findByRole('option', { name: 'Polski' }))

    expect(await screen.findByRole('heading', { level: 1, name: 'Pokémony' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Strona główna' })).toBeInTheDocument()
  })
})
