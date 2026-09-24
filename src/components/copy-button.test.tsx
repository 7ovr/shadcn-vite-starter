import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { CopyButton } from '@/components/copy-button'

function setup(options?: Parameters<typeof userEvent.setup>[0]) {
  const user = userEvent.setup(options)
  render(<CopyButton value="pnpm install" label="Copy pnpm install" />)
  return user
}

const copyButton = () => screen.getByRole('button', { name: 'Copy pnpm install' })

describe('CopyButton', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('copies its value and announces it', async () => {
    const user = setup()

    await user.click(copyButton())

    expect(await navigator.clipboard.readText()).toBe('pnpm install')
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Copied')
  })

  it('goes back to its label after two seconds', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const user = setup({ advanceTimers: (ms) => vi.advanceTimersByTime(ms) })
    await user.click(copyButton())
    await screen.findByRole('button', { name: 'Copied' })

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    expect(copyButton()).toBeInTheDocument()
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
  })

  it('claims nothing when the clipboard refuses the write', async () => {
    const user = setup()
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('Denied'))

    await user.click(copyButton())

    expect(copyButton()).toBeInTheDocument()
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
  })
})
