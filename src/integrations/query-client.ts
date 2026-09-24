import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    // One retry covers a dropped request without making a real outage wait through several.
    queries: { staleTime: 60_000, retry: 1 },
  },
})
