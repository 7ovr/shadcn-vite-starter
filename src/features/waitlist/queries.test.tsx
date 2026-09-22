import { act, renderHook, waitFor } from '@testing-library/react'
import { QueryClientProvider, type QueryClient } from '@tanstack/react-query'
import { describe, expect, it } from 'vitest'

import { createTestQueryClient, renderRoute } from '@/test/render'

import { useJoinWaitlist, waitlistQueryOptions } from '@/features/waitlist/queries'

function renderJoin(queryClient: QueryClient) {
  return renderHook(() => useJoinWaitlist(), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  })
}

describe('waitlist queries', () => {
  it('fetches the seeded entries', async () => {
    const queryClient = createTestQueryClient()

    const entries = await queryClient.fetchQuery(waitlistQueryOptions)

    expect(entries.map((entry) => entry.email)).toEqual([
      'margaret@example.com',
      'ada@example.com',
      'alan@example.com',
    ])
  })

  it('is filled by the route loader before the page renders', async () => {
    const { queryClient } = await renderRoute('/waitlist')

    expect(queryClient.getQueryData(waitlistQueryOptions.queryKey)).toHaveLength(3)
  })

  it('adds an entry and invalidates the cached list', async () => {
    const queryClient = createTestQueryClient()
    await queryClient.fetchQuery(waitlistQueryOptions)
    const { result } = renderJoin(queryClient)

    await act(() =>
      result.current.mutateAsync({
        name: 'Grace Hopper',
        email: 'grace@example.com',
      }),
    )

    expect(queryClient.getQueryState(waitlistQueryOptions.queryKey)?.isInvalidated).toBe(true)
    const entries = await queryClient.fetchQuery(waitlistQueryOptions)
    expect(entries).toHaveLength(4)
    expect(entries[0]?.email).toBe('grace@example.com')
  })

  it('stores emails in lower case', async () => {
    const { result } = renderJoin(createTestQueryClient())

    const entry = await act(() =>
      result.current.mutateAsync({
        name: 'Grace Hopper',
        email: 'Grace@Example.com',
      }),
    )

    expect(entry.email).toBe('grace@example.com')
  })

  it('rejects an email that is already on the list', async () => {
    const { result } = renderJoin(createTestQueryClient())

    await act(async () => {
      await expect(
        result.current.mutateAsync({ name: 'Ada', email: 'ADA@example.com' }),
      ).rejects.toThrow('That email is already on the waitlist.')
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
