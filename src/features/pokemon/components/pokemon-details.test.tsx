import { act, screen } from '@testing-library/react'
import i18n from 'i18next'
import { describe, expect, it } from 'vitest'

import { renderRoute } from '@/lib/test-utils'

describe('pokemon details', () => {
  it('shows the number, types, measurements and artwork', async () => {
    await renderRoute('/pokemon/bulbasaur')

    expect(await screen.findByRole('heading', { level: 1, name: 'bulbasaur' })).toBeInTheDocument()
    expect(screen.getByText('#001')).toBeInTheDocument()
    expect(screen.getByText('grass')).toBeInTheDocument()
    expect(screen.getByText('poison')).toBeInTheDocument()
    expect(screen.getByText('70 cm')).toBeInTheDocument()
    expect(screen.getByText('6.9 kg')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Official artwork of bulbasaur' })).toBeInTheDocument()
  })

  it('formats numbers for the current language', async () => {
    await renderRoute('/pokemon/bulbasaur')
    await screen.findByText('6.9 kg')

    await act(() => i18n.changeLanguage('pl'))

    expect(await screen.findByText('6,9 kg')).toBeInTheDocument()
  })
})
